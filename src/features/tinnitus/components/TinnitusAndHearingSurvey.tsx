"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useForm, Controller, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { submitTHS } from "@/features/tinnitus/actions/tinnitus-actions"
import { thsSchema, type THSInput } from "@/features/tinnitus/schemas/tinnitus-schema"

export default function TinnitusAndHearingSurvey() {
  const [isPending, startTransition] = useTransition()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [assessmentResult, setAssessmentResult] = useState<{
    assessmentId: string
    impact: string
    recommendedStep: string
    recommendation: string
  } | null>(null)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<THSInput>({
    resolver: zodResolver(thsSchema) as Resolver<THSInput>,
    defaultValues: {
      screeningId: undefined,
      thsSectionAScore: 3,
      thsSectionBScore: 3,
      thsSectionCScreening: false,
      thsSectionDScore: 3,
    },
  })

  const onSubmit = (values: THSInput) => {
    setErrorMessage(null)
    setSuccessMessage(null)
    setAssessmentResult(null)
    startTransition(async () => {
      const result = await submitTHS(values)
      if (!result.success) {
        setErrorMessage(result.error)
        return
      }
      setSuccessMessage("Assessment saved. Your impact level is ready in the treatment plan.")
      if (result.data) {
        setAssessmentResult(result.data as typeof assessmentResult)
      }
    })
  }

  return (
    <Card className="border-emerald-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-slate-900">Tinnitus and Hearing Survey</CardTitle>
        <p className="text-sm text-slate-600">
          This survey helps us understand tinnitus impact across four areas.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="screeningId">Screening ID (optional)</Label>
            <Input
              id="screeningId"
              placeholder="Paste screening ID if available"
              className="border-emerald-100 focus-visible:ring-emerald-400"
              {...register("screeningId")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thsSectionAScore">Section A: Tinnitus problem (0-10)</Label>
            <Input
              id="thsSectionAScore"
              type="number"
              min={0}
              max={10}
              className="border-emerald-100 focus-visible:ring-emerald-400"
              {...register("thsSectionAScore", { valueAsNumber: true })}
            />
            {errors.thsSectionAScore?.message && (
              <p className="text-xs text-rose-600">{errors.thsSectionAScore.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="thsSectionBScore">Section B: Hearing problem (0-10)</Label>
            <Input
              id="thsSectionBScore"
              type="number"
              min={0}
              max={10}
              className="border-emerald-100 focus-visible:ring-emerald-400"
              {...register("thsSectionBScore", { valueAsNumber: true })}
            />
            {errors.thsSectionBScore?.message && (
              <p className="text-xs text-rose-600">{errors.thsSectionBScore.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label>Section C: Sound sensitivity screening</Label>
            <Controller
              name="thsSectionCScreening"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value ? "yes" : "no"}
                  onValueChange={(value) => field.onChange(value === "yes")}
                  className="grid gap-3 sm:grid-cols-2"
                >
                  {[
                    { value: "no", label: "No" },
                    { value: "yes", label: "Yes" },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center gap-3 rounded-2xl border border-emerald-100 px-4 py-3"
                    >
                      <RadioGroupItem value={option.value} id={`sound-${option.value}`} />
                      <Label htmlFor={`sound-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thsSectionDScore">Section D: Overall impact (0-10)</Label>
            <Input
              id="thsSectionDScore"
              type="number"
              min={0}
              max={10}
              className="border-emerald-100 focus-visible:ring-emerald-400"
              {...register("thsSectionDScore", { valueAsNumber: true })}
            />
            {errors.thsSectionDScore?.message && (
              <p className="text-xs text-rose-600">{errors.thsSectionDScore.message}</p>
            )}
          </div>

          {successMessage && (
            <Alert className="border-emerald-200 bg-emerald-50 text-emerald-700">
              {successMessage}
            </Alert>
          )}
          {assessmentResult && (
            <Alert className="border-sky-200 bg-sky-50 text-slate-700">
              <div className="space-y-2">
                <p className="text-sm font-semibold">
                  Recommended PTM step: {assessmentResult.recommendedStep}
                </p>
                <p className="text-sm">Impact level: {assessmentResult.impact}</p>
                <p className="text-sm">{assessmentResult.recommendation}</p>
                <Button
                  asChild
                  className="mt-2 rounded-full bg-sky-600 hover:bg-sky-700"
                >
                  <Link href="/tinnitus/treatment">View treatment plan</Link>
                </Button>
              </div>
            </Alert>
          )}
          {errorMessage && (
            <Alert className="border-rose-200 bg-rose-50 text-rose-700">
              {errorMessage}
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full rounded-full bg-sky-600 hover:bg-sky-700"
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Assessment
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
