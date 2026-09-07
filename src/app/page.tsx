import ExploreCategories from "@/components/home/sections/home/ExploreCategories";
import Hero from "@/components/home/sections/home/Hero";
import HowItWorks from "@/components/home/sections/home/HowItWorks";
import Testimonials from "@/components/home/sections/home/Testimonials";
import TopServices from "@/components/home/sections/home/TopServices";
import WhyChooseUs from "@/components/home/sections/home/WhyChooseUs";
import Stats from "@/components/home/sections/home/Stats";
import SpecialOffers from "@/components/home/sections/home/SpecialOffers";
import FeaturedProviders from "@/components/home/sections/home/FeaturedProviders";
import ServiceAreas from "@/components/home/sections/home/ServiceAreas";
import SafetyGuarantee from "@/components/home/sections/home/SafetyGuarantee";
import ComparisonSection from "@/components/home/sections/home/ComparisonSection";
import HowItLooks from "@/components/home/sections/home/HowItLooks";
import FAQ from "@/components/home/sections/home/FAQ";
import HomeMotionWrapper from "@/components/home/HomeMotionWrapper";
import ScrollToTop from "@/components/home/ScrollToTop";
import type { Metadata } from "next";

const SITE_URL = "https://rajseba.in";
const SITE_NAME = "Rajseba";
const SITE_TAGLINE = "Expert Care for Your Premium Home";
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

// Fetch live categories from the backend at build/request time
async function getCategories(): Promise<string[]> {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://api.rajseba.in";
    const res = await fetch(`${apiBase}/category`, {
      next: { revalidate: 3600 }, // ISR — re-fetch every 1 hour
    });
    if (!res.ok) return [];
    const data = await res.json();
    const list: any[] = data?.data || (Array.isArray(data) ? data : []);
    return list
      .map((c: any) => c?.name || c?.title || "")
      .filter(Boolean)
      .slice(0, 12); // top 12 categories for keywords
  } catch {
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const categories = await getCategories();

  // Build rich keyword list: brand + category names + location terms
  const categoryKeywords = categories.map((c) => `${c} Kolkata`);
  const baseKeywords = [
    "home services Kolkata",
    "home services West Bengal",
    "home services India",
    "AC repair Kolkata",
    "house cleaning Kolkata",
    "plumbing service Kolkata",
    "electrician in Kolkata",
    "packers and movers Kolkata",
    "appliance repair Kolkata",
    "professional home care Kolkata",
    "verified home experts Kolkata",
    "book home services online Kolkata",
    "Rajseba Kolkata",
    "Rajseba India",
  ];
  const allKeywords = [
    ...categories,
    ...categoryKeywords,
    ...baseKeywords,
  ];

  // Build dynamic description with category names
  const categoryList =
    categories.length > 0
      ? categories.slice(0, 5).join(", ")
      : "AC repair, cleaning, plumbing, electrical";

  const description = `Book trusted home services in Kolkata (North Kolkata, New Town, Rajarhat, Salt Lake & South Kolkata) — ${categoryList}, and more. Verified experts, instant booking, guaranteed quality.`;

  const title = `${SITE_NAME} — Kolkata's Trusted On-Demand Household Services`;

  return {
    title,
    description,
    keywords: allKeywords,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: SITE_URL,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: `${SITE_NAME} Kolkata`,
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — Professional Home Services in Kolkata, West Bengal, India`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@rajseba",
      creator: "@rajseba",
      images: [OG_IMAGE],
    },
    verification: {
      google: "", // add Google Search Console verification code here
    },
    category: "Home Services",
    other: {
      "application-name": SITE_NAME,
    },
  };
}


export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <div className="relative overflow-hidden">
        {/* Soft premium radial glows for depth and premium aesthetic */}
        <div className="absolute top-[10%] left-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-[#FF6014]/4 blur-[130px] rounded-full pointer-events-none z-0" />
        <div className="absolute top-[40%] right-[-10%] w-[500px] md:w-[700px] h-[500px] md:h-[700px] bg-cyan-500/3 blur-[150px] rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-[10%] left-[-5%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-emerald-500/3 blur-[130px] rounded-full pointer-events-none z-0" />

        {/* Content sections rendered above the background */}
        <div
          className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0"
          style={{ backgroundSize: 'auto' }}
        />
        <div className="relative z-10 flex flex-col gap-5">
          <Hero />
          <HomeMotionWrapper>
            <ExploreCategories />
          </HomeMotionWrapper>

          <HomeMotionWrapper>
            <TopServices />
          </HomeMotionWrapper>

          {/* ✨ Special Deals — shown right after browsing services to drive booking */}
          <HomeMotionWrapper>
            <SpecialOffers />
          </HomeMotionWrapper>

          {/* 🛡️ Safety & Quality Guarantee Section */}
          <HomeMotionWrapper>
            <SafetyGuarantee />
          </HomeMotionWrapper>

          {/* 👷 Top Professionals — builds trust before WhyChooseUs */}
          <HomeMotionWrapper>
            <FeaturedProviders />
          </HomeMotionWrapper>

          {/* 📊 Rajseba vs Local Technicians Comparison */}
          <HomeMotionWrapper>
            <ComparisonSection />
          </HomeMotionWrapper>

          <HomeMotionWrapper>
            <WhyChooseUs />
          </HomeMotionWrapper>

          <HomeMotionWrapper>
            <Stats />
          </HomeMotionWrapper>

          {/* 🎬 Real Work Showcase */}
          <HomeMotionWrapper>
            <HowItLooks />
          </HomeMotionWrapper>

          {/* 🗺️ Coverage Map — shown after stats to answer "is this available near me?" */}
          <HomeMotionWrapper>
            <ServiceAreas />
          </HomeMotionWrapper>

          <HomeMotionWrapper>
            <HowItWorks />
          </HomeMotionWrapper>

          <HomeMotionWrapper>
            <FAQ />
          </HomeMotionWrapper>

          {/* <HomeMotionWrapper>
            <Testimonials />
          </HomeMotionWrapper> */}
        </div>
      </div>
      {/* <ScrollToTop /> */}
    </div>
  );
}
