import type { Metadata } from "next";
import HomeShiftingClientPage from "./HomeShiftingClientPage";

export const metadata: Metadata = {
  title: "Packers & Movers Kolkata — Home Shifting Service | Rajseba",
  description: "Professional packers and movers in Kolkata, West Bengal, India. Get a custom quote for packing, house moving, and home relocation with Rajseba's trusted Kolkata team.",
  keywords: [
    "home shifting Kolkata", "packers and movers Kolkata", "relocation service West Bengal",
    "house moving service Kolkata", "professional movers Kolkata India", "rajseba shifting Kolkata",
    "furniture moving Kolkata", "packing and moving Kolkata",
  ],
  alternates: { canonical: "https://rajseba.com/home-shifting" },
  openGraph: {
    title: "Packers & Movers Kolkata — Home Shifting Service | Rajseba",
    description: "Professional home shifting and relocation service with trusted packers & movers in Kolkata, West Bengal, India.",
    url: "https://rajseba.com/home-shifting",
    siteName: "Rajseba Kolkata",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Rajseba Packers & Movers Kolkata" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Packers & Movers Kolkata — Rajseba Home Shifting",
    description: "Professional home shifting with trusted packers & movers across Kolkata, West Bengal.",
    images: ["/og-image.jpg"],
  },
};

export default function HomeShiftingPage() {
  return <HomeShiftingClientPage />;
}