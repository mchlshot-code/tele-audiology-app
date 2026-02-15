import type { Metadata } from "next";
import localFont from "next/font/local";
import { MEDICAL_DISCLAIMER } from "@/shared/lib/medical-disclaimer";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col">
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
