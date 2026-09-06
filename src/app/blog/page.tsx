import { Metadata } from "next";
import BlogClientPage from "./BlogClientPage";

export const metadata: Metadata = {
  title: "Blog — Home Care Tips & Guides | Rajseba Kolkata",
  description: "Read expert home care tips, maintenance guides, AC repair advice, and the latest insights from Rajseba — Kolkata's most trusted home services platform in West Bengal, India.",
  keywords: ["rajseba blog Kolkata", "home care tips Kolkata India", "AC repair guide Kolkata", "cleaning tips West Bengal", "home maintenance Kolkata", "plumbing tips India"],
  alternates: { canonical: "https://rajseba.com/blog" },
  openGraph: {
    title: "Blog — Home Care Tips & Guides | Rajseba Kolkata",
    description: "Expert home care tips, maintenance guides, and trusted insights from Rajseba Kolkata, India.",
    url: "https://rajseba.com/blog",
    siteName: "Rajseba Kolkata",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Rajseba Kolkata Blog" }],
  },
  twitter: { card: "summary_large_image", title: "Blog — Home Care Tips & Guides | Rajseba Kolkata", description: "Home care tips & guides from Kolkata's top home services platform.", images: ["/og-image.jpg"] },
};

export default function Page() {
  return <BlogClientPage />;
}
