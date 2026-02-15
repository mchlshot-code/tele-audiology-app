"use server"

import { createSupabaseServerClient } from "@/lib/supabase-server"
import { productFormSchema } from "@/features/admin/schemas/product-schema"

type ActionResult<T> = { success: true; data: T } | { success: false; error: string }

type ProductRow = {
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
    resource_type: "products",
    resource_id: resourceId ?? null,
    details: details ?? null,
    ip_address: null,
  })
}

export async function getProducts(): Promise<ActionResult<ProductRow[]>> {
  try {
    const { error, supabase } = await getAdminProfile()
    if (error) {
      return { success: false, error }
    }
    const { data, error: listError } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
    if (listError) {
      return { success: false, error: listError.message }
    }
    return { success: true, data: data ?? [] }
  } catch {
    return { success: false, error: "Something went wrong" }
  }
}

export async function createProduct(formData: unknown): Promise<ActionResult<ProductRow>> {
  try {
    const validated = productFormSchema.parse(formData)
    const { error, supabase, user } = await getAdminProfile()
    if (error || !user) {
      return { success: false, error: error ?? "Admin access required" }
    }
    const payload = {
      name: validated.name,
      description: validated.description ?? null,
      price: validated.price,
      stock_quantity: validated.stockQuantity,
      image_url: validated.imageUrl || null,
      category: validated.category ?? null,
    }
    const { data, error: insertError } = await supabase
      .from("products")
      .insert(payload)
      .select("*")
      .single()
    if (insertError || !data) {
      return { success: false, error: insertError?.message ?? "Unable to create product" }
    }
    await logAdminAction(supabase, user.id, "create_product", data.id, {
      name: data.name,
      price: data.price,
    })
    return { success: true, data }
  } catch {
    return { success: false, error: "Something went wrong" }
  }
}

export async function updateProduct(
  productId: string,
  formData: unknown
): Promise<ActionResult<ProductRow>> {
  try {
    const validated = productFormSchema.parse(formData)
    const { error, supabase, user } = await getAdminProfile()
    if (error || !user) {
      return { success: false, error: error ?? "Admin access required" }
    }
    const payload = {
      name: validated.name,
      description: validated.description ?? null,
      price: validated.price,
      stock_quantity: validated.stockQuantity,
      image_url: validated.imageUrl || null,
      category: validated.category ?? null,
    }
    const { data, error: updateError } = await supabase
      .from("products")
      .update(payload)
      .eq("id", productId)
      .select("*")
      .single()
    if (updateError || !data) {
      return { success: false, error: updateError?.message ?? "Unable to update product" }
    }
    await logAdminAction(supabase, user.id, "update_product", data.id, {
      name: data.name,
      price: data.price,
    })
    return { success: true, data }
  } catch {
    return { success: false, error: "Something went wrong" }
  }
}
