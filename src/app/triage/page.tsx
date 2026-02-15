import { RiskCalculatorCard } from "@/features/triage"

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
          </div>
          <RiskCalculatorCard />
        </div>
      </div>
    </div>
  )
}
