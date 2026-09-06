import { Metadata } from "next";
import ContactClientPage from "./ContactClientPage";

export const metadata: Metadata = {
  title: "Contact Us — Rajseba Office Kaikhali, Kolkata (Bimannagar, 700052)",
  description: "Get in touch with Rajseba. Visit our head office at Ground floor, Seven Sky Apartment, Bimannagar, Kaikhali, Kolkata, West Bengal 700052, India. Call our 24/7 customer support or email info@rajseba.com.",
  keywords: ["contact rajseba", "rajseba Kaikhali address", "Ground floor Seven Sky Apartment Bimannagar Kaikhali Kolkata 700052", "rajseba Kolkata phone number", "rajseba email", "rajseba office Kolkata", "home service customer support Kolkata India"],
  alternates: { canonical: "https://rajseba.in/contact" },
  openGraph: {
    title: "Contact Us — Rajseba HQ Kaikhali, Kolkata, India 700052",
    description: "Visit Rajseba HQ at Ground floor, Seven Sky Apartment, Bimannagar, Kaikhali, Kolkata, West Bengal 700052. 24/7 support for booking and service queries.",
    url: "https://rajseba.in/contact",
    siteName: "Rajseba Kolkata",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Rajseba Kolkata HQ" }],
  },
  twitter: { card: "summary_large_image", title: "Contact Us — Rajseba Support Center Kolkata 700052", description: "Reach Rajseba Kolkata support 24/7 or visit Kaikhali HQ.", images: ["/og-image.jpg"] },
};

export default function Page() {
  return <ContactClientPage />;
}