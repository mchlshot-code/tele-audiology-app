import { z } from "zod"

export const orderStatusOptions = ["pending", "paid", "failed", "refunded"] as const

export const orderStatusSchema = z.object({
  paymentStatus: z.enum(orderStatusOptions),
})

export type OrderStatusInput = z.infer<typeof orderStatusSchema>
