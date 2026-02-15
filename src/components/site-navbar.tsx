"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

type Props = {
  hasSession: boolean
  signOutAction: () => void | Promise<void>
}

type Section = "tinnitus" | "triage" | "consultation" | "shop" | "general"

export default function SiteNavbar({ hasSession, signOutAction }: Props) {
  const pathname = usePathname()

  const section: Section = pathname.startsWith("/tinnitus")
    ? "tinnitus"
    : pathname.startsWith("/triage")
    ? "triage"
    : pathname.startsWith("/consultation")
    ? "consultation"
    : pathname.startsWith("/shop")
    ? "shop"
    : "general"

  const links =
    section === "tinnitus"
      ? [
          { href: "/tinnitus/screener", label: "Tinnitus Care" },
          { href: "/tinnitus/care-path", label: "Care Path" },
        ]
      : section === "triage"
      ? [{ href: "/triage", label: "Hearing Test" }]
      : section === "consultation"
      ? [{ href: "/consultation", label: "Consultation" }]
      : section === "shop"
      ? [{ href: "/shop", label: "Shop" }]
      : [
          { href: "/triage", label: "Hearing Test" },
          { href: "/tinnitus/screener", label: "Tinnitus Care" },
          { href: "/consultation", label: "Consultation" },
          { href: "/shop", label: "Shop" },
        ]

  return (
    <nav className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-600">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-full px-3 py-1 hover:bg-emerald-50 hover:text-emerald-800"
        >
          {link.label}
        </Link>
      ))}
      {hasSession ? (
        <>
          <Link
            href="/dashboard"
            className="rounded-full px-3 py-1 text-emerald-700 hover:bg-emerald-50"
          >
            Dashboard
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded-full border border-emerald-200 px-4 py-1 text-emerald-700 hover:bg-emerald-50"
            >
              Sign Out
            </button>
          </form>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="rounded-full px-3 py-1 text-emerald-700 hover:bg-emerald-50"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-emerald-600 px-4 py-1 text-white hover:bg-emerald-700"
          >
            Get Started
          </Link>
        </>
      )}
    </nav>
  )
}
