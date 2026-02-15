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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { saveOutcomeAssessment } from "@/features/tinnitus/actions/tinnitus-actions"
import {
  outcomeMeasureSchema,
  type OutcomeMeasureInput,
} from "@/features/tinnitus/schemas/tinnitus-schema"

export default function OutcomeQuestionnaire() {
  const [isPending, startTransition] = useTransition()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OutcomeMeasureInput>({
    resolver: zodResolver(outcomeMeasureSchema) as Resolver<OutcomeMeasureInput>,
    defaultValues: {
      measurementType: "tfi",
      score: 10,
      globalChange: "no_change",
      treatmentId: undefined,
    },
  })

  const onSubmit = (values: OutcomeMeasureInput) => {
    setErrorMessage(null)
    setSuccessMessage(null)
    startTransition(async () => {
      const result = await saveOutcomeAssessment(values)
      if (!result.success) {
        setErrorMessage(result.error)
        return
      }
      setSuccessMessage("Outcome measures saved. Thank you for tracking your progress.")
    })
  }

  return (
    <Card className="border-emerald-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-slate-900">Outcome Questionnaire</CardTitle>
        <p className="text-sm text-slate-600">
          Track how tinnitus changes over time using standardized measures.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="treatmentId">Treatment ID (optional)</Label>
            <Input
              id="treatmentId"
              placeholder="Paste treatment ID if available"
              className="border-emerald-100 focus-visible:ring-emerald-400"
              {...register("treatmentId")}
            />
          </div>

          <div className="space-y-2">
            <Label>Measurement type</Label>
            <Select
              defaultValue="tfi"
              onValueChange={(value) =>
                setValue("measurementType", value as OutcomeMeasureInput["measurementType"])
              }
            >
              <SelectTrigger className="border-emerald-100 focus:ring-emerald-400">
                <SelectValue placeholder="Select measure" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tfi">TFI</SelectItem>
                <SelectItem value="thi">THI</SelectItem>
                <SelectItem value="ths">THS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="score">Score (0-100)</Label>
            <Input
              id="score"
              type="number"
              min={0}
              max={100}
              className="border-emerald-100 focus-visible:ring-emerald-400"
              {...register("score", { valueAsNumber: true })}
            />
            {errors.score?.message && (
              <p className="text-xs text-rose-600">{errors.score.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label>Global change</Label>
            <Controller
              name="globalChange"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid gap-3 sm:grid-cols-2"
                >
                  {[
                    { value: "very_much_worse", label: "Very much worse" },
                    { value: "much_worse", label: "Much worse" },
                    { value: "a_little_worse", label: "A little worse" },
                    { value: "no_change", label: "No change" },
                    { value: "a_little_better", label: "A little better" },
                    { value: "much_better", label: "Much better" },
                    { value: "very_much_better", label: "Very much better" },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center gap-3 rounded-2xl border border-emerald-100 px-4 py-3"
                    >
                      <RadioGroupItem value={option.value} id={`change-${option.value}`} />
                      <Label htmlFor={`change-${option.value}`}>{option.label}</Label>
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
            className="w-full rounded-full bg-sky-600 hover:bg-sky-700"
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Outcome Measures
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
