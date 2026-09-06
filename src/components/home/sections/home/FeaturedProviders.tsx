"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, BadgeCheck, MapPin, ThumbsUp, Briefcase, Users } from "lucide-react";
import { useGetPublicProfilesQuery } from "@/redux/features/landing/landingApi";
import { formatImageUrl } from "@/lib/utils";

const DEFAULT_AVATARS = [
  "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=200&h=200&q=80",
  "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=200&h=200&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
];

function ProviderAvatar({ src, fallback, name }: { src?: string | null; fallback: string; name: string }) {
  const [imgSrc, setImgSrc] = React.useState<string>(src || fallback);

  React.useEffect(() => {
    setImgSrc(src || fallback);
  }, [src, fallback]);

  return (
    <img
      src={imgSrc}
      alt={name}
      onError={() => setImgSrc(fallback)}
      className="w-16 h-16 rounded-2xl object-cover bg-white p-0.5 border-2 border-[#FF6014]/20 shadow-md ring-4 ring-white"
    />
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.15,
      staggerChildren: 0.08,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
} as const;


function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
      <div className="h-20 bg-slate-100 relative">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-14 h-14 rounded-full bg-slate-200 border-4 border-white" />
      </div>
      <div className="pt-10 p-5 flex flex-col gap-3">
        <div className="h-4 w-28 bg-slate-100 rounded-full mx-auto" />
        <div className="h-3 w-20 bg-slate-100 rounded-full mx-auto" />
        <div className="h-10 bg-slate-100 rounded-xl" />
        <div className="flex gap-2 justify-center">
          <div className="h-5 w-16 bg-slate-100 rounded-full" />
          <div className="h-5 w-20 bg-slate-100 rounded-full" />
        </div>
        <div className="h-9 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}

export default function FeaturedProviders() {
  const { data: profilesRes, isLoading } = useGetPublicProfilesQuery();

  const rawProfiles: any[] = profilesRes?.data ?? (Array.isArray(profilesRes) ? profilesRes : []);
  const activeProviders = rawProfiles.filter(
    (p: any) => {
      if (!p.categories || p.categories.length === 0) return false;
      const phoneClean = String(p.user?.phone || p.phone || "").replace(/[^0-9]/g, "");
      if (phoneClean.includes("1711715575")) return false;
      return true;
    }
  );

  const providers = activeProviders.slice(0, 4).map((p: any, idx: number) => {
    const user = p.user ?? {};

    const hidePhoneNumber = (text: string) => {
      if (!text) return text;
      const digitsOnly = text.replace(/[^0-9]/g, "");
      if (digitsOnly.length >= 10 && digitsOnly.length <= 15) {
        return "Service Provider";
      }
      return text.replace(/(01[3-9]\d{8})/g, (match) => {
        return `${match.slice(0, 5)}***${match.slice(-3)}`;
      });
    };

    const services: string[] = Array.isArray(p.categories) && p.categories.length > 0
      ? p.categories.map((c: any) => c.name ?? c).slice(0, 3)
      : [];

    if (p.min_starting_price && !isNaN(Number(p.min_starting_price))) {
      services.push(`From ₹${Number(p.min_starting_price).toLocaleString()}`);
    }

    const rawLoc =
      p.area?.name ?? p.district?.name ?? p.devision?.name ?? p.location ?? "Kolkata, India";
    const location = String(rawLoc)
      .split(/[,\s]+/)
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(", ");

    const rating = p.rating != null && !isNaN(Number(p.rating))
      ? Number(p.rating).toFixed(1)
      : "0.0";

    const reviews = p.total_reviews ?? 0;
    const jobs = p.total_projects != null && Number(p.total_projects) > 0
      ? `${p.total_projects}+`
      : "0+";

    const specialty =
      p.company_name ||
      (p.description ? p.description.slice(0, 45) : null) ||
      "Service Provider";

    const badge = {
      label: p.type === "company" ? "Company" : "Individual",
      cls: p.type === "company" ? "bg-violet-600 text-white" : "bg-slate-700 text-white",
    };

    const rawAvatar = p.picture || user.profileImage || user.avatar || p.profile?.picture;
    const avatarUrl = rawAvatar ? formatImageUrl(rawAvatar) : null;
    const fallbackAvatar = DEFAULT_AVATARS[idx % DEFAULT_AVATARS.length];

    return {
      id: p.id ?? idx,
      name: hidePhoneNumber(user.name || p.company_name || "Provider"),
      specialty: hidePhoneNumber(specialty),
      location,
      rating,
      reviews,
      jobs,
      avatar: avatarUrl,
      fallbackAvatar,
      services: services.map(s => hidePhoneNumber(s)),
      badge,
    };
  });

  return (
    <section className="py-5 md:py-8 lg:py-10 overflow-hidden">
      <div className="w-full md:max-w-[92%] lg:max-w-[960px] xl:max-w-[1140px] min-[1440px]:max-w-[1280px] 2xl:max-w-[1400px] mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-[#FF6014]/10 border border-[#FF6014]/20 text-[#FF6014] px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
            Verified Professionals
          </div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-slate-900 tracking-tight flex items-center justify-center gap-2">
            <ThumbsUp className="w-5 h-5 md:w-6 md:h-6 text-[#FF6014]" />
            Our Top <span className="text-[#FF6014]">Providers</span>
          </h2>
          <p className="mt-3 text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Background-checked, highly rated professionals trusted by thousands of happy customers.
          </p>
        </div>

        {/* Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : providers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 text-sm font-medium">No agents available right now.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {providers.map((provider) => (
              <motion.div
                key={provider.id}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                className="group relative rounded-3xl border border-white/80 bg-white/70 backdrop-blur-xl shadow-lg shadow-orange-950/[0.03] hover:shadow-2xl hover:shadow-[#FF6014]/10 hover:border-[#FF6014]/40 hover:bg-white/90 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer backdrop-saturate-150"
              >
                {/* Top Banner Band */}
                <div className="relative h-20 bg-gradient-to-br from-[#FFF5EE]/60 via-[#FFF9F5]/40 to-[#FFEFE6]/60 backdrop-blur-md flex-shrink-0">
                  {/* Badge */}
                  <span className={`absolute top-3 right-3 text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full shadow-2xs ${provider.badge.cls}`}>
                    {provider.badge.label}
                  </span>

                  {/* Avatar */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                    <div className="relative">
                      <ProviderAvatar
                        src={provider.avatar}
                        fallback={provider.fallbackAvatar}
                        name={provider.name}
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="pt-10 px-5 pb-5 flex flex-col flex-1 justify-between gap-3">
                  {/* Name + Specialty */}
                  <div className="text-center space-y-1">
                    <h3 className="font-extrabold text-base text-slate-900 tracking-tight group-hover:text-[#FF6014] transition-colors leading-tight">
                      {provider.name}
                    </h3>
                    <div className="inline-block bg-[#FFF4EE]/90 text-[#FF6014] text-[11px] font-extrabold px-3 py-0.5 rounded-full border border-[#FF6014]/20 line-clamp-1 max-w-full backdrop-blur-xs">
                      {provider.specialty}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400">
                    <MapPin size={13} className="text-[#FF6014]" />
                    <span>{provider.location}</span>
                  </div>

                  {/* Stats split card */}
                  <div className="grid grid-cols-2 gap-2 bg-white/80 backdrop-blur-md border border-slate-100/80 p-2.5 rounded-2xl text-center shadow-2xs">
                    <div className="flex flex-col items-center justify-center border-r border-slate-200/60 pr-1">
                      <div className="flex items-center gap-1 text-xs font-black text-slate-800">
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        <span>{provider.rating}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 mt-0.5">
                        {provider.reviews} reviews
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center pl-1">
                      <div className="flex items-center gap-1 text-xs font-black text-slate-800">
                        <Briefcase size={12} className="text-[#FF6014]" />
                        <span>{provider.jobs}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 mt-0.5">
                        Jobs done
                      </span>
                    </div>
                  </div>

                  {/* Services Tags */}
                  {provider.services.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 justify-center min-h-[26px]">
                      {provider.services.map((tag: string) => (
                        <span
                          key={tag}
                          className="text-[10px] font-extrabold px-2.5 py-1 rounded-xl bg-white/70 backdrop-blur-xs border border-slate-200/50 text-slate-600 group-hover:bg-[#FFF4EE] group-hover:text-[#FF6014] group-hover:border-[#FF6014]/30 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>
    </section>
  );
}