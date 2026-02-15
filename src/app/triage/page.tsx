import { RiskCalculatorCard } from "@/features/triage"
import { MEDICAL_DISCLAIMER } from "@/shared/lib/medical-disclaimer"

export default function TriagePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-sky-50">
      <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-sm font-semibold text-emerald-700">
              Hearing Risk Assessment
            </p>
            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              Understand your hearing health in minutes.
            </h1>
            <p className="text-sm text-slate-600">
              This screening helps you decide whether a professional hearing test
              would be helpful. Your answers remain private.
            </p>
            <div className="rounded-2xl border border-emerald-100 bg-white p-4 text-xs text-emerald-900">
              <p className="whitespace-pre-line leading-relaxed">
                {MEDICAL_DISCLAIMER}
              </p>
            </div>
          </div>
          <RiskCalculatorCard />
        </div>
      </div>
    </div>
  )
}
