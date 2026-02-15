import { z } from "zod"

export const productFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be 0 or higher"),
  stockQuantity: z.number().int().min(0, "Stock must be 0 or higher"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  category: z.string().optional(),
})

export type ProductFormInput = z.infer<typeof productFormSchema>
