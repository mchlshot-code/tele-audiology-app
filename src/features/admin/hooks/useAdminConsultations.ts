import { useCallback, useEffect, useState, useTransition } from "react"
import {
  getConsultations,
  updateConsultationStatus,
  type AdminConsultation,
} from "@/features/admin/actions/consultation-actions"
import { type ConsultationStatusInput } from "@/features/admin/schemas/consultation-schema"

const toCsvValue = (value: string | number | null) => {
  if (value === null) {
    return ""
  }
  const safe = String(value).replace(/"/g, '""')
  return `"${safe}"`
}

export function useAdminConsultations() {
  const [consultations, setConsultations] = useState<AdminConsultation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const refresh = useCallback(async () => {
    setLoading(true)
    const result = await getConsultations()
    if (!result.success) {
      setError(result.error)
      setLoading(false)
      return
    }
    setConsultations(result.data)
    setError(null)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const updateStatus = useCallback(
    async (id: string, data: ConsultationStatusInput) =>
      new Promise<boolean>((resolve) => {
        startTransition(async () => {
          const result = await updateConsultationStatus(id, data)
          if (!result.success) {
            setError(result.error)
            resolve(false)
            return
          }
          setConsultations((prev) =>
            prev.map((item) => (item.id === id ? result.data : item))
          )
          setError(null)
          resolve(true)
        })
      }),
    []
  )

  const exportCsv = useCallback(() => {
    if (consultations.length === 0) {
      return
    }
    const headers = [
      "user_name",
      "user_email",
      "user_phone",
      "scheduled_at",
      "status",
      "notes",
      "created_at",
    ]
    const rows = consultations.map((item) => [
      toCsvValue(item.users?.full_name ?? ""),
      toCsvValue(item.users?.email ?? ""),
      toCsvValue(item.users?.phone ?? ""),
      toCsvValue(item.scheduled_at),
      toCsvValue(item.status),
      toCsvValue(item.notes ?? ""),
      toCsvValue(item.created_at),
    ])
    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "consultations-export.csv"
    link.click()
    URL.revokeObjectURL(url)
  }, [consultations])

  return {
    consultations,
    loading,
    error,
    isPending,
    refresh,
    updateStatus,
    exportCsv,
  }
}
