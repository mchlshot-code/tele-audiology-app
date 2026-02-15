import { OutcomeQuestionnaire, TreatmentPlan } from "@/features/tinnitus"

export default function TinnitusTreatmentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50">
      <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="space-y-8">
          <div>
            <p className="text-sm font-semibold text-emerald-700">PTM Plan</p>
            <h1 className="text-3xl font-semibold text-slate-900">Treatment Plan</h1>
            <p className="text-sm text-slate-600">
              This is a screening tool, not a diagnosis.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <TreatmentPlan />
            <OutcomeQuestionnaire />
          </div>
        </div>
      </div>
    </div>
  )
}
