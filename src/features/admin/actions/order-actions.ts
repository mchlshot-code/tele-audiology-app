"use server"

import { createSupabaseServerClient } from "@/lib/supabase-server"
import { orderStatusSchema, type OrderStatusInput } from "@/features/admin/schemas/order-schema"

type ActionResult<T> = { success: true; data: T } | { success: false; error: string }

type OrderItemRow = {
  id: string
  product_id: string
  quantity: number
  price: number
  products?: { name: string | null } | null
}

type RawOrderItemRow = {
  id: string
  product_id: string
  quantity: number
  price: number
  products?: { name: string | null } | { name: string | null }[] | null
}

type OrderRow = {
  id: string
  user_id: string
  total_amount: number
  payment_status: OrderStatusInput["paymentStatus"]
  payment_reference: string | null
  shipping_address: Record<string, unknown> | null
  created_at: string
  updated_at: string
  order_items?: OrderItemRow[]
  users?: { full_name: string | null; email: string | null } | null
}

type RawOrderRow = {
  id: string
  user_id: string
  total_amount: number
  payment_status: OrderStatusInput["paymentStatus"]
  payment_reference: string | null
  shipping_address: Record<string, unknown> | null
  created_at: string
  updated_at: string
  order_items?: RawOrderItemRow[]
  users?: { full_name: string | null; email: string | null } | { full_name: string | null; email: string | null }[] | null
}

type AdminUser = {
  id: string
  is_admin: boolean
  admin_role: string | null
}

const adminRoles = ["super_admin", "admin", "content_manager", "viewer"] as const

const getAdminProfile = async () => {
  const supabase = createSupabaseServerClient()
  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData.user) {
    return { error: "Authentication required", user: null, supabase }
  }
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("id, is_admin, admin_role")
    .eq("id", authData.user.id)
    .single()
  if (profileError || !profile) {
    return { error: "Admin access required", user: null, supabase }
  }
  if (!profile.is_admin || !adminRoles.includes(profile.admin_role as (typeof adminRoles)[number])) {
    return { error: "Admin access required", user: null, supabase }
  }
  return { error: null, user: profile as AdminUser, supabase }
}

const logAdminAction = async (
  supabase: ReturnType<typeof createSupabaseServerClient>,
  adminId: string,
  action: string,
  resourceId?: string,
  details?: Record<string, unknown>
) => {
  await supabase.from("admin_activity_logs").insert({
    admin_id: adminId,
    action,
    resource_type: "orders",
    resource_id: resourceId ?? null,
    details: details ?? null,
    ip_address: null,
  })
}

export async function getOrders(): Promise<ActionResult<OrderRow[]>> {
  try {
    const { error, supabase } = await getAdminProfile()
    if (error) {
      return { success: false, error }
    }
    const { data, error: listError } = await supabase
      .from("orders")
      .select(
        "id, user_id, total_amount, payment_status, payment_reference, shipping_address, created_at, updated_at, order_items (id, product_id, quantity, price, products (name)), users (full_name, email)"
      )
      .order("created_at", { ascending: false })
      .limit(100)
    if (listError) {
      return { success: false, error: listError.message }
    }
    const normalized = (data as RawOrderRow[] | null)?.map((order) => ({
      ...order,
      order_items:
        order.order_items?.map((item) => ({
          ...item,
          products: Array.isArray(item.products) ? item.products[0] ?? null : item.products ?? null,
        })) ?? [],
      users: Array.isArray(order.users) ? order.users[0] ?? null : order.users ?? null,
    }))
    return { success: true, data: normalized ?? [] }
  } catch {
    return { success: false, error: "Something went wrong" }
  }
}

export async function updateOrderStatus(
  orderId: string,
  formData: unknown
): Promise<ActionResult<OrderRow>> {
  try {
    const validated = orderStatusSchema.parse(formData)
    const { error, supabase, user } = await getAdminProfile()
    if (error || !user) {
      return { success: false, error: error ?? "Admin access required" }
    }
    const { data, error: updateError } = await supabase
      .from("orders")
      .update({ payment_status: validated.paymentStatus })
      .eq("id", orderId)
      .select(
        "id, user_id, total_amount, payment_status, payment_reference, shipping_address, created_at, updated_at, order_items (id, product_id, quantity, price, products (name)), users (full_name, email)"
      )
      .single()
    if (updateError || !data) {
      return { success: false, error: updateError?.message ?? "Unable to update order" }
    }
    await logAdminAction(supabase, user.id, "update_order_status", data.id, {
      payment_status: data.payment_status,
    })
    const rawOrder = data as RawOrderRow
    const usersValue = rawOrder.users
    const normalized = {
      ...rawOrder,
      order_items:
        rawOrder.order_items?.map((item) => ({
          ...item,
          products: Array.isArray(item.products) ? item.products[0] ?? null : item.products ?? null,
        })) ?? [],
      users: Array.isArray(usersValue) ? usersValue[0] ?? null : usersValue ?? null,
    }
    return { success: true, data: normalized }
  } catch {
    return { success: false, error: "Something went wrong" }
  }
}
