import Link from "next/link"
import { redirect } from "next/navigation"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { createSupabaseServerClient } from "@/lib/supabase-server"

const adminRoles = ["super_admin", "admin", "content_manager", "viewer"]

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase.auth.getUser()
  if (!data.user) {
    redirect("/login")
  }
  const { data: profile } = await supabase
    .from("users")
    .select("is_admin, admin_role")
    .eq("id", data.user.id)
    .single()
  if (!profile?.is_admin || !adminRoles.includes(profile.admin_role ?? "")) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50">
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-100 bg-white/80 px-5 py-4 shadow-sm">
          <div>
            <p className="text-sm font-semibold text-emerald-700">Admin Console</p>
            <p className="text-lg font-semibold text-slate-900">Tele-Audiology CMS</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" className="border-emerald-200 text-emerald-700">
              <Link href="/admin/content">Content</Link>
            </Button>
            <Button asChild variant="outline" className="border-emerald-200 text-emerald-700">
              <Link href="/admin/products">Products</Link>
            </Button>
            <Button asChild variant="outline" className="border-emerald-200 text-emerald-700">
              <Link href="/admin/orders">Orders</Link>
            </Button>
            <Button asChild variant="ghost" className="text-slate-600">
              <Link href="/">Back to site</Link>
            </Button>
          </div>
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  )
}
