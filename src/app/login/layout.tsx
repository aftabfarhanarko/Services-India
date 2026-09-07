import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login — Rajseba Kolkata",
  description: "Sign in to your Rajseba account to manage home service bookings in Kolkata, West Bengal, India. Secure OTP-based authentication.",
  keywords: ["rajseba login Kolkata", "sign in rajseba India", "home service account login Kolkata", "OTP login Kolkata"],
  alternates: { canonical: "https://rajseba.in/login" },
  openGraph: {
    title: "Login — Rajseba Kolkata",
    description: "Sign in to your Rajseba account securely with OTP authentication in Kolkata, India.",
    url: "https://rajseba.in/login",
    type: "website",
  },
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
