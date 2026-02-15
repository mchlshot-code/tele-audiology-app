"use client"

import { useState } from "react"
import { useForm, Controller, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert } from "@/components/ui/alert"
import {
  tinnitusInterviewSchema,
  type TinnitusInterviewInput,
} from "@/features/tinnitus/schemas/tinnitus-schema"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function TinnitusInterview() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TinnitusInterviewInput>({
    resolver: zodResolver(tinnitusInterviewSchema) as Resolver<TinnitusInterviewInput>,
    defaultValues: {
      onset: "gradual",
      laterality: "both",
      soundDescription: "",
      triggers: "",
      hearingCareHistory: "none",
      noiseExposure: "moderate",
      sleepQuality: "fair",
      stressLevel: "moderate",
    },
  })

  const onSubmit = () => {
    setSuccessMessage("Interview responses captured for your care team.")
  }

  return (
    <Card className="border-emerald-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-slate-900">Tinnitus Interview</CardTitle>
        <p className="text-sm text-slate-600">
          A comprehensive interview supports personalized treatment planning.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label>Onset</Label>
            <Controller
              name="onset"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="border-emerald-100 focus:ring-emerald-400">
                    <SelectValue placeholder="Select onset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sudden">Sudden</SelectItem>
                    <SelectItem value="gradual">Gradual</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Where do you hear the sound?</Label>
            <Controller
              name="laterality"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="border-emerald-100 focus:ring-emerald-400">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left ear</SelectItem>
                    <SelectItem value="right">Right ear</SelectItem>
                    <SelectItem value="both">Both ears</SelectItem>
                    <SelectItem value="head">Inside the head</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="soundDescription">Describe the sound</Label>
            <Input
              id="soundDescription"
              placeholder="Ringing, buzzing, humming..."
              className="border-emerald-100 focus-visible:ring-emerald-400"
              {...register("soundDescription")}
            />
            {errors.soundDescription?.message && (
              <p className="text-xs text-rose-600">{errors.soundDescription.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="triggers">Triggers (optional)</Label>
            <Input
              id="triggers"
              placeholder="Noise, stress, caffeine..."
              className="border-emerald-100 focus-visible:ring-emerald-400"
              {...register("triggers")}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Hearing care history</Label>
              <Controller
                name="hearingCareHistory"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="border-emerald-100 focus:ring-emerald-400">
                      <SelectValue placeholder="Select history" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None yet</SelectItem>
                      <SelectItem value="hearing_test">Hearing test</SelectItem>
                      <SelectItem value="hearing_aids">Hearing aids</SelectItem>
                      <SelectItem value="medical_visit">Medical visit</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Noise exposure level</Label>
              <Controller
                name="noiseExposure"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="border-emerald-100 focus:ring-emerald-400">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Sleep quality</Label>
              <Controller
                name="sleepQuality"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="border-emerald-100 focus:ring-emerald-400">
                      <SelectValue placeholder="Select sleep quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Stress level</Label>
              <Controller
                name="stressLevel"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="border-emerald-100 focus:ring-emerald-400">
                      <SelectValue placeholder="Select stress" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {successMessage && (
            <Alert className="border-emerald-200 bg-emerald-50 text-emerald-700">
              {successMessage}
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700"
          >
            Save Interview
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
