import { Metadata } from "next";
import TermsClientPage from "./TermsClientPage";

export const metadata: Metadata = {
  title: "Terms of Service — Rajseba Kolkata, India",
  description: "Read the Terms of Service of Rajseba to understand our user agreement, booking policies, warranty terms, and liability limitations in Kolkata, West Bengal, India.",
  keywords: ["terms of service rajseba", "terms and conditions Kolkata", "user agreement India", "booking policy rajseba Kolkata", "service warranty terms West Bengal"],
  alternates: { canonical: "https://rajseba.in/terms" },
  openGraph: {
    title: "Terms of Service — Rajseba Kolkata, India",
    description: "Read our Terms of Service to understand user policies and booking agreements in Kolkata, West Bengal, India.",
    url: "https://rajseba.in/terms",
    siteName: "Rajseba Kolkata",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Rajseba Kolkata Terms" }],
  },
  twitter: { card: "summary_large_image", title: "Terms of Service — Rajseba Kolkata", description: "Rajseba Terms of Service — booking, warranty, and liability terms.", images: ["/og-image.jpg"] },
};

export default function Page() {
  return <TermsClientPage />;
}
