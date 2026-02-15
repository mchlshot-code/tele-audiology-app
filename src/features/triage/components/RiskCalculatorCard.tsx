"use client"

import { useMemo, useState, useTransition } from "react"
import { useForm, Controller, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert } from "@/components/ui/alert"
import { calculateRisk } from "@/features/triage/actions/triage-actions"
import {
  triageAssessmentSchema,
  type TriageAssessmentInput,
} from "@/features/triage/schemas/triage-schema"
import RiskResultCard from "@/features/triage/components/RiskResultCard"

const steps = [
  "Age",
  "Noise exposure",
  "Difficulty hearing",
  "Tinnitus",
  "Family history",
] as const

type RiskLevel = "low" | "moderate" | "high"

export default function RiskCalculatorCard() {
  const [stepIndex, setStepIndex] = useState(0)
  const [result, setResult] = useState<{ riskLevel: RiskLevel; saved: boolean } | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
    getValues,
  } = useForm<TriageAssessmentInput>({
    resolver: zodResolver(triageAssessmentSchema) as Resolver<TriageAssessmentInput>,
    defaultValues: {
      age: 30,
      noiseExposure: "<1hr",
      difficultyHearing: "No",
      tinnitus: "No",
      familyHistory: "No",
    },
  })

  const progressValue = useMemo(
    () => ((stepIndex + 1) / steps.length) * 100,
    [stepIndex]
  )

  const goNext = async () => {
    const fields: Array<keyof TriageAssessmentInput> = [
      "age",
      "noiseExposure",
      "difficultyHearing",
      "tinnitus",
      "familyHistory",
    ]
    const field = fields[stepIndex]
    const valid = await trigger(field)
    if (valid) {
      setStepIndex((prev) => Math.min(prev + 1, steps.length - 1))
    }
  }

  const goBack = () => {
    setStepIndex((prev) => Math.max(prev - 1, 0))
  }

  const onSubmit = (values: TriageAssessmentInput) => {
    setErrorMessage(null)
    startTransition(async () => {
      const result = await calculateRisk(values)
      if (!result.success) {
        setErrorMessage(result.error)
        return
      }
      setResult({ riskLevel: result.riskLevel, saved: result.saved })
    })
  }

  const resetAssessment = () => {
    setResult(null)
    setErrorMessage(null)
    setStepIndex(0)
    reset(getValues())
  }

  if (result) {
    return (
      <RiskResultCard
        riskLevel={result.riskLevel}
        isGated={!result.saved}
        onReset={resetAssessment}
      />
    )
  }

  return (
    <Card className="border-emerald-100 shadow-sm">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-emerald-700">
          <span>Step {stepIndex + 1} of {steps.length}</span>
          <span>{steps[stepIndex]}</span>
        </div>
        <Progress value={progressValue} className="h-2" />
        <CardTitle className="text-2xl text-slate-900">
          Hearing Risk Assessment
        </CardTitle>
        <p className="text-sm text-slate-600">
          Answer a few quick questions to understand your hearing risk and next steps.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {stepIndex === 0 && (
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min={1}
                max={120}
                className="border-emerald-100 focus-visible:ring-emerald-400"
                {...register("age", { valueAsNumber: true })}
              />
              {errors.age?.message && (
                <p className="text-xs text-rose-600">{errors.age.message}</p>
              )}
            </div>
          )}

          {stepIndex === 1 && (
            <div className="space-y-3">
              <Label>Hours of noise exposure per day</Label>
              <Controller
                name="noiseExposure"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="grid gap-3 sm:grid-cols-2"
                  >
                    {["<1hr", "1-3hr", "4-6hr", "6+hr"].map((option) => (
                      <div
                        key={option}
                        className="flex items-center gap-3 rounded-2xl border border-emerald-100 px-4 py-3"
                      >
                        <RadioGroupItem value={option} id={`noise-${option}`} />
                        <Label htmlFor={`noise-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              />
              {errors.noiseExposure?.message && (
                <p className="text-xs text-rose-600">
                  {errors.noiseExposure.message}
                </p>
              )}
            </div>
          )}

          {stepIndex === 2 && (
            <div className="space-y-3">
              <Label>Difficulty hearing</Label>
              <Controller
                name="difficultyHearing"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="grid gap-3 sm:grid-cols-2"
                  >
                    {["No", "Sometimes", "Often", "Always"].map((option) => (
                      <div
                        key={option}
                        className="flex items-center gap-3 rounded-2xl border border-emerald-100 px-4 py-3"
                      >
                        <RadioGroupItem
                          value={option}
                          id={`hearing-${option}`}
                        />
                        <Label htmlFor={`hearing-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              />
              {errors.difficultyHearing?.message && (
                <p className="text-xs text-rose-600">
                  {errors.difficultyHearing.message}
                </p>
              )}
            </div>
          )}

          {stepIndex === 3 && (
            <div className="space-y-3">
              <Label>Tinnitus or ringing in ears</Label>
              <Controller
                name="tinnitus"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="grid gap-3 sm:grid-cols-2"
                  >
                    {["No", "Occasionally", "Frequently"].map((option) => (
                      <div
                        key={option}
                        className="flex items-center gap-3 rounded-2xl border border-emerald-100 px-4 py-3"
                      >
                        <RadioGroupItem
                          value={option}
                          id={`tinnitus-${option}`}
                        />
                        <Label htmlFor={`tinnitus-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              />
              {errors.tinnitus?.message && (
                <p className="text-xs text-rose-600">{errors.tinnitus.message}</p>
              )}
            </div>
          )}

          {stepIndex === 4 && (
            <div className="space-y-3">
              <Label>Family history of hearing loss</Label>
              <Controller
                name="familyHistory"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="grid gap-3 sm:grid-cols-2"
                  >
                    {["No", "Yes", "Unsure"].map((option) => (
                      <div
                        key={option}
                        className="flex items-center gap-3 rounded-2xl border border-emerald-100 px-4 py-3"
                      >
                        <RadioGroupItem
                          value={option}
                          id={`family-${option}`}
                        />
                        <Label htmlFor={`family-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              />
              {errors.familyHistory?.message && (
                <p className="text-xs text-rose-600">
                  {errors.familyHistory.message}
                </p>
              )}
            </div>
          )}

          {errorMessage && (
            <Alert className="border-rose-200 bg-rose-50 text-rose-700">
              {errorMessage}
            </Alert>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={stepIndex === 0 || isPending}
              className="rounded-full border-emerald-200 text-emerald-700"
            >
              Previous
            </Button>
            {stepIndex < steps.length - 1 ? (
              <Button
                type="button"
                onClick={goNext}
                disabled={isPending}
                className="rounded-full bg-emerald-600 hover:bg-emerald-700"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isPending}
                className="rounded-full bg-sky-600 hover:bg-sky-700"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Get Results
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
