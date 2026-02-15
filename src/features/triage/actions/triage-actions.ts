"use server"

import { createSupabaseServerClient } from "@/lib/supabase-server"
import {
  triageAssessmentSchema,
  type TriageAssessmentInput,
} from "@/features/triage/schemas/triage-schema"

type RiskLevel = "low" | "moderate" | "high"

type ActionResult =
  | { success: true; riskLevel: RiskLevel; saved: boolean }
  | { success: false; error: string }

function getRiskLevel(input: TriageAssessmentInput): RiskLevel {
  const highRisk =
    input.age > 60 ||
    input.noiseExposure === "6+hr" ||
    input.difficultyHearing === "Always"

  if (highRisk) {
    return "high"
  }

  const riskFactors = [
    input.age >= 45,
    input.noiseExposure !== "<1hr",
    input.difficultyHearing === "Often",
    input.tinnitus !== "No",
    input.familyHistory === "Yes",
  ].filter(Boolean).length

  if (riskFactors >= 2) {
    return "moderate"
  }

  return "low"
}

export async function calculateRisk(formData: unknown): Promise<ActionResult> {
  try {
    const validated = triageAssessmentSchema.parse(formData)
    const riskLevel = getRiskLevel(validated)
    const supabase = createSupabaseServerClient()
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData.user) {
      return { success: true, riskLevel, saved: false }
    }

    const { error } = await supabase.from("hearing_assessments").insert({
      user_id: userData.user.id,
      age: validated.age,
      noise_exposure_hours:
        validated.noiseExposure === "<1hr"
          ? 0
          : validated.noiseExposure === "1-3hr"
          ? 2
          : validated.noiseExposure === "4-6hr"
          ? 5
          : 7,
      difficulty_hearing: validated.difficultyHearing !== "No",
      tinnitus: validated.tinnitus !== "No",
      family_history: validated.familyHistory === "Yes",
      risk_level: riskLevel,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, riskLevel, saved: true }
  } catch {
    return { success: false, error: "Something went wrong" }
  }
}
