"use client"

import { useRef, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSoundMasking } from "@/features/tinnitus/hooks/useSoundMasking"
import { saveSoundMaskingSession } from "@/features/tinnitus/actions/tinnitus-actions"

export default function SoundMaskingPlayer() {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const {
    soundType,
    setSoundType,
    isPlaying,
    volume,
    setVolume,
    soundOptions,
    togglePlayback,
    stopPlayback,
  } = useSoundMasking()

  const handleSaveSession = (durationMinutes: number) => {
    startTransition(async () => {
      const result = await saveSoundMaskingSession({
        soundType,
        durationMinutes,
        volumeLevel: volume,
      })
      if (!result.success) {
        setError(result.error)
        return
      }
      setMessage("Session saved to your treatment plan.")
    })
  }

  const handleTogglePlayback = async () => {
    setMessage(null)
    setError(null)
    if (isPlaying && startTimeRef.current) {
      const durationMinutes = Math.max(
        1,
        Math.round((Date.now() - startTimeRef.current) / 60000)
      )
      handleSaveSession(durationMinutes)
      startTimeRef.current = null
    } else {
      startTimeRef.current = Date.now()
    }
    await togglePlayback()
  }

  const handleStop = () => {
    setMessage(null)
    setError(null)
    if (isPlaying && startTimeRef.current) {
      const durationMinutes = Math.max(
        1,
        Math.round((Date.now() - startTimeRef.current) / 60000)
      )
      handleSaveSession(durationMinutes)
      startTimeRef.current = null
    }
    stopPlayback()
  }

  return (
    <Card className="border-emerald-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-slate-900">Sound Masking</CardTitle>
        <p className="text-sm text-slate-600">
          Use calming sounds to reduce tinnitus awareness and support relaxation.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Sound type</Label>
          <Select value={soundType} onValueChange={(value) => setSoundType(value as typeof soundType)}>
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
          <Label htmlFor="volume">Volume: {volume}%</Label>
          <input
            id="volume"
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
            className="w-full accent-emerald-600"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            onClick={handleTogglePlayback}
            className="rounded-full bg-emerald-600 hover:bg-emerald-700"
            disabled={isPending}
          >
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleStop}
            className="rounded-full border-emerald-200 text-emerald-700"
            disabled={isPending}
          >
            Stop
          </Button>
        </div>

        {message && (
          <Alert className="border-emerald-200 bg-emerald-50 text-emerald-700">
            {message}
          </Alert>
        )}
        {error && (
          <Alert className="border-rose-200 bg-rose-50 text-rose-700">{error}</Alert>
        )}

        <Alert className="border-sky-200 bg-sky-50 text-slate-700">
          These sounds are supportive tools and do not replace clinical care. Save
          your session to track usage in your treatment plan.
        </Alert>
      </CardContent>
    </Card>
  )
}
