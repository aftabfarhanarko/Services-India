import type { Metadata } from "next";
import MapClientPage from "./MapClientPage";

export const metadata: Metadata = {
  title: "Find Service Experts Near You in Kolkata — Rajseba Map",
  description: "Explore the interactive map to find verified home service professionals near your location in Kolkata, West Bengal, India. View ratings, availability, and book instantly.",
  keywords: [
    "home service map Kolkata", "find experts near me Kolkata", "service professionals location West Bengal",
    "AC repair near me Kolkata", "cleaning service near me Kolkata", "Rajseba Kolkata map",
    "home service providers Kolkata", "nearby home experts West Bengal India",
  ],
  alternates: { canonical: "https://rajseba.in/map" },
  openGraph: {
    title: "Find Service Experts Near You in Kolkata — Rajseba Map",
    description: "Explore verified home service professionals near your location in Kolkata, West Bengal, India.",
    url: "https://rajseba.in/map",
    siteName: "Rajseba Kolkata",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Rajseba Kolkata Experts Map" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Service Experts Near You in Kolkata — Rajseba Map",
    description: "Find verified home service professionals near you in Kolkata, West Bengal, India.",
    images: ["/og-image.jpg"],
  },
};

export default function MapPage() {
  return <MapClientPage />;
}
