"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"
import { getLatestTreatmentPlan } from "@/features/tinnitus/actions/tinnitus-actions"
import { useTinnitus } from "@/features/tinnitus/hooks/useTinnitus"

export default function TreatmentPlan() {
  const [result, setResult] = useState<{
    assessmentId: string
    impact: string
    step: string
    recommendation: string
  } | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const { data, loading, error } = useTinnitus()

  useEffect(() => {
    startTransition(async () => {
      const response = await getLatestTreatmentPlan()
      if (!response.success) {
        setErrorMessage(response.error)
        return
      }
      setResult(response.data)
    })
  }, [startTransition])

  const ptmSteps = [
    {
      step: "step_2",
      label: "Step 2: Audiologic evaluation",
      description: "Complete the THS assessment and tinnitus interview.",
      href: "/tinnitus/assessment",
    },
    {
      step: "step_3",
      label: "Step 3: Skills education",
      description: "Learn coping skills and sound strategies.",
      href: "/tinnitus/education",
    },
    {
      step: "step_4",
      label: "Step 4: Sound therapy",
      description: "Use sound masking to reduce tinnitus contrast.",
      href: "/tinnitus/sound-therapy",
    },
    {
      step: "step_5",
      label: "Step 5: Interdisciplinary evaluation",
      description: "Coordinate audiology and behavioral health care.",
      href: "/consultation",
    },
    {
      step: "step_6",
      label: "Step 6: Individualized support",
      description: "Ongoing, personalized tinnitus management.",
      href: "/consultation",
    },
  ]

  return (
    <Card className="border-emerald-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-slate-900">Treatment Plan</CardTitle>
        <p className="text-sm text-slate-600">
          PTM stepped-care recommendations based on your assessment.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {result && (
          <Alert className="border-emerald-200 bg-emerald-50 text-emerald-700">
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold">Impact: {result.impact}</p>
                <p className="text-sm font-semibold">Recommended step: {result.step}</p>
                <p className="text-sm">{result.recommendation}</p>
              </div>
              <Button asChild className="rounded-full bg-sky-600 hover:bg-sky-700">
                <Link href="/tinnitus/care-path">Open care path</Link>
              </Button>
            </div>
          </Alert>
        )}

        {errorMessage && (
          <Alert className="border-rose-200 bg-rose-50 text-rose-700">
            <div className="space-y-2">
              <p>{errorMessage}</p>
              <Button
                asChild
                className="rounded-full bg-sky-600 hover:bg-sky-700"
                disabled={isPending}
              >
                <Link href="/tinnitus/assessment">Start assessment</Link>
              </Button>
            </div>
          </Alert>
        )}

        <div className="grid gap-3">
          {ptmSteps.map((step) => {
            const isRecommended = result?.step === step.step
            return (
              <Card
                key={step.step}
                className={`border-emerald-100 ${isRecommended ? "bg-emerald-50/70" : "bg-white"}`}
              >
                <CardContent className="space-y-2 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">{step.label}</p>
                    {isRecommended && (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">{step.description}</p>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full border-emerald-200 text-emerald-700"
                  >
                    <Link href={step.href}>Go to step</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Alert className="border-sky-200 bg-sky-50 text-slate-700">
          This is a screening tool, not a diagnosis. Seek a licensed audiologist for
          medical advice.
        </Alert>

        <div className="rounded-2xl border border-emerald-100 bg-white p-4 text-sm text-slate-600">
          {loading && "Loading your tinnitus tracking summary..."}
          {error && !loading && error}
          {data && !loading && (
            <div className="grid gap-2 sm:grid-cols-2">
              <p>Screenings: {data.screenings}</p>
              <p>Assessments: {data.assessments}</p>
              <p>Treatments: {data.treatments}</p>
              <p>Outcome measures: {data.outcomes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
