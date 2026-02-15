import { useCallback, useEffect, useState } from "react"
import { getHearingAssessments, type AdminHearingAssessment } from "@/features/admin/actions/triage-actions"

const toCsvValue = (value: string | number | boolean | null) => {
  if (value === null) {
    return ""
  }
  const safe = String(value).replace(/"/g, '""')
  return `"${safe}"`
}

export function useAdminTriage() {
  const [assessments, setAssessments] = useState<AdminHearingAssessment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    const result = await getHearingAssessments()
    if (!result.success) {
      setError(result.error)
      setLoading(false)
      return
    }
    setAssessments(result.data)
    setError(null)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const exportCsv = useCallback(() => {
    if (assessments.length === 0) {
      return
    }
    const headers = [
      "user_name",
      "user_email",
      "age",
      "noise_exposure_hours",
      "difficulty_hearing",
      "tinnitus",
      "family_history",
      "risk_level",
      "created_at",
    ]
    const rows = assessments.map((item) => [
      toCsvValue(item.users?.full_name ?? ""),
      toCsvValue(item.users?.email ?? ""),
      toCsvValue(item.age),
      toCsvValue(item.noise_exposure_hours),
      toCsvValue(item.difficulty_hearing),
      toCsvValue(item.tinnitus),
      toCsvValue(item.family_history),
      toCsvValue(item.risk_level ?? ""),
      toCsvValue(item.created_at),
    ])
    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "hearing-assessments-export.csv"
    link.click()
    URL.revokeObjectURL(url)
  }, [assessments])

  return {
    assessments,
    loading,
    error,
    refresh,
    exportCsv,
  }
}
