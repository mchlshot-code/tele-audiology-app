"use client"

import { useMemo, useState } from "react"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ContentForm } from "@/features/admin/components/ContentForm"
import { ContentList } from "@/features/admin/components/ContentList"
import { useAdminContent, type AdminContentItem } from "@/features/admin/hooks/useAdminContent"
import { type ContentFormInput } from "@/features/admin/schemas/content-schema"

const toFormValues = (item: AdminContentItem): ContentFormInput => ({
  title: item.title,
  slug: item.slug,
  content: item.content ?? "",
  contentType: (item.content_type ?? "blog_post") as ContentFormInput["contentType"],
  status: (item.status ?? "draft") as ContentFormInput["status"],
  featuredImageUrl: item.featured_image_url ?? "",
})

export function ContentCMS() {
  const [editingItem, setEditingItem] = useState<AdminContentItem | null>(null)
  const { contentItems, loading, error, isPending, createItem, updateItem, exportCsv } =
    useAdminContent()

  const editingValues = useMemo(
    () => (editingItem ? toFormValues(editingItem) : null),
    [editingItem]
  )

  const handleSubmit = async (data: ContentFormInput) => {
    if (editingItem) {
      const ok = await updateItem(editingItem.id, data)
      if (ok) {
        setEditingItem(null)
      }
      return
    }
    await createItem(data)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Admin CMS</p>
          <h2 className="text-2xl font-semibold text-slate-900">Content Management</h2>
          <p className="text-sm text-slate-600">
            Create and publish educational materials for patients.
          </p>
        </div>
        <Button variant="outline" className="border-emerald-200 text-emerald-700" onClick={exportCsv}>
          Export CSV
        </Button>
      </div>

      {error && <Alert className="border-rose-200 bg-rose-50 text-rose-700">{error}</Alert>}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <ContentList items={contentItems} isLoading={loading} onEdit={setEditingItem} />
        <Card className="border-emerald-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">
              {editingItem ? "Edit content" : "Create new content"}
            </CardTitle>
            <p className="text-sm text-slate-600">
              Use clear language and avoid diagnostic claims.
            </p>
          </CardHeader>
          <CardContent>
            <ContentForm
              initialValues={editingValues}
              isSubmitting={isPending}
              onSubmit={handleSubmit}
              onCancel={editingItem ? () => setEditingItem(null) : undefined}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
