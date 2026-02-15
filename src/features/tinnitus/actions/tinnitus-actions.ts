"use server"

import { createSupabaseServerClient } from "@/lib/supabase-server"
import {
  thsSchema,
  tinnitusImpactSchema,
  tinnitusScreenerSchema,
  outcomeMeasureSchema,
  soundMaskingSessionSchema,
  type TinnitusImpactInput,
} from "@/features/tinnitus/schemas/tinnitus-schema"

type RiskResult =
  | { success: true; impact: ImpactLevel; recommendedStep: RecommendedStep }
  | { success: false; error: string }

type ActionResult =
  | { success: true; data?: Record<string, unknown> }
  | { success: false; error: string }

type ImpactLevel = "none" | "mild" | "moderate" | "severe" | "catastrophic"
type RecommendedStep = "step_2" | "step_3" | "step_4" | "step_5" | "step_6"

function calculateImpactLevel(input: TinnitusImpactInput) {
  const total =
    input.thsSectionAScore +
    input.thsSectionBScore +
    input.thsSectionDScore +
    (input.thsSectionCScreening ? 5 : 0)

  if (total <= 7) {
    return { impact: "none" as const, recommendedStep: "step_2" as const }
  }
  if (total <= 15) {
    return { impact: "mild" as const, recommendedStep: "step_3" as const }
  }
  if (total <= 25) {
    return { impact: "moderate" as const, recommendedStep: "step_4" as const }
  }
  if (total <= 35) {
    return { impact: "severe" as const, recommendedStep: "step_5" as const }
  }
  return { impact: "catastrophic" as const, recommendedStep: "step_6" as const }
}

export async function submitScreener(data: unknown): Promise<ActionResult> {
  try {
    const validated = tinnitusScreenerSchema.parse(data)
    const supabase = createSupabaseServerClient()
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData.user) {
      return { success: true, data: { saved: false } }
    }

    const { error } = await supabase.from("tinnitus_screenings").insert({
      user_id: userData.user.id,
      duration: validated.duration,
      bothersomeness_score: validated.bothersomenessScore,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: { saved: true } }
  } catch (error) {
    console.error("Error in submitScreener:", error)
    return { success: false, error: "Something went wrong" }
  }
}

export async function submitTHS(data: unknown): Promise<ActionResult> {
  try {
    const validated = thsSchema.parse(data)
    const supabase = createSupabaseServerClient()
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData.user) {
      return { success: false, error: "Please sign in to save your assessment." }
    }

    const impact = calculateImpactLevel(validated)

    const { error } = await supabase.from("tinnitus_assessments").insert({
      user_id: userData.user.id,
      screening_id: validated.screeningId,
      ths_section_a_score: validated.thsSectionAScore,
      ths_section_b_score: validated.thsSectionBScore,
      ths_section_c_screening: validated.thsSectionCScreening,
      ths_section_d_score: validated.thsSectionDScore,
      tinnitus_impact: impact.impact,
      recommended_step: impact.recommendedStep,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: impact }
  } catch (error) {
    console.error("Error in submitTHS:", error)
    return { success: false, error: "Something went wrong" }
  }
}

export async function calculateTinnitusImpact(
  responses: unknown
): Promise<RiskResult> {
  try {
    const validated = tinnitusImpactSchema.parse(responses)
    const result = calculateImpactLevel(validated)
    return { success: true, impact: result.impact, recommendedStep: result.recommendedStep }
  } catch (error) {
    console.error("Error in calculateTinnitusImpact:", error)
    return { success: false, error: "Something went wrong" }
  }
}

export async function saveOutcomeAssessment(data: unknown): Promise<ActionResult> {
  try {
    const validated = outcomeMeasureSchema.parse(data)
    const supabase = createSupabaseServerClient()
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData.user) {
      return { success: false, error: "Please sign in to save outcomes." }
    }

    const { error } = await supabase.from("outcome_measures").insert({
      user_id: userData.user.id,
      treatment_id: validated.treatmentId,
      measurement_type: validated.measurementType,
      score: validated.score,
      global_change: validated.globalChange,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in saveOutcomeAssessment:", error)
    return { success: false, error: "Something went wrong" }
  }
}

export async function getTreatmentRecommendation(
  assessmentId: string
): Promise<{ success: true; data: { impact: ImpactLevel; step: RecommendedStep; recommendation: string } } | { success: false; error: string }> {
  try {
    const supabase = createSupabaseServerClient()
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData.user) {
      return { success: false, error: "Please sign in to view recommendations." }
    }

    const { data, error } = await supabase
      .from("tinnitus_assessments")
      .select("tinnitus_impact, recommended_step")
      .eq("id", assessmentId)
      .single()

    if (error || !data) {
      return { success: false, error: "Assessment not found." }
    }

    const recommendationMap: Record<RecommendedStep, string> = {
      step_2: "Education and reassurance with self-management resources.",
      step_3: "Structured counseling and hearing screening follow-up.",
      step_4: "Sound therapy with masking and relaxation guidance.",
      step_5: "Advanced counseling support and multidisciplinary review.",
      step_6: "Comprehensive management with clinical referral.",
    }

    const step = data.recommended_step as RecommendedStep
    const impact = data.tinnitus_impact as ImpactLevel

    return {
      success: true,
      data: {
        impact,
        step,
        recommendation: recommendationMap[step],
      },
    }
  } catch (error) {
    console.error("Error in getTreatmentRecommendation:", error)
    return { success: false, error: "Something went wrong" }
  }
}

export async function saveSoundMaskingSession(data: unknown): Promise<ActionResult> {
  try {
    const validated = soundMaskingSessionSchema.parse(data)
    const supabase = createSupabaseServerClient()
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData.user) {
      return { success: false, error: "Please sign in to save sound masking sessions." }
    }

    const { error } = await supabase.from("sound_masking_sessions").insert({
      user_id: userData.user.id,
      sound_type: validated.soundType,
      duration_minutes: validated.durationMinutes,
      volume_level: validated.volumeLevel,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in saveSoundMaskingSession:", error)
    return { success: false, error: "Something went wrong" }
  }
}
