"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type AdminOrder } from "@/features/admin/hooks/useAdminOrders"
import { orderStatusOptions, type OrderStatusInput } from "@/features/admin/schemas/order-schema"

type OrderListProps = {
  items: AdminOrder[]
  isLoading: boolean
  isUpdating: boolean
  onUpdateStatus: (orderId: string, status: OrderStatusInput["paymentStatus"]) => void
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value)

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-NG", {
    timeZone: "Africa/Lagos",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

export function OrderList({ items, isLoading, isUpdating, onUpdateStatus }: OrderListProps) {
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, OrderStatusInput["paymentStatus"]>
  >({})

  const getStatusValue = (
    orderId: string,
    current: OrderStatusInput["paymentStatus"]
  ): OrderStatusInput["paymentStatus"] => statusOverrides[orderId] ?? current

  return (
    <Card className="border-emerald-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl text-slate-900">Orders</CardTitle>
        <p className="text-sm text-slate-600">Track payments and fulfilment updates.</p>
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
          <p className="text-sm text-slate-500">No orders yet.</p>
        )}
        {!isLoading && items.length > 0 && (
          <ul className="space-y-4 text-sm text-slate-700">
            {items.map((order) => (
              <li
                key={order.id}
                className="space-y-3 rounded-xl border border-slate-100 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {order.users?.full_name ?? "Customer"} ·{" "}
                      {order.users?.email ?? "No email"} · {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="text-sm font-semibold text-emerald-700">
                    {formatPrice(order.total_amount)}
                  </div>
                </div>

                <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase text-slate-500">Items</p>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {(order.order_items ?? []).map((item) => (
                        <li key={item.id}>
                          {item.products?.name ?? "Product"} · Qty {item.quantity} ·{" "}
                          {formatPrice(item.price)}
                        </li>
                      ))}
                      {(order.order_items ?? []).length === 0 && (
                        <li>No items recorded.</li>
                      )}
                    </ul>
                  </div>
                  <div className="space-y-2 rounded-lg border border-emerald-100 bg-emerald-50/40 p-3">
                    <Label>Status</Label>
                    <Select
                      value={getStatusValue(order.id, order.payment_status)}
                      onValueChange={(value) =>
                        setStatusOverrides((prev) => ({
                          ...prev,
                          [order.id]: value as OrderStatusInput["paymentStatus"],
                        }))
                      }
                    >
                      <SelectTrigger className="border-emerald-100 bg-white focus:ring-emerald-400">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {orderStatusOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      disabled={isUpdating}
                      onClick={() =>
                        onUpdateStatus(order.id, getStatusValue(order.id, order.payment_status))
                      }
                    >
                      Update status
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
