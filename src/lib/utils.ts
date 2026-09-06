import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const DEFAULT_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.rajseba.in";
const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || "http://ys5u1ge5eguiimbv9s2bkxrg.200.141.14.181.sslip.io";

/**
 * Formats image URLs for display across the application.
 * Fixes HTTP mixed content issues for HTTPS production site.
 */
export function formatImageUrl(url?: string): string {
  if (!url) return "";

  let formatted = url.trim();

  // Force HTTPS on CDN links to prevent Mixed Content blocking in Production
  if (formatted.startsWith("http://ys5u1ge5eguiimbv9s2bkxrg") || formatted.includes(".sslip.io")) {
    formatted = formatted.replace(/^http:\/\//i, "https://");
  }

  // If it's a full CDN or absolute URL, return formatted
  if (formatted.startsWith("https://") || formatted.startsWith("http://")) {
    return formatted;
  }

  // If it's a relative backend path like /uploads/... rewrite to absolute API URL
  if (formatted.startsWith("/uploads/") || formatted.startsWith("/static/")) {
    return `${DEFAULT_API_URL}${formatted}`;
  }

  return formatted;
}


