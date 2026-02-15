"use server"

import { createSupabaseServerClient } from "@/lib/supabase-server"
import { getURL } from "@/lib/utils"
import { loginSchema, signupSchema } from "@/features/auth/schemas/auth-schema"

type ActionResult = { success: true; message?: string } | { success: false; error: string }

export async function login(email: string, password: string): Promise<ActionResult> {
  try {
    const validated = loginSchema.parse({ email, password })
    const supabase = createSupabaseServerClient()
    const { error } = await supabase.auth.signInWithPassword(validated)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch {
    return { success: false, error: "Something went wrong" }
  }
}

export async function signup(formData: unknown): Promise<ActionResult> {
  try {
    const validated = signupSchema.parse(formData)
    const supabase = createSupabaseServerClient()
    const { data, error } = await supabase.auth.signUp({
      email: validated.email,
      password: validated.password,
      options: {
        data: {
          full_name: validated.fullName,
          phone: validated.phone,
        },
        emailRedirectTo: `${getURL()}/auth/callback`,
      },
    })

    if (error) {
      return { success: false, error: error.message }
    }

    if (data.user && data.session) {
      const { error: profileError } = await supabase.from("users").insert({
        id: data.user.id,
        full_name: validated.fullName,
        email: validated.email,
        phone: validated.phone,
      })

      if (profileError) {
        return { success: false, error: profileError.message }
      }
    }

    return {
      success: true,
      message: "Signup successful. Please check your email to confirm your account.",
    }
  } catch {
    return { success: false, error: "Something went wrong" }
  }
}

export async function logout(): Promise<ActionResult> {
  try {
    const supabase = createSupabaseServerClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch {
    return { success: false, error: "Something went wrong" }
  }
}
