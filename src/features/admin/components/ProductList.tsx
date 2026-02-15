"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type AdminProductItem } from "@/features/admin/hooks/useAdminProducts"

type ProductListProps = {
  items: AdminProductItem[]
  isLoading: boolean
  onEdit: (item: AdminProductItem) => void
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value)

export function ProductList({ items, isLoading, onEdit }: ProductListProps) {
  return (
    <Card className="border-emerald-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl text-slate-900">Products</CardTitle>
        <p className="text-sm text-slate-600">Manage catalog items and stock levels.</p>
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
          <p className="text-sm text-slate-500">No products added yet.</p>
        )}
        {!isLoading && items.length > 0 && (
          <ul className="space-y-3 text-sm text-slate-700">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 px-4 py-3"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">
                    {item.category ?? "uncategorized"} · {formatPrice(item.price)} · Stock{" "}
                    {item.stock_quantity}
                  </p>
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
