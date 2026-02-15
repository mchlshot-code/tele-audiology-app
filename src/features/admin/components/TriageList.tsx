"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type AdminHearingAssessment } from "@/features/admin/actions/triage-actions"

type TriageListProps = {
  items: AdminHearingAssessment[]
  isLoading: boolean
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-NG", {
    timeZone: "Africa/Lagos",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

export function TriageList({ items, isLoading }: TriageListProps) {
  return (
    <Card className="border-emerald-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl text-slate-900">Hearing Assessments</CardTitle>
        <p className="text-sm text-slate-600">Recent hearing risk submissions.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <div className="space-y-3">
            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" />
          </div>
        )}
        {!isLoading && items.length === 0 && (
          <p className="text-sm text-slate-500">No hearing assessments yet.</p>
        )}
        {!isLoading && items.length > 0 && (
          <ul className="space-y-3 text-sm text-slate-700">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 px-4 py-3"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-slate-900">
                    {item.users?.full_name ?? "Patient"} · {item.risk_level ?? "unknown"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.users?.email ?? "No email"} · {formatDate(item.created_at)}
                  </p>
                </div>
                <div className="text-xs text-slate-500">
                  Age {item.age ?? "—"} · Noise {item.noise_exposure_hours ?? "—"}h
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
