import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Bookings — Rajseba Kolkata",
  description: "View and manage all your home service bookings on Rajseba Kolkata. Track status, view details, and manage upcoming or past service appointments in West Bengal, India.",
  keywords: ["my bookings rajseba", "track service booking Kolkata", "manage home service West Bengal", "booking history India"],
  alternates: { canonical: "https://rajseba.in/bookings" },
  openGraph: {
    title: "My Bookings — Rajseba Kolkata",
    description: "View and manage all your home service bookings on Rajseba Kolkata, India.",
    url: "https://rajseba.in/bookings",
    type: "website",
  },
  robots: { index: false, follow: false },
};

export default function BookingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
