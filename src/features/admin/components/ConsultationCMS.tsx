"use client"

import { useMemo, useState } from "react"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAdminConsultations } from "@/features/admin/hooks/useAdminConsultations"
import {
  consultationStatusOptions,
  type ConsultationStatusInput,
} from "@/features/admin/schemas/consultation-schema"

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("en-NG", {
    timeZone: "Africa/Lagos",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

export function ConsultationCMS() {
  const { consultations, loading, error, isPending, updateStatus, exportCsv } =
    useAdminConsultations()
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, ConsultationStatusInput["status"]>
  >({})
  const pendingCount = useMemo(
    () => consultations.filter((item) => item.status === "pending").length,
    [consultations]
  )

  const getStatusValue = (
    id: string,
    current: ConsultationStatusInput["status"]
  ): ConsultationStatusInput["status"] => statusOverrides[id] ?? current

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Admin CMS</p>
          <h2 className="text-2xl font-semibold text-slate-900">Consultations</h2>
          <p className="text-sm text-slate-600">
            {pendingCount} pending consultations need review.
          </p>
        </div>
        <Button variant="outline" className="border-emerald-200 text-emerald-700" onClick={exportCsv}>
          Export CSV
        </Button>
      </div>

      {error && <Alert className="border-rose-200 bg-rose-50 text-rose-700">{error}</Alert>}

      <Card className="border-emerald-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900">Upcoming consultations</CardTitle>
          <p className="text-sm text-slate-600">Confirm schedules and track outcomes.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && (
            <div className="space-y-3">
              <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" />
            </div>
          )}
          {!loading && consultations.length === 0 && (
            <p className="text-sm text-slate-500">No consultations booked yet.</p>
          )}
          {!loading && consultations.length > 0 && (
            <ul className="space-y-4 text-sm text-slate-700">
              {consultations.map((item) => (
                <li key={item.id} className="space-y-3 rounded-xl border border-slate-100 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {item.users?.full_name ?? "Patient"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.users?.email ?? "No email"} · {item.users?.phone ?? "No phone"}
                      </p>
                    </div>
                    <div className="text-xs text-slate-500">
                      {formatDateTime(item.scheduled_at)}
                    </div>
                  </div>

                  <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase text-slate-500">Notes</p>
                      <p className="text-xs text-slate-600">
                        {item.notes ? item.notes : "No notes provided."}
                      </p>
                    </div>
                    <div className="space-y-2 rounded-lg border border-emerald-100 bg-emerald-50/40 p-3">
                      <Label>Status</Label>
                      <Select
                        value={getStatusValue(item.id, item.status)}
                        onValueChange={(value) =>
                          setStatusOverrides((prev) => ({
                            ...prev,
                            [item.id]: value as ConsultationStatusInput["status"],
                          }))
                        }
                      >
                        <SelectTrigger className="border-emerald-100 bg-white focus:ring-emerald-400">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {consultationStatusOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        disabled={isPending}
                        onClick={() =>
                          updateStatus(item.id, {
                            status: getStatusValue(item.id, item.status),
                          })
                        }
                      >
                        Update status
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
