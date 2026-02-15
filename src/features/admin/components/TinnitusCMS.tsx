"use client"

import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAdminTinnitus } from "@/features/admin/hooks/useAdminTinnitus"

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-NG", {
    timeZone: "Africa/Lagos",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

export function TinnitusCMS() {
  const {
    data,
    loading,
    error,
    exportScreenings,
    exportAssessments,
    exportTreatments,
    exportSoundSessions,
    exportOutcomes,
  } = useAdminTinnitus()

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-emerald-700">Admin CMS</p>
        <h2 className="text-2xl font-semibold text-slate-900">Tinnitus Program</h2>
        <p className="text-sm text-slate-600">Monitor screening progress and outcomes.</p>
      </div>

      {error && <Alert className="border-rose-200 bg-rose-50 text-rose-700">{error}</Alert>}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-emerald-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle className="text-xl text-slate-900">Screenings</CardTitle>
              <p className="text-sm text-slate-600">{data.screenings.length} records</p>
            </div>
            <Button
              variant="outline"
              className="border-emerald-200 text-emerald-700"
              onClick={() => exportScreenings(data.screenings)}
            >
              Export CSV
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            {loading && <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />}
            {!loading && data.screenings.length === 0 && (
              <p className="text-sm text-slate-500">No screenings recorded.</p>
            )}
            {!loading && data.screenings.length > 0 && (
              <ul className="space-y-2">
                {data.screenings.map((item) => (
                  <li key={item.id} className="rounded-lg border border-slate-100 px-3 py-2">
                    <p className="font-semibold text-slate-900">
                      {item.users?.full_name ?? "Patient"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.duration ?? "duration"} · score {item.bothersomeness_score ?? "—"} ·{" "}
                      {formatDate(item.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="border-emerald-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle className="text-xl text-slate-900">Assessments</CardTitle>
              <p className="text-sm text-slate-600">{data.assessments.length} records</p>
            </div>
            <Button
              variant="outline"
              className="border-emerald-200 text-emerald-700"
              onClick={() => exportAssessments(data.assessments)}
            >
              Export CSV
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            {loading && <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />}
            {!loading && data.assessments.length === 0 && (
              <p className="text-sm text-slate-500">No assessments recorded.</p>
            )}
            {!loading && data.assessments.length > 0 && (
              <ul className="space-y-2">
                {data.assessments.map((item) => (
                  <li key={item.id} className="rounded-lg border border-slate-100 px-3 py-2">
                    <p className="font-semibold text-slate-900">
                      {item.users?.full_name ?? "Patient"}
                    </p>
                    <p className="text-xs text-slate-500">
                      Impact {item.tinnitus_impact ?? "—"} · Step{" "}
                      {item.recommended_step ?? "—"} · {formatDate(item.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="border-emerald-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle className="text-xl text-slate-900">Treatments</CardTitle>
              <p className="text-sm text-slate-600">{data.treatments.length} records</p>
            </div>
            <Button
              variant="outline"
              className="border-emerald-200 text-emerald-700"
              onClick={() => exportTreatments(data.treatments)}
            >
              Export CSV
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            {loading && <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />}
            {!loading && data.treatments.length === 0 && (
              <p className="text-sm text-slate-500">No treatments recorded.</p>
            )}
            {!loading && data.treatments.length > 0 && (
              <ul className="space-y-2">
                {data.treatments.map((item) => (
                  <li key={item.id} className="rounded-lg border border-slate-100 px-3 py-2">
                    <p className="font-semibold text-slate-900">
                      {item.users?.full_name ?? "Patient"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.treatment_type ?? "treatment"} · {item.status ?? "status"} ·{" "}
                      {formatDate(item.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="border-emerald-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle className="text-xl text-slate-900">Sound sessions</CardTitle>
              <p className="text-sm text-slate-600">{data.soundSessions.length} records</p>
            </div>
            <Button
              variant="outline"
              className="border-emerald-200 text-emerald-700"
              onClick={() => exportSoundSessions(data.soundSessions)}
            >
              Export CSV
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            {loading && <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />}
            {!loading && data.soundSessions.length === 0 && (
              <p className="text-sm text-slate-500">No sessions recorded.</p>
            )}
            {!loading && data.soundSessions.length > 0 && (
              <ul className="space-y-2">
                {data.soundSessions.map((item) => (
                  <li key={item.id} className="rounded-lg border border-slate-100 px-3 py-2">
                    <p className="font-semibold text-slate-900">
                      {item.users?.full_name ?? "Patient"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.sound_type ?? "sound"} · {item.duration_minutes ?? "—"} min ·{" "}
                      {formatDate(item.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="border-emerald-100 shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle className="text-xl text-slate-900">Outcome measures</CardTitle>
              <p className="text-sm text-slate-600">{data.outcomes.length} records</p>
            </div>
            <Button
              variant="outline"
              className="border-emerald-200 text-emerald-700"
              onClick={() => exportOutcomes(data.outcomes)}
            >
              Export CSV
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            {loading && <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />}
            {!loading && data.outcomes.length === 0 && (
              <p className="text-sm text-slate-500">No outcomes recorded.</p>
            )}
            {!loading && data.outcomes.length > 0 && (
              <ul className="space-y-2">
                {data.outcomes.map((item) => (
                  <li key={item.id} className="rounded-lg border border-slate-100 px-3 py-2">
                    <p className="font-semibold text-slate-900">
                      {item.users?.full_name ?? "Patient"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.measurement_type ?? "measure"} · score {item.score ?? "—"} ·{" "}
                      {item.global_change ?? "—"} · {formatDate(item.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
