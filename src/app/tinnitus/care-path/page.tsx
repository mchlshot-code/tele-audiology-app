import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createSupabaseServerClient } from "@/lib/supabase-server"

type StepStatus = "completed" | "current" | "locked"

const getRecommendedLevel = (step: string | null) => {
  if (!step) return 1
  if (step === "step_2") return 2
  if (step === "step_3") return 3
  if (step === "step_4") return 4
  return 5
}

export default async function TinnitusCarePathPage() {
  const supabase = createSupabaseServerClient()
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    redirect("/login")
  }

  const userId = userData.user.id
  const [screenings, assessments, latestAssessment] = await Promise.all([
    supabase
      .from("tinnitus_screenings")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("tinnitus_assessments")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("tinnitus_assessments")
      .select("recommended_step, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  const recommendedLevel = getRecommendedLevel(
    latestAssessment.data?.recommended_step ?? null
  )
  const defaultLevel = screenings.count ? 2 : 1
  const currentLevel = Math.max(recommendedLevel, defaultLevel)

  const steps = [
    {
      level: 1,
      title: "Level 1: Triage & referral",
      description: "Complete your tinnitus screener to triage needs.",
      href: "/tinnitus/screener",
      completed: (screenings.count ?? 0) > 0,
    },
    {
      level: 2,
      title: "Level 2: Audiologic evaluation",
      description: "Finish the THS assessment and tinnitus interview.",
      href: "/tinnitus/assessment",
      completed: (assessments.count ?? 0) > 0,
    },
    {
      level: 3,
      title: "Level 3: Skills education",
      description: "Learn coping skills, sound strategies, and daily routines.",
      href: "/tinnitus/education",
      completed: currentLevel > 3,
    },
    {
      level: 4,
      title: "Level 4: Sound therapy",
      description: "Use sound masking and relaxation guidance.",
      href: "/tinnitus/sound-therapy",
      completed: currentLevel > 4,
    },
    {
      level: 5,
      title: "Level 5: Individualized support",
      description: "Coordinate advanced care and long-term support.",
      href: "/consultation",
      completed: currentLevel > 5,
    },
  ]

  const getStatus = (step: (typeof steps)[number]): StepStatus => {
    if (step.completed || step.level < currentLevel) return "completed"
    if (step.level === currentLevel) return "current"
    return "locked"
  }

  const statusStyles: Record<StepStatus, string> = {
    completed: "bg-emerald-100 text-emerald-700",
    current: "bg-sky-100 text-sky-700",
    locked: "bg-slate-100 text-slate-500",
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50">
      <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-emerald-700">PTM Care Path</p>
              <h1 className="text-3xl font-semibold text-slate-900">
                Your tinnitus care journey
              </h1>
              <p className="text-sm text-slate-600">
                Follow the stepped care plan to progress through PTM levels.
              </p>
            </div>
            <Button asChild variant="outline" className="border-emerald-200 text-emerald-700">
              <Link href="/tinnitus/treatment">Back to treatment plan</Link>
            </Button>
          </div>

          <div className="grid gap-4">
            {steps.map((step) => {
              const status = getStatus(step)
              return (
                <Card key={step.level} className="border-emerald-100 bg-white/90">
                  <CardHeader className="flex flex-row items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg text-slate-900">{step.title}</CardTitle>
                      <p className="text-sm text-slate-600">{step.description}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
                    >
                      {status === "completed"
                        ? "Completed"
                        : status === "current"
                        ? "Current"
                        : "Locked"}
                    </span>
                  </CardHeader>
                  <CardContent className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-slate-500">Level {step.level}</p>
                    <Button
                      asChild
                      variant={status === "current" ? "default" : "outline"}
                      className={
                        status === "current"
                          ? "rounded-full bg-sky-600 hover:bg-sky-700"
                          : "rounded-full border-emerald-200 text-emerald-700"
                      }
                      disabled={status === "locked"}
                    >
                      <Link href={step.href}>
                        {status === "current"
                          ? "Continue"
                          : status === "completed"
                          ? "Review"
                          : "Locked"}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
