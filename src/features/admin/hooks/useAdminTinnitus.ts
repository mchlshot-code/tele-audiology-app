import { useCallback, useEffect, useState } from "react"
import {
  getTinnitusOverview,
  type AdminOutcomeMeasure,
  type AdminSoundMaskingSession,
  type AdminTinnitusAssessment,
  type AdminTinnitusScreening,
  type AdminTinnitusTreatment,
  type TinnitusOverview,
} from "@/features/admin/actions/tinnitus-actions"

const toCsvValue = (value: string | number | boolean | null) => {
  if (value === null) {
    return ""
  }
  const safe = String(value).replace(/"/g, '""')
  return `"${safe}"`
}

export function useAdminTinnitus() {
  const [data, setData] = useState<TinnitusOverview>({
    screenings: [],
    assessments: [],
    treatments: [],
    soundSessions: [],
    outcomes: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    const result = await getTinnitusOverview()
    if (!result.success) {
      setError(result.error)
      setLoading(false)
      return
    }
    setData(result.data)
    setError(null)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const exportScreenings = useCallback((items: AdminTinnitusScreening[]) => {
    if (items.length === 0) {
      return
    }
    const headers = [
      "user_name",
      "user_email",
      "duration",
      "bothersomeness_score",
      "created_at",
    ]
    const rows = items.map((item) => [
      toCsvValue(item.users?.full_name ?? ""),
      toCsvValue(item.users?.email ?? ""),
      toCsvValue(item.duration ?? ""),
      toCsvValue(item.bothersomeness_score),
      toCsvValue(item.created_at),
    ])
    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "tinnitus-screenings-export.csv"
    link.click()
    URL.revokeObjectURL(url)
  }, [])

  const exportAssessments = useCallback((items: AdminTinnitusAssessment[]) => {
    if (items.length === 0) {
      return
    }
    const headers = [
      "user_name",
      "user_email",
      "screening_id",
      "tinnitus_impact",
      "recommended_step",
      "created_at",
    ]
    const rows = items.map((item) => [
      toCsvValue(item.users?.full_name ?? ""),
      toCsvValue(item.users?.email ?? ""),
      toCsvValue(item.screening_id ?? ""),
      toCsvValue(item.tinnitus_impact ?? ""),
      toCsvValue(item.recommended_step ?? ""),
      toCsvValue(item.created_at),
    ])
    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "tinnitus-assessments-export.csv"
    link.click()
    URL.revokeObjectURL(url)
  }, [])

  const exportTreatments = useCallback((items: AdminTinnitusTreatment[]) => {
    if (items.length === 0) {
      return
    }
    const headers = [
      "user_name",
      "user_email",
      "assessment_id",
      "treatment_type",
      "status",
      "notes",
      "created_at",
    ]
    const rows = items.map((item) => [
      toCsvValue(item.users?.full_name ?? ""),
      toCsvValue(item.users?.email ?? ""),
      toCsvValue(item.assessment_id ?? ""),
      toCsvValue(item.treatment_type ?? ""),
      toCsvValue(item.status ?? ""),
      toCsvValue(item.notes ?? ""),
      toCsvValue(item.created_at),
    ])
    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "tinnitus-treatments-export.csv"
    link.click()
    URL.revokeObjectURL(url)
  }, [])

  const exportSoundSessions = useCallback((items: AdminSoundMaskingSession[]) => {
    if (items.length === 0) {
      return
    }
    const headers = [
      "user_name",
      "user_email",
      "sound_type",
      "duration_minutes",
      "volume_level",
      "created_at",
    ]
    const rows = items.map((item) => [
      toCsvValue(item.users?.full_name ?? ""),
      toCsvValue(item.users?.email ?? ""),
      toCsvValue(item.sound_type ?? ""),
      toCsvValue(item.duration_minutes),
      toCsvValue(item.volume_level),
      toCsvValue(item.created_at),
    ])
    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "sound-masking-sessions-export.csv"
    link.click()
    URL.revokeObjectURL(url)
  }, [])

  const exportOutcomes = useCallback((items: AdminOutcomeMeasure[]) => {
    if (items.length === 0) {
      return
    }
    const headers = [
      "user_name",
      "user_email",
      "treatment_id",
      "measurement_type",
      "score",
      "global_change",
      "created_at",
    ]
    const rows = items.map((item) => [
      toCsvValue(item.users?.full_name ?? ""),
      toCsvValue(item.users?.email ?? ""),
      toCsvValue(item.treatment_id ?? ""),
      toCsvValue(item.measurement_type ?? ""),
      toCsvValue(item.score),
      toCsvValue(item.global_change ?? ""),
      toCsvValue(item.created_at),
    ])
    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "tinnitus-outcomes-export.csv"
    link.click()
    URL.revokeObjectURL(url)
  }, [])

  return {
    data,
    loading,
    error,
    refresh,
    exportScreenings,
    exportAssessments,
    exportTreatments,
    exportSoundSessions,
    exportOutcomes,
  }
}
