"use client"

import { useMemo, useState } from "react"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductForm } from "@/features/admin/components/ProductForm"
import { ProductList } from "@/features/admin/components/ProductList"
import { useAdminProducts, type AdminProductItem } from "@/features/admin/hooks/useAdminProducts"
import { type ProductFormInput } from "@/features/admin/schemas/product-schema"

const toFormValues = (item: AdminProductItem): ProductFormInput => ({
  name: item.name,
  description: item.description ?? "",
  price: item.price,
  stockQuantity: item.stock_quantity,
  imageUrl: item.image_url ?? "",
  category: item.category ?? "",
})

export function ProductCMS() {
  const [editingItem, setEditingItem] = useState<AdminProductItem | null>(null)
  const { products, loading, error, isPending, createItem, updateItem, exportCsv } =
    useAdminProducts()

  const editingValues = useMemo(
    () => (editingItem ? toFormValues(editingItem) : null),
    [editingItem]
  )

  const handleSubmit = async (data: ProductFormInput) => {
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
          <h2 className="text-2xl font-semibold text-slate-900">Product Catalog</h2>
          <p className="text-sm text-slate-600">Manage products, pricing, and stock.</p>
        </div>
        <Button variant="outline" className="border-emerald-200 text-emerald-700" onClick={exportCsv}>
          Export CSV
        </Button>
      </div>

      {error && <Alert className="border-rose-200 bg-rose-50 text-rose-700">{error}</Alert>}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <ProductList items={products} isLoading={loading} onEdit={setEditingItem} />
        <Card className="border-emerald-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">
              {editingItem ? "Edit product" : "Create new product"}
            </CardTitle>
            <p className="text-sm text-slate-600">
              Prices are displayed in Nigerian Naira.
            </p>
          </CardHeader>
          <CardContent>
            <ProductForm
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
