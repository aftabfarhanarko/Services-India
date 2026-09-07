import type { Metadata } from "next";
import OpportunityClientPage from "./OpportunityClientPage";

export const metadata: Metadata = {
  title: "Partner & Vendor Opportunities — Rajseba Kolkata, India",
  description: "Join Rajseba in Kolkata as a vendor or agent. Grow your income by offering professional home services to verified customers across Kolkata and West Bengal, India. Apply today.",
  keywords: [
    "rajseba career Kolkata", "work with rajseba India", "vendor opportunity Kolkata",
    "home service agent West Bengal", "rajseba jobs Kolkata", "freelance home services Kolkata",
    "become a vendor Kolkata", "service provider opportunity India",
  ],
  alternates: { canonical: "https://rajseba.in/opportunity" },
  openGraph: {
    title: "Partner & Vendor Opportunities — Rajseba Kolkata, India",
    description: "Join Rajseba as a vendor or agent and grow your home service business in Kolkata, India.",
    url: "https://rajseba.in/opportunity",
    siteName: "Rajseba Kolkata",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Join Rajseba Kolkata as Vendor or Agent" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Partner & Vendor Opportunities — Rajseba Kolkata",
    description: "Join Rajseba as a vendor or agent. Grow your business in Kolkata, India.",
    images: ["/og-image.jpg"],
  },
};

export default function OpportunityPage() {
  return <OpportunityClientPage />;
}
