"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSoundMasking, type SoundType } from "@/features/tinnitus/hooks/useSoundMasking"

type SessionEntry = {
  id: string
  sound_type: string | null
  duration_minutes: number | null
  created_at: string
}

const soundLabels: Record<SoundType, string> = {
  white: "White Noise",
  pink: "Pink Noise",
  brown: "Brown Noise",
  rain: "Rain",
  ocean: "Ocean Waves",
  forest: "Forest Ambience",
}

const sessionOptions = [0, 10, 20, 30]

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-NG", {
    timeZone: "Africa/Lagos",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

export default function SoundMaskingPlayer() {
  const [selectedSound, setSelectedSound] = useState<SoundType>("rain")
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null)
  const [sessionDuration, setSessionDuration] = useState<number>(0)
  const [sessions, setSessions] = useState<SessionEntry[]>([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [historyError, setHistoryError] = useState<string | null>(null)

  const startTimeRef = useRef<number | null>(null)
  const endTimeRef = useRef<number | null>(null)
  const prevPlayingRef = useRef(false)

  const { play, stop, isPlaying, currentSound, volume, setVolume, error } =
    useSoundMasking()

  const soundOptions = useMemo(
    () => [
      { value: "white", label: soundLabels.white },
      { value: "pink", label: soundLabels.pink },
      { value: "brown", label: soundLabels.brown },
      { value: "rain", label: soundLabels.rain },
      { value: "ocean", label: soundLabels.ocean },
      { value: "forest", label: soundLabels.forest },
    ],
    []
  )

  const fetchSessions = useCallback(async () => {
    setHistoryLoading(true)
    setHistoryError(null)
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) {
      setHistoryError("Sign in to view your sound masking history.")
      setHistoryLoading(false)
      return
    }
    const { data, error: sessionsError } = await supabase
      .from("sound_masking_sessions")
      .select("id, sound_type, duration_minutes, created_at")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false })
      .limit(5)
    if (sessionsError) {
      setHistoryError("Unable to load session history.")
      setHistoryLoading(false)
      return
    }
    setSessions(data ?? [])
    setHistoryLoading(false)
  }, [])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  useEffect(() => {
    if (prevPlayingRef.current && !isPlaying) {
      fetchSessions()
    }
    prevPlayingRef.current = isPlaying
  }, [fetchSessions, isPlaying])

  useEffect(() => {
    if (!isPlaying) {
      startTimeRef.current = null
      endTimeRef.current = null
      setElapsedSeconds(0)
      setRemainingSeconds(null)
      return
    }
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now()
    }
    if (sessionDuration > 0) {
      endTimeRef.current = Date.now() + sessionDuration * 60 * 1000
      setRemainingSeconds(sessionDuration * 60)
    } else {
      endTimeRef.current = null
      setRemainingSeconds(null)
    }
  }, [isPlaying, sessionDuration])

  useEffect(() => {
    if (!isPlaying) {
      return
    }
    const interval = window.setInterval(() => {
      if (!startTimeRef.current) {
        return
      }
      const now = Date.now()
      const elapsed = Math.max(0, Math.floor((now - startTimeRef.current) / 1000))
      setElapsedSeconds(elapsed)
      if (endTimeRef.current) {
        const remaining = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000))
        setRemainingSeconds(remaining)
        if (remaining <= 0) {
          endTimeRef.current = null
          stop()
        }
      }
    }, 1000)
    return () => {
      window.clearInterval(interval)
    }
  }, [isPlaying, stop])

  const handlePlayToggle = () => {
    if (isPlaying) {
      stop()
      return
    }
    play(selectedSound)
  }

  const currentSoundLabel = currentSound ? soundLabels[currentSound] : null

  return (
    <Card className="border-emerald-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-slate-900">Sound Masking</CardTitle>
        <p className="text-sm text-slate-600">
          Use calming sounds to reduce tinnitus awareness and support relaxation.
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Sound type</Label>
              <Select
                value={selectedSound}
                onValueChange={(value) => setSelectedSound(value as SoundType)}
              >
                <SelectTrigger className="border-emerald-100 focus:ring-emerald-400">
                  <SelectValue placeholder="Select sound" />
                </SelectTrigger>
                <SelectContent>
                  {soundOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Session timer</Label>
              <Select
                value={String(sessionDuration)}
                onValueChange={(value) => setSessionDuration(Number(value))}
              >
                <SelectTrigger className="border-emerald-100 focus:ring-emerald-400">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {sessionOptions.map((minutes) => (
                    <SelectItem key={minutes} value={String(minutes)}>
                      {minutes === 0 ? "Off" : `${minutes} minutes`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {sessionDuration > 0 && (
                <p className="text-xs text-slate-500">
                  Auto-stop after {sessionDuration} minutes
                </p>
              )}
            </div>

            <div className="space-y-2 rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                <span>{isPlaying ? "Now playing" : "Ready to play"}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[0, 120, 240].map((delay) => (
                    <span
                      key={delay}
                      className={`h-2 w-2 rounded-full ${
                        isPlaying ? "bg-emerald-500 animate-pulse" : "bg-emerald-200"
                      }`}
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-700">
                  {currentSoundLabel ? `Playing: ${currentSoundLabel}` : "Not playing"}
                </p>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                <span>Elapsed: {formatTime(elapsedSeconds)}</span>
                {remainingSeconds !== null && (
                  <span>Auto-stop in: {formatTime(remainingSeconds)}</span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                {volume === 0 ? (
                  <VolumeX className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Volume2 className="h-4 w-4 text-emerald-600" />
                )}
                Volume: {volume}%
              </Label>
              <Slider
                value={[volume]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => setVolume(value[0] ?? 0)}
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={handlePlayToggle}
                className="rounded-full bg-emerald-600 hover:bg-emerald-700"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Play
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={stop}
                className="rounded-full border-emerald-200 text-emerald-700"
              >
                Stop
              </Button>
            </div>

            {error && (
              <Alert className="border-rose-200 bg-rose-50 text-rose-700">{error}</Alert>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-slate-900">Sessions History</h3>
          <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            {historyLoading && <p className="text-sm text-slate-500">Loading sessions…</p>}
            {!historyLoading && historyError && (
              <p className="text-sm text-rose-600">{historyError}</p>
            )}
            {!historyLoading && !historyError && sessions.length === 0 && (
              <p className="text-sm text-slate-500">No sessions saved yet.</p>
            )}
            {!historyLoading && !historyError && sessions.length > 0 && (
              <ul className="space-y-3 text-sm text-slate-700">
                {sessions.map((session) => {
                  const label =
                    session.sound_type && session.sound_type in soundLabels
                      ? soundLabels[session.sound_type as SoundType]
                      : "Sound session"
                  return (
                    <li
                      key={session.id}
                      className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2 last:border-b-0 last:pb-0"
                    >
                      <span className="font-medium text-slate-800">{label}</span>
                      <span className="text-slate-500">
                        {session.duration_minutes ?? 0} min · {formatDate(session.created_at)}
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Alert className="border-sky-200 bg-sky-50 text-slate-700">
            Sound masking is a therapeutic tool. If you experience discomfort, stop immediately and
            consult an audiologist.
          </Alert>
          <div className="space-y-2 text-sm text-slate-600">
            <p>💡 Tip: Set volume to a comfortable level, just below your tinnitus sound</p>
            <p>💡 Tip: Use for 30 minutes before bed to help with sleep</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
