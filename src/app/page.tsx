import Link from "next/link"
import { HeartPulse, Stethoscope, ShoppingBag, ClipboardCheck, CalendarCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"
import { MEDICAL_DISCLAIMER } from "@/shared/lib/medical-disclaimer"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50 text-slate-900">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 lg:px-10">
        <section className="grid gap-10 rounded-3xl bg-gradient-to-br from-sky-100/70 via-white to-emerald-100/70 p-8 shadow-sm lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-700">
              Trusted hearing care across Nigeria
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
              Expert Hearing Care, From Anywhere in Nigeria
            </h1>
            <p className="text-base text-slate-600 sm:text-lg">
              Free hearing risk assessment • Virtual consultations • Quality ear care products
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild className="rounded-full bg-sky-600 px-6 py-3 text-white hover:bg-sky-700">
                <Link href="/triage">Free Hearing Test</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-emerald-200 px-6 py-3 text-emerald-700"
              >
                <Link href="/shop">Shop Products</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-sky-100 bg-white/90">
              <CardHeader className="space-y-2">
                <HeartPulse className="h-6 w-6 text-sky-600" />
                <CardTitle className="text-lg">Free Hearing Assessment</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                Quick 5-minute online test to understand your hearing risk.
              </CardContent>
            </Card>
            <Card className="border-emerald-100 bg-white/90">
              <CardHeader className="space-y-2">
                <Stethoscope className="h-6 w-6 text-emerald-600" />
                <CardTitle className="text-lg">Expert Consultations</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                Book virtual appointments with student audiologist support.
              </CardContent>
            </Card>
            <Card className="border-emerald-100 bg-white/90">
              <CardHeader className="space-y-2">
                <ShoppingBag className="h-6 w-6 text-emerald-600" />
                <CardTitle className="text-lg">Quality Products</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                Batteries, earplugs, and care products delivered to your door.
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-16">
          <div className="text-center">
            <p className="text-sm font-semibold text-emerald-700">How it works</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Simple steps to better hearing</h2>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Card className="border-sky-100">
              <CardHeader className="space-y-2">
                <ClipboardCheck className="h-6 w-6 text-sky-600" />
                <CardTitle className="text-lg">1. Take free risk assessment</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                Answer a few questions about your hearing and lifestyle.
              </CardContent>
            </Card>
            <Card className="border-emerald-100">
              <CardHeader className="space-y-2">
                <CalendarCheck className="h-6 w-6 text-emerald-600" />
                <CardTitle className="text-lg">2. Book consultation if needed</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                Get guidance from a student audiologist and next-step advice.
              </CardContent>
            </Card>
            <Card className="border-sky-100">
              <CardHeader className="space-y-2">
                <ShoppingBag className="h-6 w-6 text-sky-600" />
                <CardTitle className="text-lg">3. Order recommended products</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                Receive trusted ear care items delivered across Nigeria.
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-16">
          <Alert className="border-sky-200 bg-sky-50 text-slate-700">
            <p className="whitespace-pre-line text-sm font-medium leading-relaxed">
              {MEDICAL_DISCLAIMER}
            </p>
          </Alert>
        </section>

        <footer className="mt-16 flex flex-col gap-4 border-t border-emerald-100 pt-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="font-medium text-emerald-700">
              Privacy Policy
            </Link>
            <Link href="/terms" className="font-medium text-emerald-700">
              Terms of Service
            </Link>
            <a href="mailto:hello@teleaudiology.ng" className="font-medium text-emerald-700">
              hello@teleaudiology.ng
            </a>
          </div>
          <p className="text-xs text-slate-500">Made with ❤️ in Nigeria</p>
        </footer>
      </div>
    </div>
  )
}
