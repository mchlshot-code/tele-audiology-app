import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createSupabaseServerClient } from "@/lib/supabase-server"

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient()
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    redirect("/login")
  }

  const userId = userData.user.id
  const [
    hearingAssessments,
    tinnitusScreenings,
    tinnitusAssessments,
    outcomeMeasures,
    soundSessions,
    consultations,
  ] = await Promise.all([
    supabase.from("hearing_assessments").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("tinnitus_screenings").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("tinnitus_assessments").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("outcome_measures").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("sound_masking_sessions").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("consultations").select("id", { count: "exact", head: true }).eq("user_id", userId),
  ])

  const metrics = [
    { label: "Hearing assessments", value: hearingAssessments.count ?? 0 },
    { label: "Tinnitus screenings", value: tinnitusScreenings.count ?? 0 },
    { label: "Tinnitus assessments", value: tinnitusAssessments.count ?? 0 },
    { label: "Outcome measures", value: outcomeMeasures.count ?? 0 },
    { label: "Sound sessions", value: soundSessions.count ?? 0 },
    { label: "Consultations", value: consultations.count ?? 0 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-emerald-700">Your dashboard</p>
              <h1 className="text-3xl font-semibold text-slate-900">Care summary</h1>
              <p className="text-sm text-slate-600">
                Track your screenings, assessments, and care progress in one place.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild className="rounded-full bg-sky-600 hover:bg-sky-700">
                <Link href="/triage">Take hearing test</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-emerald-200 text-emerald-700"
              >
                <Link href="/tinnitus/screener">Tinnitus care</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {metrics.map((metric) => (
              <Card key={metric.label} className="border-emerald-100 bg-white/90">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-900">{metric.label}</CardTitle>
                </CardHeader>
                <CardContent className="text-3xl font-semibold text-emerald-700">
                  {metric.value}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
