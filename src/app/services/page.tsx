import CustomQuote from '@/components/home/services/CustomQuote';
import ServiceHero from '@/components/home/services/ServiceHero';
import ServiceLists from '@/components/home/services/ServiceLists';
import TrendingServices from '@/components/home/services/TrendingServices';
import CategorizedSections from '@/components/home/services/CategorizedSections';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: "Professional Home Services in Kolkata, West Bengal — Rajseba",
  description: "Browse and book from our comprehensive list of verified home services including AC repair, house cleaning, plumbing, electrical, and painting in Kolkata, West Bengal, India.",
  keywords: ["home services Kolkata", "AC service Kolkata", "house cleaning services Kolkata", "plumbing service Kolkata", "electrician in Kolkata", "Kolkata home care", "Rajseba Kolkata"],
  alternates: { canonical: "https://rajseba.com/services" },
  openGraph: {
    title: "Professional Home Services in Kolkata, West Bengal — Rajseba",
    description: "Browse and book from our comprehensive list of verified home services in Kolkata, West Bengal, India.",
    url: "https://rajseba.com/services",
    siteName: "Rajseba Kolkata",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Rajseba Services Kolkata" }],
  },
  twitter: { card: "summary_large_image", title: "Professional Home Services in Kolkata — Rajseba", description: "Browse verified home services in Kolkata, West Bengal, India.", images: ["/og-image.jpg"] },
};

const Services = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 relative overflow-x-hidden">
      <ServiceHero />
      <div
        className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0"
        style={{ backgroundSize: "auto" }}
      />
      <div className="relative space-y-4 md:space-y-6 lg:space-y-8">
        <TrendingServices />
        <Suspense fallback={
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6014]" />
          </div>
        }>
          <ServiceLists />
        </Suspense>
        <CategorizedSections />
        <CustomQuote />
      </div>
    </div>
  );
};

export default Services;