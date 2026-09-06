import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const DEFAULT_API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://api.rajseba.in").replace(/\/+$/, "");
const DEFAULT_CDN_URL = (process.env.NEXT_PUBLIC_CDN_URL || "http://ys5u1ge5eguiimbv9s2bkxrg.200.141.14.181.sslip.io").replace(/\/+$/, "");

/**
 * Formats image URLs for display across the application.
 * Preserves SquadLog CDN high-performance links while converting legacy backend upload links to HTTPS.
 */
export function formatImageUrl(url?: string): string {
  if (!url) return "";

  let formatted = url.trim();

  // 1. Preserve SquadLog CDN High-Performance URLs
  if (formatted.includes("ys5u1ge5eguiimbv9s2bkxrg") || formatted.startsWith(DEFAULT_CDN_URL)) {
    if (typeof window !== "undefined" && window.location.protocol === "https:" && formatted.startsWith("http://")) {
      return formatted.replace(/^http:\/\//i, "https://");
    }
    return formatted;
  }

  // 2. If the URL contains /uploads/ from backend, map to live production API URL
  if (formatted.includes("/uploads/")) {
    const uploadPath = formatted.substring(formatted.indexOf("/uploads/"));
    return `${DEFAULT_API_URL}${uploadPath}`;
  }

  // 3. If it's a relative path like /static/..., append backend API domain
  if (formatted.startsWith("/")) {
    return `${DEFAULT_API_URL}${formatted}`;
  }

  // 4. Force HTTPS on any external http:// image links to prevent Mixed Content blocking
  if (formatted.startsWith("http://")) {
    if (typeof window !== "undefined" && window.location.hostname === "localhost") {
      return formatted;
    }
    return formatted.replace(/^http:\/\//i, "https://");
  }

  return formatted;
}

/**
 * Formats and cleans address string to remove repeated duplicate parts (e.g. duplicate pincodes, city names).
 */
export function cleanAddress(address?: string): string {
  if (!address) return "";

  // Split by comma and trim each segment
  const parts = address
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  const seen = new Set<string>();
  const uniqueParts: string[] = [];

  for (const part of parts) {
    const lower = part.toLowerCase();
    // Prevent duplicated terms like 'Kolkata', '700052', 'West Bengal', 'India' repeating
    if (!seen.has(lower)) {
      seen.add(lower);
      uniqueParts.push(part);
    }
  }

  return uniqueParts.join(", ");
}



