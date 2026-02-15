"use client"

import { useState, useTransition } from "react"
import { useForm, Controller, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { submitScreener } from "@/features/tinnitus/actions/tinnitus-actions"
import {
  tinnitusScreenerSchema,
  type TinnitusScreenerInput,
} from "@/features/tinnitus/schemas/tinnitus-schema"

export default function TinnitusScreener() {
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TinnitusScreenerInput>({
    resolver: zodResolver(tinnitusScreenerSchema) as Resolver<TinnitusScreenerInput>,
    defaultValues: {
      duration: "recent_onset",
      bothersomenessScore: 3,
      sleepImpact: "none",
      concentrationImpact: "none",
      emotionalImpact: "none",
      hearingDifficulty: "no",
    },
  })

  const onSubmit = (values: TinnitusScreenerInput) => {
    setErrorMessage(null)
    setSuccessMessage(null)
    startTransition(async () => {
      const result = await submitScreener(values)
      if (!result.success) {
        setErrorMessage(result.error)
        return
      }
      setSuccessMessage("Screening saved. You can continue to the full assessment.")
      reset(values)
    })
  }

  return (
    <Card className="border-emerald-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-slate-900">Tinnitus Screener</CardTitle>
        <p className="text-sm text-slate-600">
          Answer six quick questions to understand how tinnitus affects you.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-3">
            <Label>How would you describe the duration of your tinnitus?</Label>
            <Controller
              name="duration"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid gap-3 sm:grid-cols-2"
                >
                  {[
                    { value: "recent_onset", label: "Recent onset" },
                    { value: "occasional", label: "Occasional" },
                    { value: "intermittent", label: "Intermittent" },
                    { value: "temporary", label: "Temporary" },
                    { value: "persistent", label: "Persistent" },
                    { value: "constant", label: "Constant" },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center gap-3 rounded-2xl border border-emerald-100 px-4 py-3"
                    >
                      <RadioGroupItem value={option.value} id={`duration-${option.value}`} />
                      <Label htmlFor={`duration-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bothersomenessScore">
              How bothersome is your tinnitus? (0-10)
            </Label>
            <Input
              id="bothersomenessScore"
              type="number"
              min={0}
              max={10}
              className="border-emerald-100 focus-visible:ring-emerald-400"
              {...register("bothersomenessScore", { valueAsNumber: true })}
            />
            {errors.bothersomenessScore?.message && (
              <p className="text-xs text-rose-600">{errors.bothersomenessScore.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label>How much does tinnitus affect your sleep?</Label>
            <Controller
              name="sleepImpact"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid gap-3 sm:grid-cols-2"
                >
                  {["none", "mild", "moderate", "severe"].map((option) => (
                    <div
                      key={option}
                      className="flex items-center gap-3 rounded-2xl border border-emerald-100 px-4 py-3"
                    >
                      <RadioGroupItem value={option} id={`sleep-${option}`} />
                      <Label htmlFor={`sleep-${option}`}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
          </div>

          <div className="space-y-3">
            <Label>How much does tinnitus affect concentration?</Label>
            <Controller
              name="concentrationImpact"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid gap-3 sm:grid-cols-2"
                >
                  {["none", "mild", "moderate", "severe"].map((option) => (
                    <div
                      key={option}
                      className="flex items-center gap-3 rounded-2xl border border-emerald-100 px-4 py-3"
                    >
                      <RadioGroupItem value={option} id={`concentration-${option}`} />
                      <Label htmlFor={`concentration-${option}`}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
          </div>

          <div className="space-y-3">
            <Label>How much does tinnitus affect your mood?</Label>
            <Controller
              name="emotionalImpact"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid gap-3 sm:grid-cols-2"
                >
                  {["none", "mild", "moderate", "severe"].map((option) => (
                    <div
                      key={option}
                      className="flex items-center gap-3 rounded-2xl border border-emerald-100 px-4 py-3"
                    >
                      <RadioGroupItem value={option} id={`emotional-${option}`} />
                      <Label htmlFor={`emotional-${option}`}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
          </div>

          <div className="space-y-3">
            <Label>How often do you notice hearing difficulties?</Label>
            <Controller
              name="hearingDifficulty"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid gap-3 sm:grid-cols-2"
                >
                  {[
                    { value: "no", label: "No" },
                    { value: "sometimes", label: "Sometimes" },
                    { value: "often", label: "Often" },
                    { value: "always", label: "Always" },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center gap-3 rounded-2xl border border-emerald-100 px-4 py-3"
                    >
                      <RadioGroupItem value={option.value} id={`hearing-${option.value}`} />
                      <Label htmlFor={`hearing-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
          </div>

          {successMessage && (
            <Alert className="border-emerald-200 bg-emerald-50 text-emerald-700">
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert className="border-rose-200 bg-rose-50 text-rose-700">
              {errorMessage}
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700"
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Screener
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
