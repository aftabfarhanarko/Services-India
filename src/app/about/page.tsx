import { Metadata } from "next";
import AboutClientPage from "./AboutClientPage";

export const metadata: Metadata = {
  title: "About Us — Rajseba Kolkata, India",
  description: "Learn about Rajseba, Kolkata's most reliable ecosystem for on-demand home services. Connecting homes in Kolkata & West Bengal with verified professionals.",
  keywords: ["about rajseba", "home services company Kolkata", "verified experts Kolkata", "home care services West Bengal", "rajseba story Kolkata India"],
  alternates: { canonical: "https://rajseba.com/about" },
  openGraph: {
    title: "About Us — Rajseba Kolkata, India",
    description: "Kolkata's most reliable ecosystem for on-demand home services.",
    url: "https://rajseba.com/about",
    siteName: "Rajseba Kolkata",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Rajseba Kolkata" }],
  },
  twitter: { card: "summary_large_image", title: "About Us — Rajseba Kolkata", description: "Learn about Rajseba — Kolkata's trusted home services platform.", images: ["/og-image.jpg"] },
};

export default function Page() {
  return <AboutClientPage />;
}