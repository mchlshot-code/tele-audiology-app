"use client"

import { useEffect, useMemo, useRef, useState } from "react"

type SoundType =
  | "white_noise"
  | "pink_noise"
  | "brown_noise"
  | "nature_sounds"
  | "rain"
  | "ocean"
  | "forest"
  | "custom"

const soundLabels: Record<SoundType, string> = {
  white_noise: "White noise",
  pink_noise: "Pink noise",
  brown_noise: "Brown noise",
  nature_sounds: "Nature sounds",
  rain: "Rain",
  ocean: "Ocean waves",
  forest: "Forest ambience",
  custom: "Custom upload",
}

export function useSoundMasking() {
  const [soundType, setSoundType] = useState<SoundType>("white_noise")
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(60)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const soundOptions = useMemo(
    () =>
      Object.entries(soundLabels).map(([value, label]) => ({
        value: value as SoundType,
        label,
      })),
    []
  )

  const audioUrl = useMemo(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl) {
      return ""
    }
    const fileMap: Record<SoundType, string> = {
      white_noise: "white-noise.mp3",
      pink_noise: "pink-noise.mp3",
      brown_noise: "brown-noise.mp3",
      nature_sounds: "nature-sounds.mp3",
      rain: "rain.mp3",
      ocean: "ocean-waves.mp3",
      forest: "forest.mp3",
      custom: "custom.mp3",
    }
    return `${supabaseUrl}/storage/v1/object/public/tinnitus-sounds/${fileMap[soundType]}`
  }, [soundType])

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
    }
    audioRef.current.src = audioUrl
    audioRef.current.loop = true
  }, [audioUrl])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  const togglePlayback = async () => {
    if (!audioRef.current) {
      return
    }
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      return
    }
    await audioRef.current.play()
    setIsPlaying(true)
  }

  const stopPlayback = () => {
    if (!audioRef.current) {
      return
    }
    audioRef.current.pause()
    audioRef.current.currentTime = 0
    setIsPlaying(false)
  }

  return {
    soundType,
    setSoundType,
    isPlaying,
    volume,
    setVolume,
    soundOptions,
    togglePlayback,
    stopPlayback,
  }
}
