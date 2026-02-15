import type { Metadata } from "next";
import Link from "next/link";
import localFont from "next/font/local";
import { redirect } from "next/navigation";
import { MEDICAL_DISCLAIMER } from "@/shared/lib/medical-disclaimer";
import { logout } from "@/features/auth/actions/auth-actions";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Tele-Audiology Nigeria",
  description: "Accessible hearing care, triage, and consultations across Nigeria.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const hasSession = Boolean(userData.user);

  async function signOutAction() {
    "use server";
    await logout();
    redirect("/");
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/90 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
              <div className="flex items-center justify-between gap-4">
                <Link href="/" className="text-lg font-semibold text-emerald-800">
                  Tele-Audiology
                </Link>
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 sm:hidden">
                  <span className="rounded-full bg-emerald-50 px-3 py-1">Nigeria</span>
                  <span className="rounded-full bg-sky-50 px-3 py-1">WAT</span>
                </div>
              </div>
              <nav className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-600">
                <Link href="/triage" className="rounded-full px-3 py-1 hover:bg-emerald-50 hover:text-emerald-800">
                  Hearing Test
                </Link>
                <Link href="/tinnitus/screener" className="rounded-full px-3 py-1 hover:bg-emerald-50 hover:text-emerald-800">
                  Tinnitus Care
                </Link>
                <Link href="/consultation" className="rounded-full px-3 py-1 hover:bg-emerald-50 hover:text-emerald-800">
                  Consultation
                </Link>
                <Link href="/shop" className="rounded-full px-3 py-1 hover:bg-emerald-50 hover:text-emerald-800">
                  Shop
                </Link>
                {hasSession ? (
                  <>
                    <Link href="/dashboard" className="rounded-full px-3 py-1 text-emerald-700 hover:bg-emerald-50">
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
                    <Link href="/login" className="rounded-full px-3 py-1 text-emerald-700 hover:bg-emerald-50">
                      Sign In
                    </Link>
                    <Link href="/signup" className="rounded-full bg-emerald-600 px-4 py-1 text-white hover:bg-emerald-700">
                      Get Started
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-emerald-100 bg-emerald-50/60">
            <div className="mx-auto w-full max-w-6xl px-5 py-8 text-xs text-emerald-900 sm:px-8 lg:px-10">
              <p className="whitespace-pre-line leading-relaxed">
                {MEDICAL_DISCLAIMER}
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
