import { useCallback, useEffect, useState, useTransition } from "react"
import { createProduct, getProducts, updateProduct } from "@/features/admin/actions/product-actions"
import { type ProductFormInput } from "@/features/admin/schemas/product-schema"

export type AdminProductItem = {
  id: string
  name: string
  description: string | null
  price: number
  stock_quantity: number
  image_url: string | null
  category: string | null
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

export function useAdminProducts() {
  const [products, setProducts] = useState<AdminProductItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const refresh = useCallback(async () => {
    setLoading(true)
    const result = await getProducts()
    if (!result.success) {
      setError(result.error)
      setLoading(false)
      return
    }
    setProducts(result.data)
    setError(null)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const createItem = useCallback(
    async (data: ProductFormInput) =>
      new Promise<boolean>((resolve) => {
        startTransition(async () => {
          const result = await createProduct(data)
          if (!result.success) {
            setError(result.error)
            resolve(false)
            return
          }
          setProducts((prev) => [result.data, ...prev])
          setError(null)
          resolve(true)
        })
      }),
    []
  )

  const updateItem = useCallback(
    async (id: string, data: ProductFormInput) =>
      new Promise<boolean>((resolve) => {
        startTransition(async () => {
          const result = await updateProduct(id, data)
          if (!result.success) {
            setError(result.error)
            resolve(false)
            return
          }
          setProducts((prev) =>
            prev.map((item) => (item.id === id ? result.data : item))
          )
          setError(null)
          resolve(true)
        })
      }),
    []
  )

  const exportCsv = useCallback(() => {
    if (products.length === 0) {
      return
    }
    const headers = [
      "name",
      "category",
      "price",
      "stock_quantity",
      "created_at",
      "updated_at",
    ]
    const rows = products.map((item) => [
      toCsvValue(item.name),
      toCsvValue(item.category),
      toCsvValue(item.price),
      toCsvValue(item.stock_quantity),
      toCsvValue(item.created_at),
      toCsvValue(item.updated_at),
    ])
    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "products-export.csv"
    link.click()
    URL.revokeObjectURL(url)
  }, [products])

  return {
    products,
    loading,
    error,
    isPending,
    refresh,
    createItem,
    updateItem,
    exportCsv,
  }
}
