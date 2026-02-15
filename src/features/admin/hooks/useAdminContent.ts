import { useCallback, useEffect, useState, useTransition } from "react"
import { createContent, getContentList, updateContent } from "@/features/admin/actions/content-actions"
import { type ContentFormInput } from "@/features/admin/schemas/content-schema"

export type AdminContentItem = {
  id: string
  title: string
  slug: string
  content: string | null
  content_type: string | null
  status: string | null
  featured_image_url: string | null
  author_id: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

const toCsvValue = (value: string | number | null) => {
  if (value === null) {
    return ""
  }
  const safe = String(value).replace(/"/g, '""')
  return `"${safe}"`
}

export function useAdminContent() {
  const [contentItems, setContentItems] = useState<AdminContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const refresh = useCallback(async () => {
    setLoading(true)
    const result = await getContentList()
    if (!result.success) {
      setError(result.error)
      setLoading(false)
      return
    }
    setContentItems(result.data)
    setError(null)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const createItem = useCallback(
    async (data: ContentFormInput) =>
      new Promise<boolean>((resolve) => {
        startTransition(async () => {
          const result = await createContent(data)
          if (!result.success) {
            setError(result.error)
            resolve(false)
            return
          }
          setContentItems((prev) => [result.data, ...prev])
          setError(null)
          resolve(true)
        })
      }),
    []
  )

  const updateItem = useCallback(
    async (id: string, data: ContentFormInput) =>
      new Promise<boolean>((resolve) => {
        startTransition(async () => {
          const result = await updateContent(id, data)
          if (!result.success) {
            setError(result.error)
            resolve(false)
            return
          }
          setContentItems((prev) =>
            prev.map((item) => (item.id === id ? result.data : item))
          )
          setError(null)
          resolve(true)
        })
      }),
    []
  )

  const exportCsv = useCallback(() => {
    if (contentItems.length === 0) {
      return
    }
    const headers = [
      "title",
      "slug",
      "content_type",
      "status",
      "published_at",
      "created_at",
      "updated_at",
    ]
    const rows = contentItems.map((item) => [
      toCsvValue(item.title),
      toCsvValue(item.slug),
      toCsvValue(item.content_type),
      toCsvValue(item.status),
      toCsvValue(item.published_at),
      toCsvValue(item.created_at),
      toCsvValue(item.updated_at),
    ])
    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "content-export.csv"
    link.click()
    URL.revokeObjectURL(url)
  }, [contentItems])

  return {
    contentItems,
    loading,
    error,
    isPending,
    refresh,
    createItem,
    updateItem,
    exportCsv,
  }
}
