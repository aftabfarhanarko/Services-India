import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Booking — Rajseba Kolkata",
  description: "Track the real-time status of your home service booking on Rajseba Kolkata, West Bengal, India. Know when your expert is on the way.",
  keywords: ["track booking rajseba", "booking status Kolkata", "service tracking West Bengal India", "live booking update Kolkata"],
  alternates: { canonical: "https://rajseba.com/track" },
  openGraph: {
    title: "Track Your Booking — Rajseba Kolkata",
    description: "Track the real-time status of your home service booking on Rajseba Kolkata, West Bengal, India.",
    url: "https://rajseba.com/track",
    type: "website",
  },
  robots: { index: false, follow: false },
};

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
