import { z } from "zod"

export const triageAssessmentSchema = z.object({
  age: z.number().int().min(1).max(120),
  noiseExposure: z.enum(["<1hr", "1-3hr", "4-6hr", "6+hr"]),
  difficultyHearing: z.enum(["No", "Sometimes", "Often", "Always"]),
  tinnitus: z.enum(["No", "Occasionally", "Frequently"]),
  familyHistory: z.enum(["No", "Yes", "Unsure"]),
})

export type TriageAssessmentInput = z.infer<typeof triageAssessmentSchema>
