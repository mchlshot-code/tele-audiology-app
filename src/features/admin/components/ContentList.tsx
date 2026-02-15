"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type AdminContentItem } from "@/features/admin/hooks/useAdminContent"

type ContentListProps = {
  items: AdminContentItem[]
  isLoading: boolean
  onEdit: (item: AdminContentItem) => void
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-NG", {
    timeZone: "Africa/Lagos",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

export function ContentList({ items, isLoading, onEdit }: ContentListProps) {
  return (
    <Card className="border-emerald-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl text-slate-900">Content list</CardTitle>
        <p className="text-sm text-slate-600">Manage published and draft content.</p>
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
          <p className="text-sm text-slate-500">No content created yet.</p>
        )}
        {!isLoading && items.length > 0 && (
          <ul className="space-y-3 text-sm text-slate-700">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 px-4 py-3"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500">
                    {item.content_type ?? "content"} · {item.status ?? "draft"} ·{" "}
                    {formatDate(item.created_at)}
                  </p>
                  <p className="text-xs text-slate-500">/{item.slug}</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="border-emerald-200 text-emerald-700"
                  onClick={() => onEdit(item)}
                >
                  Edit
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
