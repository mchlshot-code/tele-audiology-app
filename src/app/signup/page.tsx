import Link from "next/link"
import { SignupForm } from "@/features/auth"
import { MEDICAL_DISCLAIMER } from "@/shared/lib/medical-disclaimer"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-sky-50">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-5 py-12 sm:px-8 lg:px-10">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6 self-center">
            <p className="text-sm font-semibold text-sky-700">
              Start your hearing care journey
            </p>
            <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              Create your patient profile with confidence.
            </h2>
            <p className="text-sm text-slate-600">
              We only collect essential information to personalize your screening and
              consultation experience.
            </p>
            <div className="rounded-2xl border border-emerald-100 bg-white p-4 text-xs text-emerald-900">
              <p className="whitespace-pre-line leading-relaxed">
                {MEDICAL_DISCLAIMER}
              </p>
            </div>
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-emerald-700">
                Sign in
              </Link>
            </p>
          </div>
          <SignupForm />
        </div>
      </div>
    </div>
  )
}
