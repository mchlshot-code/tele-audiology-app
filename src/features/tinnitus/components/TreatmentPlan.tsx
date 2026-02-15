"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert } from "@/components/ui/alert"
import { getTreatmentRecommendation } from "@/features/tinnitus/actions/tinnitus-actions"
import { useTinnitus } from "@/features/tinnitus/hooks/useTinnitus"

export default function TreatmentPlan() {
  const [assessmentId, setAssessmentId] = useState("")
  const [result, setResult] = useState<{
    impact: string
    step: string
    recommendation: string
  } | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const { data, loading, error } = useTinnitus()

  const handleRecommendation = () => {
    setErrorMessage(null)
    setResult(null)
    if (!assessmentId) {
      setErrorMessage("Enter an assessment ID to continue.")
      return
    }
    startTransition(async () => {
      const response = await getTreatmentRecommendation(assessmentId)
      if (!response.success) {
        setErrorMessage(response.error)
        return
      }
      setResult(response.data)
    })
  }

  return (
    <Card className="border-emerald-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-slate-900">Treatment Plan</CardTitle>
        <p className="text-sm text-slate-600">
          PTM stepped-care recommendations based on your assessment.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="assessmentId">Assessment ID</Label>
          <Input
            id="assessmentId"
            placeholder="Paste assessment ID"
            value={assessmentId}
            onChange={(event) => setAssessmentId(event.target.value)}
            className="border-emerald-100 focus-visible:ring-emerald-400"
          />
        </div>

        <Button
          type="button"
          onClick={handleRecommendation}
          className="rounded-full bg-emerald-600 hover:bg-emerald-700"
          disabled={isPending}
        >
          Get Recommendation
        </Button>

        {result && (
          <Alert className="border-emerald-200 bg-emerald-50 text-emerald-700">
            <div className="space-y-1">
              <p className="text-sm font-semibold">Impact: {result.impact}</p>
              <p className="text-sm font-semibold">Recommended step: {result.step}</p>
              <p className="text-sm">{result.recommendation}</p>
            </div>
          </Alert>
        )}

        {errorMessage && (
          <Alert className="border-rose-200 bg-rose-50 text-rose-700">{errorMessage}</Alert>
        )}

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
