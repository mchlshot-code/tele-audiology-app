"use client"

import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  productFormSchema,
  type ProductFormInput,
} from "@/features/admin/schemas/product-schema"

type ProductFormProps = {
  initialValues?: ProductFormInput | null
  isSubmitting: boolean
  onSubmit: (data: ProductFormInput) => void
  onCancel?: () => void
}

export function ProductForm({
  initialValues,
  isSubmitting,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const defaultValues = useMemo<ProductFormInput>(
    () => ({
      name: "",
      description: "",
      price: 0,
      stockQuantity: 0,
      imageUrl: "",
      category: "",
    }),
    []
  )

  const form = useForm<ProductFormInput>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  })

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues)
      return
    }
    form.reset(defaultValues)
  }, [defaultValues, form, initialValues])

  const submitHandler = form.handleSubmit((data) => onSubmit(data))

  return (
    <form onSubmit={submitHandler} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="text-xs text-rose-600">{form.formState.errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" {...form.register("category")} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Price (₦)</Label>
          <Input
            id="price"
            type="number"
            step="1"
            min="0"
            {...form.register("price", { valueAsNumber: true })}
          />
          {form.formState.errors.price && (
            <p className="text-xs text-rose-600">{form.formState.errors.price.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="stockQuantity">Stock quantity</Label>
          <Input
            id="stockQuantity"
            type="number"
            min="0"
            {...form.register("stockQuantity", { valueAsNumber: true })}
          />
          {form.formState.errors.stockQuantity && (
            <p className="text-xs text-rose-600">
              {form.formState.errors.stockQuantity.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input id="imageUrl" {...form.register("imageUrl")} />
        {form.formState.errors.imageUrl && (
          <p className="text-xs text-rose-600">{form.formState.errors.imageUrl.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          rows={5}
          className="w-full rounded-md border border-emerald-100 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
          {...form.register("description")}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
          {initialValues ? "Update product" : "Create product"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel edit
          </Button>
        )}
      </div>
    </form>
  )
}
