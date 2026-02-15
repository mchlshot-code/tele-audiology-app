import Link from "next/link"
import { LoginForm } from "@/features/auth"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-5 py-12 sm:px-8 lg:px-10">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5 self-center">
            <p className="text-sm font-semibold text-emerald-700">
              Tele-Audiology Nigeria
            </p>
            <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              Welcome back to compassionate hearing care.
            </h2>
            <p className="text-sm text-slate-600">
              Sign in to manage screenings, consultations, and care plans tailored for
              your needs.
            </p>
            <p className="text-sm text-slate-600">
              New here?{" "}
              <Link href="/signup" className="font-semibold text-sky-700">
                Create an account
              </Link>
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
