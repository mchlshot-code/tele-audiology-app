import { z } from "zod"

export const contentStatusOptions = ["draft", "published", "archived"] as const
export const contentTypeOptions = ["blog_post", "guide", "faq", "page"] as const

export const contentFormSchema = z.object({
  title: z.string().min(3, "Title is required"),
  slug: z
    .string()
    .min(3, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with dashes"),
  content: z.string().optional(),
  contentType: z.enum(contentTypeOptions),
  status: z.enum(contentStatusOptions),
  featuredImageUrl: z.string().url().optional().or(z.literal("")),
})

export type ContentFormInput = z.infer<typeof contentFormSchema>
