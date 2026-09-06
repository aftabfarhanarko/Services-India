import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up — Rajseba Kolkata, India",
  description: "Create your free Rajseba account and start booking verified home service experts in Kolkata, West Bengal, India. Fast sign-up with OTP verification.",
  keywords: ["rajseba signup Kolkata", "create account rajseba Kolkata", "register home services Kolkata", "new user India"],
  alternates: { canonical: "https://rajseba.com/signup" },
  openGraph: {
    title: "Sign Up — Rajseba Kolkata, India",
    description: "Create your free Rajseba account and book verified home service experts in Kolkata, India.",
    url: "https://rajseba.com/signup",
    type: "website",
  },
  robots: { index: false, follow: false },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
