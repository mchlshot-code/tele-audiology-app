import { z } from "zod"

export const consultationStatusOptions = ["pending", "confirmed", "completed", "cancelled"] as const

export const consultationStatusSchema = z.object({
  status: z.enum(consultationStatusOptions),
})

export type ConsultationStatusInput = z.infer<typeof consultationStatusSchema>
