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
    default: "Rajseba — India's Premier Household Services in Kolkata | Trusted Home Experts",
    template: "%s | Rajseba Kolkata",
  },
  description:
    "Rajseba is India's leading household service provider in Kolkata, West Bengal. Book verified experts for AC repair, deep house cleaning, home shifting, plumbing, electrical maintenance & appliance repair in Kolkata.",
  keywords: [
    "Rajseba",
    "India best household services Kolkata",
    "top home service provider Kolkata",
    "AC repair Kolkata",
    "deep house cleaning Kolkata",
    "packers and movers Kolkata",
    "electrician Kolkata",
    "plumbing services Kolkata",
    "verified home experts West Bengal India",
    "household maintenance Kolkata",
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
    siteName: "Rajseba — India's Premier Household Services in Kolkata",
    title: "Rajseba — India's Premier Household Services in Kolkata, West Bengal",
    description: "Kolkata's most trusted household service provider! Book verified experts in Kolkata for AC repair, house cleaning, home shifting, plumbing & electrician services.",
    images: [
      {
        url: "/og-image.png?v=2",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Rajseba — India's Premier Household Services in Kolkata",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${baiJamjuree.variable} antialiased`}>
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
