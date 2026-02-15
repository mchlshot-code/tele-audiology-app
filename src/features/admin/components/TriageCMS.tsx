"use client"

import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useAdminTriage } from "@/features/admin/hooks/useAdminTriage"
import { TriageList } from "@/features/admin/components/TriageList"

export function TriageCMS() {
  const { assessments, loading, error, exportCsv } = useAdminTriage()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Admin CMS</p>
          <h2 className="text-2xl font-semibold text-slate-900">Hearing Risk</h2>
          <p className="text-sm text-slate-600">Review hearing assessment submissions.</p>
        </div>
        <Button variant="outline" className="border-emerald-200 text-emerald-700" onClick={exportCsv}>
          Export CSV
        </Button>
      </div>

      {error && <Alert className="border-rose-200 bg-rose-50 text-rose-700">{error}</Alert>}

      <TriageList items={assessments} isLoading={loading} />
    </div>
  )
}
