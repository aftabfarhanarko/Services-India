import { Metadata } from "next";
import AboutClientPage from "./AboutClientPage";

export const metadata: Metadata = {
  title: "About Us — Rajseba (Kaikhali, Kolkata, West Bengal 700052)",
  description: "Learn about Rajseba, Kolkata's premier household service platform located at Ground floor, Seven Sky Apartment, Bimannagar, Kaikhali, Kolkata 700052. Connecting Kolkata & West Bengal with top verified experts.",
  keywords: ["about rajseba", "rajseba Kaikhali address", "Ground floor Seven Sky Apartment Bimannagar Kaikhali Kolkata 700052", "home services company Kolkata", "verified experts Kolkata", "home care services West Bengal", "rajseba story Kolkata India"],
  alternates: { canonical: "https://rajseba.in/about" },
  openGraph: {
    title: "About Us — Rajseba Kolkata (Bimannagar, Kaikhali 700052)",
    description: "Kolkata's most reliable ecosystem for on-demand home services headquartered in Kaikhali, Kolkata 700052.",
    url: "https://rajseba.in/about",
    siteName: "Rajseba Kolkata",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Rajseba Kolkata" }],
  },
  twitter: { card: "summary_large_image", title: "About Us — Rajseba Kolkata 700052", description: "Learn about Rajseba — Kolkata's trusted home services platform in Kaikhali.", images: ["/og-image.jpg"] },
};

export default function Page() {
  return <AboutClientPage />;
}