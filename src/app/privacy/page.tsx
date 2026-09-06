import { Metadata } from "next";
import PrivacyClientPage from "./PrivacyClientPage";

export const metadata: Metadata = {
  title: "Privacy Policy — Rajseba Kolkata, India",
  description: "Read the Privacy Policy of Rajseba to understand how we collect, use, protect, and manage your personal data on Kolkata's top home services platform in West Bengal, India.",
  keywords: ["privacy policy rajseba", "data protection Kolkata India", "rajseba user privacy", "personal data policy West Bengal"],
  alternates: { canonical: "https://rajseba.com/privacy" },
  openGraph: {
    title: "Privacy Policy — Rajseba Kolkata, India",
    description: "Read our Privacy Policy to learn how we protect your personal information in Kolkata, West Bengal, India.",
    url: "https://rajseba.com/privacy",
    siteName: "Rajseba Kolkata",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Rajseba Kolkata Privacy Policy" }],
  },
  twitter: { card: "summary_large_image", title: "Privacy Policy — Rajseba Kolkata", description: "Rajseba Privacy Policy — how we collect, use, and protect your data in India.", images: ["/og-image.jpg"] },
};

export default function Page() {
  return <PrivacyClientPage />;
}
