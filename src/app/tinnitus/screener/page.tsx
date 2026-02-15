import { TinnitusScreener } from "@/features/tinnitus"
import { Alert } from "@/components/ui/alert"
import { MEDICAL_DISCLAIMER } from "@/shared/lib/medical-disclaimer"

export default function TinnitusScreenerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50">
      <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold text-emerald-700">Step 1</p>
            <h1 className="text-3xl font-semibold text-slate-900">Tinnitus Screener</h1>
            <p className="text-sm text-slate-600">
              This is a screening tool, not a diagnosis.
            </p>
          </div>
          <TinnitusScreener />
          <Alert className="border-sky-200 bg-sky-50 text-slate-700">
            <p className="whitespace-pre-line text-sm leading-relaxed">{MEDICAL_DISCLAIMER}</p>
          </Alert>
        </div>
      </div>
    </div>
  )
}
