import { Metadata } from "next";
import ContactClientPage from "./ContactClientPage";

export const metadata: Metadata = {
  title: "Contact Us — Rajseba Support Center Kolkata, India",
  description: "Get in touch with Rajseba in Kolkata, West Bengal, India. Reach our 24/7 customer support or email info@rajseba.com for booking help, refunds, or service enquiries.",
  keywords: ["contact rajseba", "rajseba Kolkata phone number", "rajseba email", "rajseba office Kolkata", "home service customer support Kolkata India"],
  alternates: { canonical: "https://rajseba.com/contact" },
  openGraph: {
    title: "Contact Us — Rajseba Support Center Kolkata, India",
    description: "Get in touch with Rajseba in Kolkata, India. 24/7 support for booking and service queries.",
    url: "https://rajseba.com/contact",
    siteName: "Rajseba Kolkata",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Rajseba Kolkata" }],
  },
  twitter: { card: "summary_large_image", title: "Contact Us — Rajseba Support Center Kolkata", description: "Reach Rajseba Kolkata support 24/7 for booking, refunds, and enquiries.", images: ["/og-image.jpg"] },
};

export default function Page() {
  return <ContactClientPage />;
}