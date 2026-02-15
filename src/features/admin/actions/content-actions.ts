"use server"

import { createSupabaseServerClient } from "@/lib/supabase-server"
import { contentFormSchema } from "@/features/admin/schemas/content-schema"

type ActionResult<T> = { success: true; data: T } | { success: false; error: string }

type ContentRow = {
  id: string
  title: string
  slug: string
  content: string | null
  content_type: string | null
  status: string | null
  featured_image_url: string | null
  author_id: string | null
  published_at: string | null
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
    resource_type: "content",
    resource_id: resourceId ?? null,
    details: details ?? null,
    ip_address: null,
  })
}

export async function getContentList(): Promise<ActionResult<ContentRow[]>> {
  try {
    const { error, supabase } = await getAdminProfile()
    if (error) {
      return { success: false, error }
    }
    const { data, error: listError } = await supabase
      .from("content")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)
    if (listError) {
      return { success: false, error: listError.message }
    }
    return { success: true, data: data ?? [] }
  } catch {
    return { success: false, error: "Something went wrong" }
  }
}

export async function createContent(
  formData: unknown
): Promise<ActionResult<ContentRow>> {
  try {
    const validated = contentFormSchema.parse(formData)
    const { error, supabase, user } = await getAdminProfile()
    if (error || !user) {
      return { success: false, error: error ?? "Admin access required" }
    }
    const payload = {
      title: validated.title,
      slug: validated.slug,
      content: validated.content ?? null,
      content_type: validated.contentType,
      status: validated.status,
      featured_image_url: validated.featuredImageUrl || null,
      author_id: user.id,
      published_at: validated.status === "published" ? new Date().toISOString() : null,
    }
    const { data, error: insertError } = await supabase
      .from("content")
      .insert(payload)
      .select("*")
      .single()
    if (insertError || !data) {
      return { success: false, error: insertError?.message ?? "Unable to create content" }
    }
    await logAdminAction(supabase, user.id, "create_content", data.id, {
      title: data.title,
      status: data.status,
    })
    return { success: true, data }
  } catch {
    return { success: false, error: "Something went wrong" }
  }
}

export async function updateContent(
  contentId: string,
  formData: unknown
): Promise<ActionResult<ContentRow>> {
  try {
    const validated = contentFormSchema.parse(formData)
    const { error, supabase, user } = await getAdminProfile()
    if (error || !user) {
      return { success: false, error: error ?? "Admin access required" }
    }
    const payload = {
      title: validated.title,
      slug: validated.slug,
      content: validated.content ?? null,
      content_type: validated.contentType,
      status: validated.status,
      featured_image_url: validated.featuredImageUrl || null,
      published_at: validated.status === "published" ? new Date().toISOString() : null,
    }
    const { data, error: updateError } = await supabase
      .from("content")
      .update(payload)
      .eq("id", contentId)
      .select("*")
      .single()
    if (updateError || !data) {
      return { success: false, error: updateError?.message ?? "Unable to update content" }
    }
    await logAdminAction(supabase, user.id, "update_content", data.id, {
      title: data.title,
      status: data.status,
    })
    return { success: true, data }
  } catch {
    return { success: false, error: "Something went wrong" }
  }
}
