import { Metadata } from "next";
import HelpClientPage from "./HelpClientPage";

export const metadata: Metadata = {
  title: "Help Center — Rajseba Kolkata, India",
  description: "Find answers to your questions, learn how to manage bookings, understand warranties, and contact Rajseba customer support in Kolkata, West Bengal, India.",
  keywords: ["rajseba help center Kolkata", "customer support Kolkata India", "home services FAQ Kolkata", "AC repair warranty Kolkata", "booking help", "refund policy rajseba"],
  alternates: { canonical: "https://rajseba.com/help" },
  openGraph: {
    title: "Help Center — Rajseba Kolkata, India",
    description: "Find answers and contact Rajseba Kolkata support for all your home service queries in West Bengal, India.",
    url: "https://rajseba.com/help",
    siteName: "Rajseba Kolkata",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Rajseba Kolkata Help Center" }],
  },
  twitter: { card: "summary_large_image", title: "Help Center — Rajseba Kolkata", description: "Rajseba Help Center Kolkata — FAQs, booking help, warranty & refund info.", images: ["/og-image.jpg"] },
};

export default function Page() {
  return <HelpClientPage />;
}
