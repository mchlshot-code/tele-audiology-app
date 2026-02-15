"use client"

import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { OrderList } from "@/features/admin/components/OrderList"
import { useAdminOrders } from "@/features/admin/hooks/useAdminOrders"
import { type OrderStatusInput } from "@/features/admin/schemas/order-schema"

export function OrderCMS() {
  const { orders, loading, error, isPending, pendingCount, updateStatus, exportCsv } =
    useAdminOrders()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Admin CMS</p>
          <h2 className="text-2xl font-semibold text-slate-900">Orders</h2>
          <p className="text-sm text-slate-600">
            {pendingCount} pending payments require review.
          </p>
        </div>
        <Button variant="outline" className="border-emerald-200 text-emerald-700" onClick={exportCsv}>
          Export CSV
        </Button>
      </div>

      {error && <Alert className="border-rose-200 bg-rose-50 text-rose-700">{error}</Alert>}

      <OrderList
        items={orders}
        isLoading={loading}
        isUpdating={isPending}
        onUpdateStatus={(orderId, status) =>
          updateStatus(orderId, { paymentStatus: status as OrderStatusInput["paymentStatus"] })
        }
      />
    </div>
  )
}
