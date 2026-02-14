import type { Metadata } from "next";
import localFont from "next/font/local";
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

export const MEDICAL_DISCLAIMER = `
⚕️ IMPORTANT MEDICAL DISCLAIMER

This platform provides educational information and hearing health screening tools.
It is NOT a substitute for professional medical advice, diagnosis, or treatment.

• Always seek the advice of a qualified audiologist or physician
• Do not disregard professional medical advice based on information here
• This service does not diagnose conditions or prescribe treatments
• Operated by a registered Audiology student - not a licensed practitioner

If you think you may have a medical emergency, call your doctor immediately.
`;

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
