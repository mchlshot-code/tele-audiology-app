"use server"

import { createSupabaseServerClient } from "@/lib/supabase-server"
import { adminRoles } from "@/features/admin/constants/admin-roles"

type ActionResult<T> = { success: true; data: T } | { success: false; error: string }

export type AdminHearingAssessment = {
  id: string
  user_id: string
  age: number | null
  noise_exposure_hours: number | null
  difficulty_hearing: boolean | null
  tinnitus: boolean | null
  family_history: boolean | null
  risk_level: "low" | "moderate" | "high" | null
  created_at: string
  updated_at: string
  users?: { full_name: string | null; email: string | null } | null
}

type RawHearingAssessment = {
  id: string
  user_id: string
  age: number | null
  noise_exposure_hours: number | null
  difficulty_hearing: boolean | null
  tinnitus: boolean | null
  family_history: boolean | null
  risk_level: "low" | "moderate" | "high" | null
  created_at: string
  updated_at: string
  users?:
    | { full_name: string | null; email: string | null }
    | { full_name: string | null; email: string | null }[]
    | null
}

type AdminUser = {
  id: string
  is_admin: boolean
  admin_role: string | null
}

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

export async function getHearingAssessments(): Promise<ActionResult<AdminHearingAssessment[]>> {
  try {
    const { error, supabase } = await getAdminProfile()
    if (error) {
      return { success: false, error }
    }
    const { data, error: listError } = await supabase
      .from("hearing_assessments")
      .select(
        "id, user_id, age, noise_exposure_hours, difficulty_hearing, tinnitus, family_history, risk_level, created_at, updated_at, users (full_name, email)"
      )
      .order("created_at", { ascending: false })
      .limit(100)
    if (listError) {
      return { success: false, error: listError.message }
    }
    const normalized = (data as RawHearingAssessment[] | null)?.map((item) => ({
      ...item,
      users: Array.isArray(item.users) ? item.users[0] ?? null : item.users ?? null,
    }))
    return { success: true, data: normalized ?? [] }
  } catch {
    return { success: false, error: "Something went wrong" }
  }
}
