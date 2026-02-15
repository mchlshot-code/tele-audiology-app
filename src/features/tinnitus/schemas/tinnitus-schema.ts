import { z } from "zod"

export const tinnitusScreenerSchema = z.object({
  duration: z.enum([
    "persistent",
    "recent_onset",
    "transient",
    "temporary",
    "occasional",
    "intermittent",
    "constant",
  ]),
  bothersomenessScore: z.coerce.number().int().min(0).max(10),
  sleepImpact: z.enum(["none", "mild", "moderate", "severe"]),
  concentrationImpact: z.enum(["none", "mild", "moderate", "severe"]),
  emotionalImpact: z.enum(["none", "mild", "moderate", "severe"]),
  hearingDifficulty: z.enum(["no", "sometimes", "often", "always"]),
})

export const thsSchema = z.object({
  screeningId: z.string().uuid().optional(),
  thsSectionAScore: z.coerce.number().int().min(0).max(10),
  thsSectionBScore: z.coerce.number().int().min(0).max(10),
  thsSectionCScreening: z.boolean(),
  thsSectionDScore: z.coerce.number().int().min(0).max(10),
})

export const tinnitusInterviewSchema = z.object({
  onset: z.enum(["sudden", "gradual", "unknown"]),
  laterality: z.enum(["left", "right", "both", "head"]),
  soundDescription: z.string().min(3),
  triggers: z.string().optional(),
  hearingCareHistory: z.enum(["none", "hearing_test", "hearing_aids", "medical_visit"]),
  noiseExposure: z.enum(["low", "moderate", "high"]),
  sleepQuality: z.enum(["good", "fair", "poor"]),
  stressLevel: z.enum(["low", "moderate", "high"]),
})

export const outcomeMeasureSchema = z.object({
  treatmentId: z.string().uuid().optional(),
  measurementType: z.enum(["tfi", "thi", "ths"]),
  score: z.coerce.number().int().min(0).max(100),
  globalChange: z.enum([
    "very_much_worse",
    "much_worse",
    "a_little_worse",
    "no_change",
    "a_little_better",
    "much_better",
    "very_much_better",
  ]),
})

export const tinnitusImpactSchema = z.object({
  thsSectionAScore: z.coerce.number().int().min(0).max(10),
  thsSectionBScore: z.coerce.number().int().min(0).max(10),
  thsSectionCScreening: z.boolean(),
  thsSectionDScore: z.coerce.number().int().min(0).max(10),
})

export const soundMaskingSessionSchema = z.object({
  soundType: z.enum([
    "white_noise",
    "pink_noise",
    "brown_noise",
    "nature_sounds",
    "rain",
    "ocean",
    "forest",
    "custom",
  ]),
  durationMinutes: z.coerce.number().int().min(1).max(240),
  volumeLevel: z.coerce.number().int().min(0).max(100),
})

export type TinnitusScreenerInput = z.infer<typeof tinnitusScreenerSchema>
export type THSInput = z.infer<typeof thsSchema>
export type TinnitusInterviewInput = z.infer<typeof tinnitusInterviewSchema>
export type OutcomeMeasureInput = z.infer<typeof outcomeMeasureSchema>
export type TinnitusImpactInput = z.infer<typeof tinnitusImpactSchema>
export type SoundMaskingSessionInput = z.infer<typeof soundMaskingSessionSchema>
