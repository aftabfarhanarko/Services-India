import type { Metadata } from "next";
import { Bai_Jamjuree } from "next/font/google";
import { StoreProvider } from "@/redux/StoreProvider";
import "./globals.css";
import { LayoutWrapper } from "@/components/home/LayoutWrapper";
import ToasterProvider from "@/components/ToasterProvider";

const baiJamjuree = Bai_Jamjuree({
  subsets: ["latin", "latin-ext", "thai"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bai-jamjuree",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rajseba.in"),
  title: {
    default: "Rajseba — Trusted Home Services in Kolkata (North Kolkata, New Town & Rajarhat)",
    template: "%s | Rajseba Kolkata",
  },
  description:
    "Kolkata's trusted household service platform. Serving North Kolkata, New Town, Rajarhat & across Kolkata. Book verified experts for AC repair, deep house cleaning, home shifting, plumbing & electrician services.",
  keywords: [
    "Rajseba Kolkata",
    "home services North Kolkata",
    "home services New Town",
    "home services Rajarhat",
    "AC repair North Kolkata",
    "deep house cleaning New Town",
    "packers and movers Rajarhat",
    "electrician Kolkata",
    "plumbing services Kolkata",
    "Kaikhali household services Kolkata",
    "verified home experts Kolkata West Bengal",
  ],
  authors: [{ name: "Rajseba", url: "https://rajseba.in" }],
  creator: "Rajseba India",
  publisher: "Rajseba",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://rajseba.in",
    siteName: "Rajseba — Trusted Home Services in Kolkata",
    title: "Rajseba — Trusted Home Services in Kolkata (North Kolkata, New Town & Rajarhat)",
    description: "Kolkata's trusted household service platform serving North Kolkata, New Town, Rajarhat & across Kolkata. Book verified experts for AC repair, cleaning, shifting & electrical services.",
    images: [
      {
        url: "/og-image.png?v=2",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Rajseba — Trusted Home Services in Kolkata (North Kolkata, New Town & Rajarhat)",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rajseba — India's Premier Household Services in Kolkata",
    description: "Kolkata's #1 Household Service Provider in India. Book verified experts for AC repair, cleaning, shifting & maintenance.",
    site: "@rajseba",
    creator: "@rajseba",
    images: ["/og-image.png?v=2"],
  },
  icons: {
    icon: [
      { url: "/icon.svg?v=2", type: "image/svg+xml" },
      { url: "/favicon.ico?v=2", sizes: "any" },
      { url: "/icon.png?v=2", type: "image/png" },
    ],
    shortcut: "/icon.svg?v=2",
    apple: "/apple-touch-icon.png?v=2",
  },
  category: "Home Services",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "name": "Rajseba",
  "image": "https://rajseba.in/og-image.png",
  "@id": "https://rajseba.in/#organization",
  "url": "https://rajseba.in",
  "telephone": "+916290257347",
  "priceRange": "₹₹",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Ground floor, Seven Sky Apartment, Bimannagar, Kaikhali",
    "addressLocality": "Kolkata",
    "addressRegion": "West Bengal",
    "postalCode": "700052",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 22.6318,
    "longitude": 88.4357
  },
  "areaServed": [
    { "@type": "AdministrativeArea", "name": "North Kolkata" },
    { "@type": "AdministrativeArea", "name": "New Town" },
    { "@type": "AdministrativeArea", "name": "Rajarhat" },
    { "@type": "City", "name": "Kolkata" }
  ],
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "opens": "08:00",
    "closes": "22:00"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${baiJamjuree.variable} antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`min-h-screen flex flex-col bg-white text-slate-900 ${baiJamjuree.className} antialiased`}>
        <StoreProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </StoreProvider>
        <ToasterProvider />
      </body>
    </html>
  );
}
