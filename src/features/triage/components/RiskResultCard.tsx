"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"
import { HeartPulse, TriangleAlert, ShieldCheck } from "lucide-react"

type RiskLevel = "low" | "moderate" | "high"

const riskCopy = {
  low: {
    title: "Low Risk",
    description:
      "Your answers suggest a low risk of hearing difficulty right now. Keep protecting your ears and schedule routine checks.",
    icon: ShieldCheck,
    color: "text-emerald-600",
    background: "bg-emerald-50 border-emerald-100",
  },
  moderate: {
    title: "Moderate Risk",
    description:
      "You may benefit from a professional hearing test. Monitor your symptoms and reduce noise exposure where possible.",
    icon: TriangleAlert,
    color: "text-amber-600",
    background: "bg-amber-50 border-amber-100",
  },
  high: {
    title: "High Risk",
    description:
      "Your responses suggest elevated risk. Please book a consultation for a more detailed, in-person hearing evaluation.",
    icon: HeartPulse,
    color: "text-rose-600",
    background: "bg-rose-50 border-rose-100",
  },
}

type Props = {
  riskLevel: RiskLevel
  onReset: () => void
  isGated?: boolean
}

export default function RiskResultCard({ riskLevel, onReset, isGated }: Props) {
  const details = riskCopy[riskLevel]
  const Icon = details.icon

  return (
    <Card className="border-emerald-100 shadow-sm">
      <CardHeader className="space-y-2">
        <p className="text-xs font-semibold uppercase text-emerald-700">
          Hearing Risk Result
        </p>
        <CardTitle className="text-2xl text-slate-900">
          {isGated ? "Results ready" : details.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {isGated ? (
          <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800">
            <div className="space-y-1">
              <p className="text-sm font-semibold">Sign in to view your full report</p>
              <p className="text-sm text-emerald-800/80">
                Save your comprehensive hearing report and personalized next steps.
              </p>
              <p className="text-xs text-emerald-800/70">Preview: {details.title}</p>
            </div>
          </Alert>
        ) : (
          <Alert className={`flex items-start gap-3 ${details.background}`}>
            <Icon className={`mt-1 h-5 w-5 ${details.color}`} />
            <div>
              <p className="text-sm font-semibold text-slate-900">{details.title}</p>
              <p className="text-sm text-slate-600">{details.description}</p>
            </div>
          </Alert>
        )}
        <div className="flex flex-col gap-3 sm:flex-row">
          {isGated ? (
            <>
              <Button
                asChild
                className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700 sm:w-auto"
              >
                <Link href="/login">Sign in</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full rounded-full border-emerald-200 text-emerald-700 sm:w-auto"
              >
                <Link href="/signup">Create account</Link>
              </Button>
            </>
          ) : (
            <Button
              asChild
              className="w-full rounded-full bg-sky-600 hover:bg-sky-700 sm:w-auto"
            >
              <Link href="/consultation">Book Consultation</Link>
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            className="w-full rounded-full border-emerald-200 text-emerald-700 sm:w-auto"
          >
            Take Assessment Again
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
