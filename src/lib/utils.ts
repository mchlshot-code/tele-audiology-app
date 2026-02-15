import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getURL() {
  let url = process.env.NEXT_PUBLIC_SITE_URL ?? ""
  if (!url && process.env.VERCEL_URL) {
    url = `https://${process.env.VERCEL_URL}`
  }
  if (!url) {
    url = "http://localhost:3000"
  }
  if (!url.startsWith("http")) {
    url = `https://${url}`
  }
  return url.endsWith("/") ? url.slice(0, -1) : url
}
