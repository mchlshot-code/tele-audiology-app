import { z } from "zod"

const nigerianPhoneRegex = /^(\+234|0)[0-9]{10}$/
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const signupSchema = z
  .object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().regex(nigerianPhoneRegex),
    password: z.string().regex(passwordRegex),
    confirmPassword: z.string().min(1),
    consent: z.boolean().refine((value) => value === true),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
  })

export type LoginSchema = z.infer<typeof loginSchema>
export type SignupSchema = z.infer<typeof signupSchema>
