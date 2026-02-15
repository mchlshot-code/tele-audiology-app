"use client"

import { useState, useTransition } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert } from "@/components/ui/alert"
import { signup } from "@/features/auth/actions/auth-actions"
import { signupSchema, type SignupSchema } from "@/features/auth/schemas/auth-schema"

export default function SignupForm() {
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      consent: false,
    },
  })

  const onSubmit = (values: SignupSchema) => {
    setErrorMessage(null)
    setSuccessMessage(null)
    startTransition(async () => {
      const result = await signup(values)
      if (!result.success) {
        setErrorMessage(result.error)
        return
      }
      setSuccessMessage(result.message ?? "Signup successful.")
      reset()
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm"
    >
      <div className="space-y-2 text-center">
        <p className="text-sm font-semibold text-sky-700">Create your profile</p>
        <h1 className="text-2xl font-semibold text-slate-900">Sign up</h1>
        <p className="text-sm text-slate-500">
          Start personalized hearing care and secure access to screenings.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            placeholder="Adaeze Okoro"
            className="border-emerald-100 focus-visible:ring-emerald-400"
            {...register("fullName")}
          />
          {errors.fullName?.message && (
            <p className="text-xs text-rose-600">{errors.fullName.message}</p>
          )}
        </div>

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
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            placeholder="+2348012345678 or 08012345678"
            className="border-emerald-100 focus-visible:ring-emerald-400"
            {...register("phone")}
          />
          {errors.phone?.message && (
            <p className="text-xs text-rose-600">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Minimum 8 characters"
            className="border-emerald-100 focus-visible:ring-emerald-400"
            {...register("password")}
          />
          {errors.password?.message && (
            <p className="text-xs text-rose-600">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            className="border-emerald-100 focus-visible:ring-emerald-400"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword?.message && (
            <p className="text-xs text-rose-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3">
          <Controller
            name="consent"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                className="mt-1"
              />
            )}
          />
          <div className="space-y-1">
            <p className="text-sm font-medium text-emerald-900">
              I agree to the privacy policy and medical disclaimer
            </p>
            {errors.consent?.message && (
              <p className="text-xs text-rose-600">{errors.consent.message}</p>
            )}
          </div>
        </div>
      </div>

      {successMessage && (
        <Alert className="mt-4 border-emerald-200 bg-emerald-50 text-emerald-700">
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert className="mt-4 border-rose-200 bg-rose-50 text-rose-700">
          {errorMessage}
        </Alert>
      )}

      <Button
        type="submit"
        className="mt-6 w-full rounded-full bg-sky-600 hover:bg-sky-700"
        disabled={isPending}
      >
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create account
      </Button>
    </form>
  )
}
