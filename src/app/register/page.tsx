import type { Metadata } from "next";
import RegisterClientPage from "./RegisterClientPage";

export const metadata: Metadata = {
  title: "Register as Vendor or Agent — Rajseba Kolkata, India",
  description: "Join Rajseba as a service provider or agent in Kolkata, West Bengal, India. Register to offer professional home services to thousands of customers.",
  keywords: [
    "rajseba vendor registration Kolkata", "home service provider register West Bengal",
    "agent sign up India", "join rajseba Kolkata", "become a service provider Kolkata",
    "rajseba partner registration India",
  ],
  alternates: { canonical: "https://rajseba.in/register" },
  openGraph: {
    title: "Register as Vendor or Agent — Rajseba Kolkata, India",
    description: "Join Rajseba as a service provider and reach thousands of customers across Kolkata, West Bengal, India.",
    url: "https://rajseba.in/register",
    siteName: "Rajseba Kolkata",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Register on Rajseba Kolkata" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Register as Vendor or Agent — Rajseba Kolkata",
    description: "Join Rajseba as a service provider and reach thousands of customers in Kolkata, India.",
    images: ["/og-image.jpg"],
  },
};

export default function RegisterPage() {
  return <RegisterClientPage />;
}
