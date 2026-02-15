"use client"

import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  contentFormSchema,
  contentStatusOptions,
  contentTypeOptions,
  type ContentFormInput,
} from "@/features/admin/schemas/content-schema"

type ContentFormProps = {
  initialValues?: ContentFormInput | null
  isSubmitting: boolean
  onSubmit: (data: ContentFormInput) => void
  onCancel?: () => void
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")

export function ContentForm({
  initialValues,
  isSubmitting,
  onSubmit,
  onCancel,
}: ContentFormProps) {
  const defaultValues = useMemo<ContentFormInput>(
    () => ({
      title: "",
      slug: "",
      content: "",
      contentType: "blog_post",
      status: "draft",
      featuredImageUrl: "",
    }),
    []
  )

  const form = useForm<ContentFormInput>({
    resolver: zodResolver(contentFormSchema),
    defaultValues,
  })

  const titleValue = form.watch("title")
  const slugValue = form.watch("slug")

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues)
      return
    }
    form.reset(defaultValues)
  }, [defaultValues, form, initialValues])

  useEffect(() => {
    if (!slugValue && titleValue) {
      form.setValue("slug", slugify(titleValue))
    }
  }, [form, slugValue, titleValue])

  const submitHandler = form.handleSubmit((data) => onSubmit(data))

  return (
    <form onSubmit={submitHandler} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...form.register("title")} />
          {form.formState.errors.title && (
            <p className="text-xs text-rose-600">{form.formState.errors.title.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...form.register("slug")} />
          {form.formState.errors.slug && (
            <p className="text-xs text-rose-600">{form.formState.errors.slug.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Content type</Label>
          <Select
            value={form.watch("contentType")}
            onValueChange={(value) => form.setValue("contentType", value as ContentFormInput["contentType"])}
          >
            <SelectTrigger className="border-emerald-100 focus:ring-emerald-400">
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              {contentTypeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={form.watch("status")}
            onValueChange={(value) => form.setValue("status", value as ContentFormInput["status"])}
          >
            <SelectTrigger className="border-emerald-100 focus:ring-emerald-400">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {contentStatusOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="featuredImageUrl">Featured image URL</Label>
        <Input id="featuredImageUrl" {...form.register("featuredImageUrl")} />
        {form.formState.errors.featuredImageUrl && (
          <p className="text-xs text-rose-600">
            {form.formState.errors.featuredImageUrl.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <textarea
          id="content"
          rows={6}
          className="w-full rounded-md border border-emerald-100 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
          {...form.register("content")}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
          {initialValues ? "Update content" : "Create content"}
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
