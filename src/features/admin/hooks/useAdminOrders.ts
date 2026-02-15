import { useCallback, useEffect, useMemo, useState, useTransition } from "react"
import { getOrders, updateOrderStatus } from "@/features/admin/actions/order-actions"
import { type OrderStatusInput } from "@/features/admin/schemas/order-schema"

export type AdminOrderItem = {
  id: string
  product_id: string
  quantity: number
  price: number
  products?: { name: string | null } | null
}

export type AdminOrder = {
  id: string
  user_id: string
  total_amount: number
  payment_status: OrderStatusInput["paymentStatus"]
  payment_reference: string | null
  shipping_address: Record<string, unknown> | null
  created_at: string
  updated_at: string
  order_items?: AdminOrderItem[]
  users?: { full_name: string | null; email: string | null } | null
}

const toCsvValue = (value: string | number | null) => {
  if (value === null) {
    return ""
  }
  const safe = String(value).replace(/"/g, '""')
  return `"${safe}"`
}

export function useAdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const refresh = useCallback(async () => {
    setLoading(true)
    const result = await getOrders()
    if (!result.success) {
      setError(result.error)
      setLoading(false)
      return
    }
    setOrders(result.data)
    setError(null)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const updateStatus = useCallback(
    async (orderId: string, data: OrderStatusInput) =>
      new Promise<boolean>((resolve) => {
        startTransition(async () => {
          const result = await updateOrderStatus(orderId, data)
          if (!result.success) {
            setError(result.error)
            resolve(false)
            return
          }
          setOrders((prev) => prev.map((item) => (item.id === orderId ? result.data : item)))
          setError(null)
          resolve(true)
        })
      }),
    []
  )

  const exportCsv = useCallback(() => {
    if (orders.length === 0) {
      return
    }
    const headers = [
      "order_id",
      "customer",
      "email",
      "payment_status",
      "total_amount",
      "created_at",
    ]
    const rows = orders.map((order) => [
      toCsvValue(order.id),
      toCsvValue(order.users?.full_name ?? ""),
      toCsvValue(order.users?.email ?? ""),
      toCsvValue(order.payment_status),
      toCsvValue(order.total_amount),
      toCsvValue(order.created_at),
    ])
    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "orders-export.csv"
    link.click()
    URL.revokeObjectURL(url)
  }, [orders])

  const pendingCount = useMemo(
    () => orders.filter((order) => order.payment_status === "pending").length,
    [orders]
  )

  return {
    orders,
    loading,
    error,
    isPending,
    pendingCount,
    refresh,
    updateStatus,
    exportCsv,
  }
}
