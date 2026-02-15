"use server"

import { createSupabaseServerClient } from "@/lib/supabase-server"
import {
  consultationStatusSchema,
  type ConsultationStatusInput,
} from "@/features/admin/schemas/consultation-schema"

type ActionResult<T> = { success: true; data: T } | { success: false; error: string }

export type AdminConsultation = {
  id: string
  user_id: string
  scheduled_at: string
  status: ConsultationStatusInput["status"]
  notes: string | null
  created_at: string
  updated_at: string
  users?: { full_name: string | null; email: string | null; phone: string | null } | null
}

type RawConsultation = {
  id: string
  user_id: string
  scheduled_at: string
  status: ConsultationStatusInput["status"]
  notes: string | null
  created_at: string
  updated_at: string
  users?:
    | { full_name: string | null; email: string | null; phone: string | null }
    | { full_name: string | null; email: string | null; phone: string | null }[]
    | null
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
    resource_type: "consultations",
    resource_id: resourceId ?? null,
    details: details ?? null,
    ip_address: null,
  })
}

export async function getConsultations(): Promise<ActionResult<AdminConsultation[]>> {
  try {
    const { error, supabase } = await getAdminProfile()
    if (error) {
      return { success: false, error }
    }
    const { data, error: listError } = await supabase
      .from("consultations")
      .select("id, user_id, scheduled_at, status, notes, created_at, updated_at, users (full_name, email, phone)")
      .order("scheduled_at", { ascending: false })
      .limit(100)
    if (listError) {
      return { success: false, error: listError.message }
    }
    const normalized = (data as RawConsultation[] | null)?.map((item) => ({
      ...item,
      users: Array.isArray(item.users) ? item.users[0] ?? null : item.users ?? null,
    }))
    return { success: true, data: normalized ?? [] }
  } catch {
    return { success: false, error: "Something went wrong" }
  }
}

export async function updateConsultationStatus(
  consultationId: string,
  formData: unknown
): Promise<ActionResult<AdminConsultation>> {
  try {
    const validated = consultationStatusSchema.parse(formData)
    const { error, supabase, user } = await getAdminProfile()
    if (error || !user) {
      return { success: false, error: error ?? "Admin access required" }
    }
    const { data, error: updateError } = await supabase
      .from("consultations")
      .update({ status: validated.status })
      .eq("id", consultationId)
      .select("id, user_id, scheduled_at, status, notes, created_at, updated_at, users (full_name, email, phone)")
      .single()
    if (updateError || !data) {
      return { success: false, error: updateError?.message ?? "Unable to update consultation" }
    }
    await logAdminAction(supabase, user.id, "update_consultation_status", data.id, {
      status: data.status,
    })
    const raw = data as RawConsultation
    return {
      success: true,
      data: {
        ...raw,
        users: Array.isArray(raw.users) ? raw.users[0] ?? null : raw.users ?? null,
      },
    }
  } catch {
    return { success: false, error: "Something went wrong" }
  }
}
