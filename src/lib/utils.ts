import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const DEFAULT_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.rajseba.in";

/**
 * Rewrites any backend image URL to point to the active API server.
 * Handles:
 *  - Old onrender, sslip.io, api.rajseba.com, api.rajseba.in hosts
 *  - rajapi.jevxo.com without www
 *  - Relative paths that look like backend uploads (e.g. /uploads/...)
 */
export function formatImageUrl(url?: string): string {
  if (!url) return "";

  // Already points to the correct host — return as-is
  if (url.startsWith(DEFAULT_API_URL)) return url;

  // Replace any known old backend hosts (matches any sslip.io, onrender, api.rajseba.com, rajseba.in, or non-www rajapi.jevxo.com)
  const replaced = url.replace(
    /https?:\/\/(?:[a-z0-9.-]+\.)?(?:sslip\.io|onrender\.com|api\.rajseba\.com|rajseba\.in|rajapi\.jevxo\.com)(?::\d+)?/gi,
    DEFAULT_API_URL
  );

  // If replacement happened, return it
  if (replaced !== url) return replaced;

  // If it's a relative backend path like /uploads/... rewrite to absolute
  if (url.startsWith("/uploads/") || url.startsWith("/static/")) {
    return `${DEFAULT_API_URL}${url}`;
  }

  return url;
}
