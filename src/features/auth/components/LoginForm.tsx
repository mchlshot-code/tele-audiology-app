"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert } from "@/components/ui/alert"
import { login } from "@/features/auth/actions/auth-actions"
import { loginSchema, type LoginSchema } from "@/features/auth/schemas/auth-schema"

export default function LoginForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (values: LoginSchema) => {
    setErrorMessage(null)
    startTransition(async () => {
      const result = await login(values.email, values.password)
      if (!result.success) {
        setErrorMessage(result.error)
        return
      }
      router.push("/dashboard")
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm"
    >
      <div className="space-y-2 text-center">
        <p className="text-sm font-semibold text-emerald-700">Secure patient access</p>
        <h1 className="text-2xl font-semibold text-slate-900">Sign in</h1>
        <p className="text-sm text-slate-500">
          Continue your hearing care journey with trusted specialists.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@email.com"
            className="border-emerald-100 focus-visible:ring-emerald-400"
            {...register("email")}
          />
          {errors.email?.message && (
            <p className="text-xs text-rose-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="border-emerald-100 focus-visible:ring-emerald-400"
            {...register("password")}
          />
          {errors.password?.message && (
            <p className="text-xs text-rose-600">{errors.password.message}</p>
          )}
        </div>
      </div>

      {errorMessage && (
        <Alert className="mt-4 border-rose-200 bg-rose-50 text-rose-700">
          {errorMessage}
        </Alert>
      )}

      <Button
        type="submit"
        className="mt-6 w-full rounded-full bg-emerald-600 hover:bg-emerald-700"
        disabled={isPending}
      >
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Sign In
      </Button>
    </form>
  )
}
