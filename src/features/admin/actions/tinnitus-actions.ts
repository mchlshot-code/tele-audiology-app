"use server"

import { createSupabaseServerClient } from "@/lib/supabase-server"

type ActionResult<T> = { success: true; data: T } | { success: false; error: string }

export type AdminTinnitusScreening = {
  id: string
  user_id: string | null
  duration: string | null
  bothersomeness_score: number | null
  created_at: string
  updated_at: string
  users?: { full_name: string | null; email: string | null } | null
}

type RawTinnitusScreening = {
  id: string
  user_id: string | null
  duration: string | null
  bothersomeness_score: number | null
  created_at: string
  updated_at: string
  users?:
    | { full_name: string | null; email: string | null }
    | { full_name: string | null; email: string | null }[]
    | null
}

export type AdminTinnitusAssessment = {
  id: string
  user_id: string | null
  screening_id: string | null
  ths_section_a_score: number | null
  ths_section_b_score: number | null
  ths_section_c_screening: boolean | null
  ths_section_d_score: number | null
  tinnitus_impact: string | null
  recommended_step: string | null
  created_at: string
  updated_at: string
  users?: { full_name: string | null; email: string | null } | null
}

type RawTinnitusAssessment = {
  id: string
  user_id: string | null
  screening_id: string | null
  ths_section_a_score: number | null
  ths_section_b_score: number | null
  ths_section_c_screening: boolean | null
  ths_section_d_score: number | null
  tinnitus_impact: string | null
  recommended_step: string | null
  created_at: string
  updated_at: string
  users?:
    | { full_name: string | null; email: string | null }
    | { full_name: string | null; email: string | null }[]
    | null
}

export type AdminTinnitusTreatment = {
  id: string
  user_id: string | null
  assessment_id: string | null
  treatment_type: string | null
  status: string | null
  notes: string | null
  created_at: string
  updated_at: string
  users?: { full_name: string | null; email: string | null } | null
}

type RawTinnitusTreatment = {
  id: string
  user_id: string | null
  assessment_id: string | null
  treatment_type: string | null
  status: string | null
  notes: string | null
  created_at: string
  updated_at: string
  users?:
    | { full_name: string | null; email: string | null }
    | { full_name: string | null; email: string | null }[]
    | null
}

export type AdminSoundMaskingSession = {
  id: string
  user_id: string | null
  sound_type: string | null
  duration_minutes: number | null
  volume_level: number | null
  created_at: string
  updated_at: string
  users?: { full_name: string | null; email: string | null } | null
}

type RawSoundMaskingSession = {
  id: string
  user_id: string | null
  sound_type: string | null
  duration_minutes: number | null
  volume_level: number | null
  created_at: string
  updated_at: string
  users?:
    | { full_name: string | null; email: string | null }
    | { full_name: string | null; email: string | null }[]
    | null
}

export type AdminOutcomeMeasure = {
  id: string
  user_id: string | null
  treatment_id: string | null
  measurement_type: string | null
  score: number | null
  global_change: string | null
  created_at: string
  updated_at: string
  users?: { full_name: string | null; email: string | null } | null
}

type RawOutcomeMeasure = {
  id: string
  user_id: string | null
  treatment_id: string | null
  measurement_type: string | null
  score: number | null
  global_change: string | null
  created_at: string
  updated_at: string
  users?:
    | { full_name: string | null; email: string | null }
    | { full_name: string | null; email: string | null }[]
    | null
}

export type TinnitusOverview = {
  screenings: AdminTinnitusScreening[]
  assessments: AdminTinnitusAssessment[]
  treatments: AdminTinnitusTreatment[]
  soundSessions: AdminSoundMaskingSession[]
  outcomes: AdminOutcomeMeasure[]
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

export async function getTinnitusOverview(): Promise<ActionResult<TinnitusOverview>> {
  try {
    const { error, supabase } = await getAdminProfile()
    if (error) {
      return { success: false, error }
    }
    const [{ data: screenings, error: screeningsError }, { data: assessments, error: assessmentsError }, { data: treatments, error: treatmentsError }, { data: sessions, error: sessionsError }, { data: outcomes, error: outcomesError }] =
      await Promise.all([
        supabase
          .from("tinnitus_screenings")
          .select("id, user_id, duration, bothersomeness_score, created_at, updated_at, users (full_name, email)")
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("tinnitus_assessments")
          .select(
            "id, user_id, screening_id, ths_section_a_score, ths_section_b_score, ths_section_c_screening, ths_section_d_score, tinnitus_impact, recommended_step, created_at, updated_at, users (full_name, email)"
          )
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("tinnitus_treatments")
          .select(
            "id, user_id, assessment_id, treatment_type, status, notes, created_at, updated_at, users (full_name, email)"
          )
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("sound_masking_sessions")
          .select(
            "id, user_id, sound_type, duration_minutes, volume_level, created_at, updated_at, users (full_name, email)"
          )
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("outcome_measures")
          .select(
            "id, user_id, treatment_id, measurement_type, score, global_change, created_at, updated_at, users (full_name, email)"
          )
          .order("created_at", { ascending: false })
          .limit(50),
      ])

    if (screeningsError || assessmentsError || treatmentsError || sessionsError || outcomesError) {
      return { success: false, error: "Unable to load tinnitus data" }
    }

    const normalizedScreenings = (screenings as RawTinnitusScreening[] | null)?.map(
      (item) => ({
        ...item,
        users: Array.isArray(item.users) ? item.users[0] ?? null : item.users ?? null,
      })
    )
    const normalizedAssessments = (assessments as RawTinnitusAssessment[] | null)?.map(
      (item) => ({
        ...item,
        users: Array.isArray(item.users) ? item.users[0] ?? null : item.users ?? null,
      })
    )
    const normalizedTreatments = (treatments as RawTinnitusTreatment[] | null)?.map(
      (item) => ({
        ...item,
        users: Array.isArray(item.users) ? item.users[0] ?? null : item.users ?? null,
      })
    )
    const normalizedSessions = (sessions as RawSoundMaskingSession[] | null)?.map(
      (item) => ({
        ...item,
        users: Array.isArray(item.users) ? item.users[0] ?? null : item.users ?? null,
      })
    )
    const normalizedOutcomes = (outcomes as RawOutcomeMeasure[] | null)?.map((item) => ({
      ...item,
      users: Array.isArray(item.users) ? item.users[0] ?? null : item.users ?? null,
    }))

    return {
      success: true,
      data: {
        screenings: normalizedScreenings ?? [],
        assessments: normalizedAssessments ?? [],
        treatments: normalizedTreatments ?? [],
        soundSessions: normalizedSessions ?? [],
        outcomes: normalizedOutcomes ?? [],
      },
    }
  } catch {
    return { success: false, error: "Something went wrong" }
  }
}
