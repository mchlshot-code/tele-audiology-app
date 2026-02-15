import Link from "next/link"
import { redirect } from "next/navigation"
import { SoundMaskingPlayer } from "@/features/tinnitus"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createSupabaseServerClient } from "@/lib/supabase-server"

export default async function SoundTherapyPage() {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase.auth.getUser()
  if (!data.user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50">
      <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-emerald-700">PTM Sound Therapy</p>
              <h1 className="text-3xl font-semibold text-slate-900">Sound Masking</h1>
              <p className="text-sm text-slate-600">
                This is a screening tool, not a diagnosis.
              </p>
            </div>
            <Button asChild variant="outline" className="border-emerald-200 text-emerald-700">
              <Link href="/tinnitus/screener">Back to tinnitus screener</Link>
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="border-emerald-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900">
                  How sound masking therapy helps
                </CardTitle>
                <p className="text-sm text-slate-600">
                  Sound masking reduces contrast between tinnitus and your environment,
                  making it easier to focus, relax, and sleep.
                </p>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-slate-600">
                <div className="space-y-2">
                  <p className="font-semibold text-slate-900">Sound types explained</p>
                  <ul className="list-disc space-y-2 pl-5">
                    <li>
                      <span className="font-semibold text-slate-800">White Noise:</span>{" "}
                      All frequencies, good for general masking.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-800">Pink Noise:</span>{" "}
                      More natural, less harsh than white.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-800">Brown Noise:</span>{" "}
                      Deep and calming, good for sleep.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-800">Rain:</span>{" "}
                      Soothing natural sound.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-800">Ocean:</span>{" "}
                      Rhythmic, helps with relaxation.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-800">Forest:</span>{" "}
                      Gentle ambient for focus.
                    </li>
                  </ul>
                </div>
                <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800">
                  Start at a soft volume and increase slowly. The goal is comfort, not
                  full masking.
                </Alert>
              </CardContent>
            </Card>

            <SoundMaskingPlayer />
          </div>

        </div>
      </div>
    </div>
  )
}
