"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { supabase } from "@/lib/supabase"

export type NoiseSoundType = "white" | "pink" | "brown"
export type AmbientSoundType = "rain" | "ocean" | "forest"
export type SoundType = NoiseSoundType | AmbientSoundType

export type UseSoundMaskingReturn = {
  play: (soundType: SoundType) => void
  stop: () => void
  setVolume: (value: number) => void
  isPlaying: boolean
  currentSound: SoundType | null
  volume: number
  error: string | null
}

const DEFAULT_VOLUME = 60
const VOLUME_STORAGE_KEY = "tinnitus.soundMasking.volume"

const fileMap: Record<AmbientSoundType, string> = {
  rain: "rain.mp3",
  ocean: "ocean.mp3",
  forest: "forest.mp3",
}

const fadeDurationMs = 350

/** Hybrid sound masking hook with Web Audio and HTML5 Audio support. */
export function useSoundMasking(): UseSoundMaskingReturn {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSound, setCurrentSound] = useState<SoundType | null>(null)
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME)
  const [error, setError] = useState<string | null>(null)

  const audioContextRef = useRef<AudioContext | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const htmlAudioRef = useRef<HTMLAudioElement | null>(null)
  const fadeIntervalRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  const htmlAudioUrl = useMemo(() => {
    if (!supabaseUrl) {
      return null
    }
    return (soundType: AmbientSoundType) =>
      `${supabaseUrl}/storage/v1/object/public/sounds/${fileMap[soundType]}`
  }, [supabaseUrl])

  /** Create white noise buffer. */
  const createWhiteNoise = useCallback((audioContext: AudioContext) => {
    const bufferSize = 2 * audioContext.sampleRate
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
    const output = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i += 1) {
      output[i] = Math.random() * 2 - 1
    }
    return noiseBuffer
  }, [])

  /** Create pink noise buffer using Voss-McCartney algorithm. */
  const createPinkNoise = useCallback((audioContext: AudioContext) => {
    const bufferSize = 2 * audioContext.sampleRate
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
    const output = noiseBuffer.getChannelData(0)
    let b0 = 0.0
    let b1 = 0.0
    let b2 = 0.0
    let b3 = 0.0
    let b4 = 0.0
    let b5 = 0.0
    let b6 = 0.0
    for (let i = 0; i < bufferSize; i += 1) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.969 * b2 + white * 0.153852
      b3 = 0.8665 * b3 + white * 0.3104856
      b4 = 0.55 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.016898
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362
      output[i] *= 0.11
      b6 = white * 0.115926
    }
    return noiseBuffer
  }, [])

  /** Create brown noise buffer by integrating white noise. */
  const createBrownNoise = useCallback((audioContext: AudioContext) => {
    const bufferSize = 2 * audioContext.sampleRate
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
    const output = noiseBuffer.getChannelData(0)
    let lastOut = 0.0
    for (let i = 0; i < bufferSize; i += 1) {
      const white = Math.random() * 2 - 1
      output[i] = (lastOut + 0.02 * white) / 1.02
      lastOut = output[i]
      output[i] *= 3.5
    }
    return noiseBuffer
  }, [])

  const clearFadeInterval = () => {
    if (fadeIntervalRef.current) {
      window.clearInterval(fadeIntervalRef.current)
      fadeIntervalRef.current = null
    }
  }

  const fadeHtmlAudio = useCallback(
    (audio: HTMLAudioElement, targetVolume: number, onComplete?: () => void) => {
      clearFadeInterval()
      const startVolume = audio.volume
      const steps = Math.max(1, Math.round(fadeDurationMs / 50))
      let step = 0
      fadeIntervalRef.current = window.setInterval(() => {
        step += 1
        const next = startVolume + ((targetVolume - startVolume) * step) / steps
        audio.volume = Math.min(1, Math.max(0, next))
        if (step >= steps) {
          clearFadeInterval()
          if (onComplete) {
            onComplete()
          }
        }
      }, fadeDurationMs / steps)
    },
    []
  )

  const applyVolume = useCallback((nextVolume: number) => {
    if (gainNodeRef.current && audioContextRef.current) {
      const now = audioContextRef.current.currentTime
      gainNodeRef.current.gain.cancelScheduledValues(now)
      gainNodeRef.current.gain.setTargetAtTime(nextVolume / 100, now, 0.05)
    }
    if (htmlAudioRef.current) {
      htmlAudioRef.current.volume = nextVolume / 100
    }
  }, [])

  const logSoundMaskingSession = useCallback(
    async (soundType: SoundType, durationSeconds: number) => {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData.user) {
        return
      }
      const soundTypeMap: Record<SoundType, string> = {
        white: "white_noise",
        pink: "pink_noise",
        brown: "brown_noise",
        rain: "rain",
        ocean: "ocean",
        forest: "forest",
      }
      await supabase.from("sound_masking_sessions").insert({
        user_id: userData.user.id,
        sound_type: soundTypeMap[soundType],
        duration_minutes: Math.max(1, Math.round(durationSeconds / 60)),
        volume_level: volume,
      })
    },
    [volume]
  )

  const stopWebAudio = useCallback(() => {
    const audioContext = audioContextRef.current
    const gainNode = gainNodeRef.current
    const source = sourceRef.current
    if (!audioContext || !gainNode || !source) {
      return
    }
    const now = audioContext.currentTime
    gainNode.gain.cancelScheduledValues(now)
    gainNode.gain.setValueAtTime(gainNode.gain.value, now)
    gainNode.gain.linearRampToValueAtTime(0, now + fadeDurationMs / 1000)
    window.setTimeout(() => {
      try {
        source.stop()
      } catch {
        return
      } finally {
        source.disconnect()
        sourceRef.current = null
      }
    }, fadeDurationMs)
  }, [])

  const stopHtmlAudio = useCallback(() => {
    if (!htmlAudioRef.current) {
      return
    }
    const audio = htmlAudioRef.current
    fadeHtmlAudio(audio, 0, () => {
      audio.pause()
      audio.currentTime = 0
      htmlAudioRef.current = null
    })
  }, [fadeHtmlAudio])

  /** Stop playback and log usage. */
  const stop = useCallback(() => {
    if (!isPlaying || !currentSound) {
      setIsPlaying(false)
      setCurrentSound(null)
      return
    }
    const durationSeconds = startTimeRef.current
      ? (Date.now() - startTimeRef.current) / 1000
      : 0
    startTimeRef.current = null
    void logSoundMaskingSession(currentSound, durationSeconds)
    stopWebAudio()
    stopHtmlAudio()
    setIsPlaying(false)
    setCurrentSound(null)
  }, [currentSound, isPlaying, logSoundMaskingSession, stopHtmlAudio, stopWebAudio])

  /** Start playback for a selected sound type. */
  const play = useCallback(
    async (soundType: SoundType) => {
      setError(null)
      if (isPlaying && currentSound === soundType) {
        return
      }
      if (isPlaying && currentSound && currentSound !== soundType) {
        stop()
      }
      if (soundType === "white" || soundType === "pink" || soundType === "brown") {
        if (
          typeof window === "undefined" ||
          !window.AudioContext ||
          !audioContextRef.current ||
          !gainNodeRef.current
        ) {
          setError("Web Audio API is not available in this browser.")
          return
        }
        try {
          if (audioContextRef.current.state === "suspended") {
            await audioContextRef.current.resume()
          }
          const buffer =
            soundType === "white"
              ? createWhiteNoise(audioContextRef.current)
              : soundType === "pink"
              ? createPinkNoise(audioContextRef.current)
              : createBrownNoise(audioContextRef.current)
          const source = audioContextRef.current.createBufferSource()
          source.buffer = buffer
          source.loop = true
          source.connect(gainNodeRef.current)
          const now = audioContextRef.current.currentTime
          gainNodeRef.current.gain.cancelScheduledValues(now)
          gainNodeRef.current.gain.setValueAtTime(0, now)
          gainNodeRef.current.gain.linearRampToValueAtTime(volume / 100, now + fadeDurationMs / 1000)
          source.start()
          sourceRef.current = source
        } catch {
          setError("Unable to start noise playback.")
          return
        }
      } else {
        if (!htmlAudioUrl) {
          setError("Supabase URL is not configured.")
          return
        }
        const url = htmlAudioUrl(soundType)
        const audio = new Audio(url)
        audio.loop = true
        audio.volume = 0
        audio.addEventListener("error", () => {
          setError("Unable to load the selected sound.")
        })
        try {
          await audio.play()
        } catch {
          setError("Unable to start audio playback.")
          return
        }
        fadeHtmlAudio(audio, volume / 100)
        htmlAudioRef.current = audio
      }
      startTimeRef.current = Date.now()
      setIsPlaying(true)
      setCurrentSound(soundType)
    },
    [
      audioContextRef,
      createBrownNoise,
      createPinkNoise,
      createWhiteNoise,
      currentSound,
      fadeHtmlAudio,
      htmlAudioUrl,
      isPlaying,
      stop,
      volume,
    ]
  )

  /** Set volume between 0-100 for all audio engines. */
  const setVolume = useCallback(
    (value: number) => {
      const nextVolume = Math.min(100, Math.max(0, value))
      setVolumeState(nextVolume)
      applyVolume(nextVolume)
    },
    [applyVolume]
  )

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    const stored = window.localStorage.getItem(VOLUME_STORAGE_KEY)
    if (stored) {
      const parsed = Number(stored)
      if (!Number.isNaN(parsed)) {
        setVolumeState(Math.min(100, Math.max(0, parsed)))
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(VOLUME_STORAGE_KEY, String(volume))
    }
    applyVolume(volume)
  }, [applyVolume, volume])

  useEffect(() => {
    if (typeof window === "undefined" || !window.AudioContext) {
      return
    }
    try {
      const audioContext = new window.AudioContext()
      audioContextRef.current = audioContext
      const gainNode = audioContext.createGain()
      gainNode.gain.value = DEFAULT_VOLUME / 100
      gainNode.connect(audioContext.destination)
      gainNodeRef.current = gainNode
    } catch {
      setError("Unable to initialize Web Audio API.")
    }
    return () => {
      stop()
      clearFadeInterval()
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => undefined)
        audioContextRef.current = null
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect()
        gainNodeRef.current = null
      }
    }
  }, [stop])

  useEffect(() => {
    return () => {
      clearFadeInterval()
      if (htmlAudioRef.current) {
        htmlAudioRef.current.pause()
        htmlAudioRef.current = null
      }
    }
  }, [])

  return {
    play,
    stop,
    setVolume,
    isPlaying,
    currentSound,
    volume,
    error,
  }
}
