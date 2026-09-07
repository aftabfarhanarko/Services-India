"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Briefcase,
  Map as MapIcon,
  Calendar,
  CalendarCheck,
  Search,
  ChevronDown,
  Home as HomeIcon,
  LayoutGrid,
  Info,
  Phone,
  LucideIcon,
  User,
  LogOut,
  Settings,
  LogIn,
  UserPlus,
  ShieldCheck,
  UserCheck,
  KeyRound,
  PhoneCall,
  MapPin,
  TrendingUp,
  Truck,
  Sparkles,
  Rocket,
  ArrowRight,
  Heart,
  Loader2,
  Users,
} from "lucide-react";
import { TbAirConditioning, TbTruck } from "react-icons/tb";
import {
  FaFaucet,
  FaBolt,
  FaCouch,
  FaPaintRoller,
  FaTint,
  FaHotTub,
  FaHouseDamage,
  FaHeadset,
} from "react-icons/fa";
import { formatImageUrl } from "@/lib/utils";
import { MdOutlineCleaningServices, MdLocalLaundryService } from "react-icons/md";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useGetPublicCategoriesQuery, useSearchPublicServicesQuery, useGetPublicCompanyBrandingQuery } from "@/redux/features/landing/landingApi";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { logout as authLogout, getRoleName } from "@/redux/features/auth/authSlice";
import { useGetSavedServicesQuery } from "@/redux/features/admin/user";

interface NavLink {
  label: string;
  href: string;
  icon: LucideIcon;
  hasDropdown?: boolean;
}

// ─── Manual icon map: exact backend category name → icon ────────────────────
// এটা ExploreCategories.tsx এর সাথে EXACT same map, যাতে homepage grid,
// desktop hover dropdown, এবং mobile accordion menu — সব জায়গায় same icon দেখায়।
// কোনো dynamic/partial (.includes()) matching নেই — শুধু exact name match।
const CATEGORY_ICON_MAP: Record<string, React.ComponentType<any>> = {
  "AC Service & Repair": TbAirConditioning,
  "AC Service & Cleaning": TbAirConditioning,
  "Home & Office Shifting": TbTruck,
  "Plumbing Service": FaFaucet,
  "Home Appliance Repair": MdLocalLaundryService,
  "Home & Office Cleaning": MdOutlineCleaningServices,
  "Home & Office Deep Cleaning": MdOutlineCleaningServices,
  "Water Purifier Installation": FaTint,
  "Home & Office Painting": FaPaintRoller,
  "Geyser Installation & Repair": FaHotTub,
  "Electrical Service": FaBolt,
  "Home & Office Renovation": FaHouseDamage,
  "PPM Service": FaHeadset,
  "PPM Service (Planned Preventive Maintenance)": FaHeadset,
  "Planned Preventive Maintenance": FaHeadset,
  "Sofa & Carpet Deep Cleaning": FaCouch,
};

const FALLBACK_ICON = LayoutGrid;

function getCategoryIcon(name: string): React.ComponentType<any> {
  return CATEGORY_ICON_MAP[(name || "").trim()] || FALLBACK_ICON;
}

const CATEGORY_SUBTITLES: Record<string, string> = {
  "AC Service & Repair": "Repair, installation & gas charge",
  "AC Service & Cleaning": "Deep cleaning & filter service",
  "Home & Office Shifting": "Hassle-free packing & moving",
  "Plumbing Service": "Leak repair & pipe installation",
  "Home Appliance Repair": "Fridge, washer & microwave repair",
  "Home & Office Cleaning": "Deep cleaning & sanitization",
  "Home & Office Deep Cleaning": "Thorough sanitization & wash",
  "Water Purifier Installation": "Filter change & assembly",
  "Home & Office Painting": "Wall painting & color consult",
  "Geyser Installation & Repair": "Water heater troubleshooting",
  "Electrical Service": "Wiring, fan & light installation",
  "Home & Office Renovation": "Interior carpentry & design",
  "PPM Service": "Preventive contract maintenance",
  "Sofa & Carpet Deep Cleaning": "Vacuuming & steam stain removal",
};

function getCategorySubtitle(name: string): string {
  return CATEGORY_SUBTITLES[(name || "").trim()] || "Professional home service";
}

// ─── Top navbar links ────────────────────────────────────────────────────
// Professional icon choices aligned with titles & premium aesthetics
const LEFT_NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Services", href: "/services", icon: LayoutGrid, hasDropdown: true },
  { label: "My Bookings", href: "/bookings", icon: CalendarCheck },
  { label: "Contact", href: "/contact", icon: PhoneCall },
  { label: "Opportunity", href: "/opportunity", icon: Rocket },
];

const RIGHT_NAV_LINKS: NavLink[] = [];

const ALL_NAV_LINKS: NavLink[] = [...LEFT_NAV_LINKS, ...RIGHT_NAV_LINKS];

const MOBILE_BOTTOM_LINKS: NavLink[] = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Services", href: "/services", icon: LayoutGrid },
  { label: "My Bookings", href: "/bookings", icon: CalendarCheck },
  { label: "Opportunity", href: "/opportunity", icon: Rocket },
  { label: "Profile", href: "/profile", icon: User },
];

const mobileDrawerVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      height: { duration: 0.28, ease: "easeOut" },
      staggerChildren: 0.04,
      delayChildren: 0.02,
    } as any,
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      height: { duration: 0.2, ease: "easeIn" },
      staggerChildren: 0.02,
      staggerDirection: -1,
    } as any,
  },
};

const mobileItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" } as any,
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: { duration: 0.15 } as any,
  },
};

export function Navbar() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, role, isLoading: authLoading } = useAppSelector((state) => state.auth);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const { data: categoriesRes } = useGetPublicCategoriesQuery();
  const apiCategories: any[] = categoriesRes?.data || (Array.isArray(categoriesRes) ? categoriesRes : []);

  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const { data: searchRes, isFetching: isSearching } = useSearchPublicServicesQuery(
    { q: searchQuery || undefined },
    { skip: !searchQuery }
  );
  const searchResults = searchRes?.data || [];
  const { data: savedRes } = useGetSavedServicesQuery(undefined, {
    skip: !isAuthenticated,
  });
  const savedCount = savedRes?.data?.length || 0;
  const [mounted, setMounted] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [showMobileAccordion, setShowMobileAccordion] = useState(false);
  const pathname = usePathname();
  const [currentHash, setCurrentHash] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);
  const desktopSearchContainerRef = useRef<HTMLDivElement>(null);
  const isHomepage = pathname === "/";

  const roleName = getRoleName(role);
  const profileImg = formatImageUrl(user?.profile?.avatar || user?.profile?.images?.[0] || user?.profile?.picture || user?.avatar);
  const profile = user ? {
    name: user.name || "User",
    email: user.email || "",
    roleName: roleName || "Client",
    avatar: (user.name || "U").substring(0, 2).toUpperCase(),
    avatarUrl: profileImg
  } : null;

  const { scrollY } = useScroll();


  const headerShadow = useTransform(
    scrollY,
    [0, 80],
    ["0 0px 0px rgba(0,0,0,0)", "0 4px 20px -2px rgba(0,0,0,0.04)"]
  );
  const borderColor = useTransform(
    scrollY,
    [0, 80],
    ["rgba(226,232,240,0.6)", "rgba(226,232,240,0.9)"]
  );

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  useEffect(() => {
    setMounted(true);
    setCurrentHash(window.location.hash);
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  useEffect(() => {
    setIsOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
    setShowSearchResults(false);
    setShowServicesDropdown(false);
    setShowMobileAccordion(false);
    setProfileDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      const clickedOutsideMobileSearch = !searchContainerRef.current || !searchContainerRef.current.contains(event.target as Node);
      const clickedOutsideDesktopSearch = !desktopSearchContainerRef.current || !desktopSearchContainerRef.current.contains(event.target as Node);
      if (clickedOutsideMobileSearch && clickedOutsideDesktopSearch) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" && (currentHash === "" || currentHash === "#");
    if (href.startsWith("#")) return pathname === "/" && currentHash === href;
    return pathname === href;
  };

  const handleSearchToggle = () => {
    setSearchOpen((v) => {
      const next = !v;
      if (!next) {
        setSearchQuery("");
        setShowSearchResults(false);
      }
      return next;
    });
    if (isOpen) setIsOpen(false);
  };

  const handleMenuToggle = () => {
    setIsOpen((v) => !v);
    if (searchOpen) setSearchOpen(false);
  };

  const bottomLinks = MOBILE_BOTTOM_LINKS.map((link) => {
    if (mounted && isAuthenticated && link.label === "Login") {
      return {
        label: "Dashboard",
        href: role === "client" ? "/dashbord/overview" : "/dashbord",
        icon: LayoutGrid,
        isDashboard: true,
      };
    }
    return link;
  });

  const { data: brandingRes, isLoading: isBrandingLoading } = useGetPublicCompanyBrandingQuery();
  const rawCompanyLogo = brandingRes?.data?.logoUrl || "/rajshiblogo.png";
  const companyLogo = formatImageUrl(rawCompanyLogo);
  const companyName = brandingRes?.data?.companyName || "Rajseba";

  return (
    <>
      <motion.nav
        style={{ boxShadow: headerShadow, borderBottomColor: borderColor }}
        className={`backdrop-blur-md border-b sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 border-slate-200"
            : "bg-white/80 md:bg-white/70 border-slate-100/80"
        }`}
      >
        <div className="w-full md:max-w-[92%] lg:max-w-[960px] xl:max-w-[1140px] min-[1440px]:max-w-[1280px] 2xl:max-w-[1400px] mx-auto px-4 md:px-6">
          {/* ─── TOP BAR ─── */}
          <div className="relative flex items-center justify-between h-16 sm:h-[68px] gap-3">
            {/* Left Section: Brand Logo + Desktop Navigation Links */}
            <div className="flex items-center gap-6 lg:gap-8 flex-shrink-0">
              {/* Brand */}
              <Link
                href="/"
                className="flex items-center hover:opacity-90 transition-opacity flex-shrink-0"
                aria-label={`${companyName} — Home`}
              >
                <div className="relative max-h-10 max-w-[180px] min-w-[70px] min-h-[36px] flex items-center justify-center">
                  {isBrandingLoading ? (
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#FF6014]">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                  ) : (
                    <img
                      src={companyLogo}
                      alt={companyName}
                      className="max-h-9 sm:max-h-10 w-auto max-w-[180px] object-contain object-left"
                    />
                  )}
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              <nav
                className="hidden md:flex items-center gap-4 lg:gap-6 flex-shrink-0"
                aria-label="Desktop navigation"
              >
                {ALL_NAV_LINKS.map((link, i) => {
                  const active = link.hasDropdown
                    ? pathname.startsWith("/categories") || pathname.startsWith("/services")
                    : isActive(link.href);
                  const Icon = link.icon;

                  if (link.hasDropdown) {
                    return (
                      <div
                        key={i}
                        className="relative py-2 group"
                        onMouseEnter={() => setShowServicesDropdown(true)}
                        onMouseLeave={() => setShowServicesDropdown(false)}
                      >
                        <Link
                          href={link.href}
                          className={`flex items-center font-semibold text-xs lg:text-sm transition-colors cursor-pointer ${active
                            ? "text-[#FF6014]"
                            : "text-slate-600 hover:text-[#FF6014]"
                            }`}
                        >
                          <Icon
                            className={`stroke-[2.2] transition-all duration-300 ease-in-out ${isScrolled ? "w-0 h-0 opacity-0 mr-0 scale-0" : "w-[15px] h-[15px] opacity-100 mr-1.5 scale-100"}`}
                          />
                          <span>{link.label}</span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 ml-1 transition-transform duration-200 ${showServicesDropdown ? "rotate-180" : ""}`}
                          />
                          {active && (
                            <motion.span
                              layoutId="navIndicator"
                              className="absolute inset-x-0 -bottom-px h-0.5 bg-[#FF6014] rounded-full"
                            />
                          )}
                        </Link>

                        <AnimatePresence>
                          {showServicesDropdown && (
                            <div className="absolute left-[-160px] xl:left-[-180px] top-full pt-[16px] z-50">
                              <motion.div
                                initial={{ opacity: 0, y: 14, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                                className="w-[860px] xl:w-[940px] bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-[0_30px_70px_-15px_rgba(15,23,42,0.18)] p-6.5 flex gap-7 overflow-hidden relative"
                              >
                                {/* Background Ambient Glow */}
                                <div className="absolute -top-24 -left-24 w-60 h-60 bg-[#FF6014]/8 rounded-full blur-3xl pointer-events-none" />
                                <div className="absolute -bottom-20 right-48 w-56 h-56 bg-orange-300/10 rounded-full blur-3xl pointer-events-none" />

                                {/* Left Panel: 3-Column Categories Grid */}
                                <div className="flex-1 min-w-0">
                                  <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25, delay: 0.05 }}
                                    className="flex items-center justify-between mb-4.5 px-1 pb-3 border-b border-slate-150"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="w-2 h-2 rounded-full bg-[#FF6014] animate-pulse" />
                                      <span className="text-xs font-black uppercase tracking-widest text-slate-800">
                                        Explore Service Categories
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="text-[10px] font-extrabold text-[#FF6014] bg-[#FFF4EE] border border-[#FF6014]/20 px-2.5 py-1 rounded-full">
                                        {apiCategories.length} Categories
                                      </span>
                                      <Link
                                        href="/services"
                                        onClick={() => setShowServicesDropdown(false)}
                                        className="text-xs font-extrabold text-slate-500 hover:text-[#FF6014] transition-colors flex items-center gap-1 group/all"
                                      >
                                        <span>View All</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover/all:translate-x-0.5 transition-transform" />
                                      </Link>
                                    </div>
                                  </motion.div>

                                  {apiCategories.length === 0 ? (
                                    <div className="grid grid-cols-3 gap-3">
                                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                                        <div key={n} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
                                      ))}
                                    </div>
                                  ) : (
                                    <motion.div
                                      initial="hidden"
                                      animate="show"
                                      variants={{
                                        hidden: { opacity: 0 },
                                        show: {
                                          opacity: 1,
                                          transition: {
                                            staggerChildren: 0.03,
                                            delayChildren: 0.08,
                                          },
                                        },
                                      }}
                                      className="grid grid-cols-3 gap-2.5 max-h-[390px] overflow-y-auto pr-1.5 custom-sidebar-scrollbar"
                                    >
                                      {apiCategories.map((cat: any) => {
                                        const CatIcon = getCategoryIcon(cat.name);
                                        const subtitle = getCategorySubtitle(cat.name);
                                        return (
                                          <motion.div
                                            key={cat.id}
                                            variants={{
                                              hidden: { opacity: 0, y: 12, scale: 0.94 },
                                              show: {
                                                opacity: 1,
                                                y: 0,
                                                scale: 1,
                                                transition: { type: "spring", stiffness: 360, damping: 24 },
                                              },
                                            }}
                                            whileHover={{ scale: 1.025, y: -2 }}
                                            whileTap={{ scale: 0.97 }}
                                          >
                                            <Link
                                              href={`/categories/${cat.id}`}
                                              className="flex items-start gap-3 p-2.5 rounded-2xl border border-slate-100/80 bg-slate-50/40 hover:border-[#FF6014]/40 hover:bg-[#FFF8F4] group/item transition-all duration-200 hover:shadow-md h-full"
                                              onClick={() => setShowServicesDropdown(false)}
                                            >
                                              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 flex items-center justify-center group-hover/item:bg-[#FF6014] group-hover/item:border-[#FF6014] transition-all duration-200 shrink-0 shadow-2xs group-hover/item:shadow-[#FF6014]/30 mt-0.5">
                                                <CatIcon className="w-5 h-5 text-slate-700 group-hover/item:text-white transition-colors duration-200" />
                                              </div>
                                              <div className="min-w-0 flex-1">
                                                <p className="font-extrabold text-[12px] text-slate-900 group-hover/item:text-[#FF6014] transition-colors leading-snug truncate">
                                                  {cat.name}
                                                </p>
                                                <p className="text-[10px] text-slate-400 group-hover/item:text-slate-600 font-medium truncate mt-0.5">
                                                  {subtitle}
                                                </p>
                                              </div>
                                            </Link>
                                          </motion.div>
                                        );
                                      })}
                                    </motion.div>
                                  )}
                                </div>
                                {/* Right Panel: Featured Interactive Promo Card (Brand Primary Theme with Staggered Elements Animation) */}
                                <motion.div
                                  initial="hidden"
                                  animate="show"
                                  variants={{
                                    hidden: { opacity: 0, x: 15, scale: 0.95 },
                                    show: {
                                      opacity: 1,
                                      x: 0,
                                      scale: 1,
                                      transition: {
                                        duration: 0.28,
                                        ease: "easeOut",
                                        staggerChildren: 0.05,
                                        delayChildren: 0.12,
                                      },
                                    },
                                  }}
                                  className="w-[250px] bg-gradient-to-br from-[#FF6014] via-[#FF7328] to-[#E0530A] text-white rounded-2.5xl p-5.5 flex flex-col justify-between relative overflow-hidden shrink-0 shadow-xl shadow-[#FF6014]/25 border border-[#FF6014]/30"
                                >
                                  <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/20 rounded-full blur-2xl pointer-events-none" />
                                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-xl pointer-events-none" />
                                  <div className="relative z-10 space-y-3">
                                    <motion.div
                                      variants={{
                                        hidden: { opacity: 0, y: 8, scale: 0.9 },
                                        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 350, damping: 22 } }
                                      }}
                                      className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-white bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full shadow-2xs"
                                    >
                                      <Sparkles className="w-3 h-3 text-white" /> Rajseba Certified
                                    </motion.div>

                                    <motion.h4
                                      variants={{
                                        hidden: { opacity: 0, y: 10 },
                                        show: { opacity: 1, y: 0, transition: { duration: 0.22 } }
                                      }}
                                      className="text-base font-black text-white leading-tight tracking-tight"
                                    >
                                      Custom Home Solutions
                                    </motion.h4>

                                    <motion.p
                                      variants={{
                                        hidden: { opacity: 0, y: 10 },
                                        show: { opacity: 1, y: 0, transition: { duration: 0.22 } }
                                      }}
                                      className="text-[11px] text-white/90 leading-relaxed font-medium"
                                    >
                                      Connect with 250+ background-verified technicians for instant home maintenance & repairs.
                                    </motion.p>

                                    <motion.div
                                      variants={{
                                        hidden: { opacity: 0, y: 10, scale: 0.95 },
                                        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } }
                                      }}
                                      className="pt-2 flex items-center gap-2 border-t border-white/20"
                                    >
                                      <div className="flex -space-x-2">
                                        {[
                                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
                                          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
                                          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                                        ].map((img, idx) => (
                                          <img key={idx} src={img} alt="expert" className="w-6 h-6 rounded-full border-2 border-[#FF6014] object-cover" />
                                        ))}
                                      </div>
                                      <span className="text-[10px] font-bold text-white/95">250+ Experts Active</span>
                                    </motion.div>
                                  </div>

                                  <div className="mt-5 space-y-2.5 relative z-10">
                                    <motion.div
                                      variants={{
                                        hidden: { opacity: 0, y: 12, scale: 0.95 },
                                        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 350, damping: 22 } }
                                      }}
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      <Link
                                        href="/services"
                                        onClick={() => setShowServicesDropdown(false)}
                                        className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#FF6014] text-xs font-black tracking-wide py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer border-none"
                                      >
                                        <span>Get Instant Quote</span>
                                        <ArrowRight className="w-4 h-4 text-[#FF6014]" />
                                      </Link>
                                    </motion.div>

                                    <motion.div
                                      variants={{
                                        hidden: { opacity: 0, y: 12, scale: 0.95 },
                                        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 350, damping: 22 } }
                                      }}
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      <a
                                        href="tel:01813333373"
                                        className="w-full flex items-center justify-center gap-2 bg-black/15 hover:bg-black/25 border border-white/20 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all text-decoration-none"
                                      >
                                        <span>Call Hotline</span>
                                        <Phone className="w-3.5 h-3.5 text-white" />
                                      </a>
                                    </motion.div>
                                  </div>
                                </motion.div>
                              </motion.div>
                            </div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={i}
                      href={link.href}
                      className={`relative flex items-center font-semibold text-xs lg:text-sm py-2 transition-colors ${active
                        ? "text-[#FF6014]"
                        : "text-slate-600 hover:text-[#FF6014]"
                        }`}
                    >
                      <Icon
                        className={`stroke-[2.2] transition-all duration-300 ease-in-out ${isScrolled ? "w-0 h-0 opacity-0 mr-0 scale-0" : "w-[15px] h-[15px] opacity-100 mr-1.5 scale-100"}`}
                      />
                      <span>{link.label}</span>
                      {active && (
                        <motion.span
                          layoutId="navIndicator"
                          className="absolute inset-x-0 -bottom-px h-0.5 bg-[#FF6014] rounded-full"
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Desktop & Laptop Search Bar - Aligned to the right next to profile (Ultra-Premium Glass) */}
            <div
              ref={desktopSearchContainerRef}
              className="hidden md:block w-full max-w-[240px] lg:max-w-[280px] xl:max-w-[320px] ml-auto mr-4 lg:mr-6 relative z-20"
            >
              <div className={`w-full flex items-center bg-white/80 backdrop-blur-xl hover:bg-white border focus-within:bg-white focus-within:border-[#FF6014]/50 rounded-full pl-4 pr-3 h-10.5 gap-2.5 transition-all duration-300 ${
                isScrolled
                  ? "border-[#FF6014]/30 shadow-[0_4px_16px_rgba(255,96,20,0.08)]"
                  : "border-slate-200/80 shadow-2xs hover:border-[#FF6014]/20"
              }`}>
                <Search className="w-4 h-4 text-slate-400 group-focus-within:text-[#FF6014] transition-colors flex-shrink-0" aria-hidden="true" />
                <input
                  id="desktop-search"
                  ref={desktopSearchInputRef}
                  type="text"
                  placeholder="What service do you need today?"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => setShowSearchResults(true)}
                  className="bg-transparent text-xs sm:text-sm text-slate-700 outline-none w-full placeholder-slate-400 font-semibold focus:ring-0 border-0 p-0"
                />

                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setShowSearchResults(false);
                    }}
                    className="p-1 text-slate-400 hover:text-[#FF6014] transition-colors cursor-pointer"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                ) : (
                  <span className="hidden lg:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold text-slate-400 bg-slate-100 border border-slate-200 rounded-md select-none">
                    <kbd className="font-sans">⌘</kbd>
                    <kbd className="font-sans">K</kbd>
                  </span>
                )}
              </div>

              {/* Desktop Search Results Dropdown */}
              {showSearchResults && searchQuery && (
                <div className="absolute left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-100/80 overflow-hidden z-[100] max-h-[350px] overflow-y-auto text-left">
                  <div className="px-4 py-2 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Search Results</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{searchResults.length} {searchResults.length === 1 ? 'item' : 'items'} found</span>
                  </div>
                  {isSearching ? (
                    <div className="p-8 flex flex-col justify-center items-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#FF6014] border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs text-slate-400 font-medium animate-pulse">Searching services...</span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="p-1.5 space-y-0.5">
                      {searchResults.map((service: any) => (
                        <Link
                          key={service.id}
                          href={`/services/${service.id}`}
                          onClick={() => {
                            setSearchQuery("");
                            setShowSearchResults(false);
                          }}
                          className="group flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#FF6014]/10 group-hover:border-[#FF6014]/20 transition-all duration-200">
                              <LayoutGrid className="w-4 h-4 text-slate-400 group-hover:text-[#FF6014] transition-colors" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-xs group-hover:text-[#FF6014] transition-colors duration-200">{service.name}</h4>
                              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                {service.category?.name || 'Service'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right pr-2">
                            <span className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 group-hover:text-[#FF6014] group-hover:bg-[#FF6014]/5 group-hover:border-[#FF6014]/10 transition-colors">
                              {service.price ? `₹${service.price}` : 'Quote'}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
                      <Search className="w-6 h-6 text-slate-300" />
                      <p className="text-slate-400 text-xs font-semibold">No services found for &ldquo;{searchQuery}&rdquo;</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ─── Right side: Search (all devices) + Auth (desktop) + Menu (mobile) ─── */}
            <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
              {/* Search toggle — visible on mobile only */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleSearchToggle}
                className={`md:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-all border outline-none ${searchOpen
                  ? "text-[#FF6014] bg-rose-50/80 border-[#FF6014]/20 shadow-[0_2px_10px_-2px_rgba(255,96,20,0.15)]"
                  : "text-slate-600 bg-white/70 backdrop-blur-md border-slate-100 hover:text-[#FF6014] hover:bg-slate-50 shadow-sm"
                  }`}
                aria-label={searchOpen ? "Close search" : "Open search"}
                aria-expanded={searchOpen}
              >
                {searchOpen ? <X className="w-[18px] h-[18px]" /> : <Search className="w-[18px] h-[18px]" />}
              </motion.button>

              {/* Wishlist Heart Button with Badge */}
              {mounted && isAuthenticated && (
                <Link href="/dashbord/saved" className="relative p-1.5 flex items-center justify-center text-slate-500 hover:text-rose-500 transition-colors focus:outline-none shrink-0 z-20">
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center justify-center"
                  >
                    <Heart 
                      size={20} 
                      className={`stroke-[2.2] transition-transform ${savedCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} 
                    />
                  </motion.div>
                  
                  {/* Badge */}
                  <AnimatePresence>
                    {savedCount > 0 && (
                      <motion.span
                        key={savedCount}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: [1, 1.25, 1],
                          opacity: 1
                        }}
                        transition={{ 
                          scale: {
                            repeat: Infinity,
                            repeatType: "reverse",
                            duration: 1.2,
                            ease: "easeInOut"
                          },
                          opacity: { duration: 0.2 }
                        }}
                        className="absolute top-0 right-0 min-w-[16px] h-[16px] bg-[#FF6014] text-white text-[8px] font-black rounded-full flex items-center justify-center px-1 shadow-[0_0_8px_rgba(255,96,20,0.5)] border border-white"
                      >
                        {savedCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              )}

              {/* Auth Buttons or Profile Dropdown — desktop/laptop only */}
              {!mounted || authLoading ? (
                <div className="hidden md:flex items-center gap-2">
                  <div className="w-20 h-8 bg-slate-100 rounded-lg animate-pulse" />
                  <div className="w-9 h-9 bg-slate-100 rounded-full animate-pulse" />
                </div>
              ) : isAuthenticated && profile ? (
                <div className="hidden md:block relative" ref={profileDropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2.5 hover:opacity-90 transition-opacity focus:outline-none"
                    aria-haspopup="true"
                    aria-expanded={profileDropdownOpen}
                  >
                    <div className="text-right hidden lg:block">
                      <p className="text-xs font-bold text-slate-800 leading-none">{profile.name}</p>
                      <p className="text-[10px] text-slate-400 mt-1 leading-none font-semibold">{profile.roleName}</p>
                    </div>
                    <div className="w-9 h-9 bg-rose-100 text-[#FF6014] font-bold rounded-full flex items-center justify-center overflow-hidden border border-rose-200 shadow-sm hover:scale-105 transition-transform duration-200 select-none shrink-0">
                      {profile.avatarUrl ? (
                        <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                      ) : (
                        profile.avatar
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white/70 backdrop-blur-lg border border-slate-100/80 rounded-2xl shadow-xl py-2 z-50 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/40">
                          <p className="text-sm font-bold text-slate-800 truncate">{profile.name}</p>
                          <p className="text-xs text-slate-400 truncate mt-0.5 font-medium">{profile.email}</p>
                          <span className="inline-block px-2 py-0.5 text-[9px] font-bold text-[#FF6014] bg-rose-50 border border-rose-100/50 rounded-full mt-2">
                            {profile.roleName}
                          </span>
                        </div>
                        <div className="p-1 space-y-0.5">
                          <Link
                            href={role === "client" ? "/dashbord/overview" : "/dashbord"}
                            className="w-full flex items-center gap-3 p-2 rounded-xl text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-[#FF6014] transition-all font-semibold"
                            onClick={() => setProfileDropdownOpen(false)}
                          >
                            <div className="p-1.5 rounded-lg bg-slate-50 text-slate-500"><LayoutGrid size={15} /></div>
                            <span>Dashboard</span>
                          </Link>
                          <Link
                            href="/dashbord/profile"
                            className="w-full flex items-center gap-3 p-2 rounded-xl text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-[#FF6014] transition-all font-semibold"
                            onClick={() => setProfileDropdownOpen(false)}
                          >
                            <div className="p-1.5 rounded-lg bg-slate-50 text-slate-500"><User size={15} /></div>
                            <span>My Profile</span>
                          </Link>
                          <Link
                            href="/dashbord/settings"
                            className="w-full flex items-center gap-3 p-2 rounded-xl text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-[#FF6014] transition-all font-semibold"
                            onClick={() => setProfileDropdownOpen(false)}
                          >
                            <div className="p-1.5 rounded-lg bg-slate-50 text-slate-500"><Settings size={15} /></div>
                            <span>Settings</span>
                          </Link>
                          <div className="my-1 border-t border-slate-100/60" />
                          <button
                            onClick={() => { setProfileDropdownOpen(false); dispatch(authLogout()); }}
                            className="w-full flex items-center gap-3 p-2 rounded-xl text-left text-sm text-rose-600 hover:bg-rose-50 transition-all font-semibold"
                          >
                            <div className="p-1.5 rounded-lg bg-rose-50 text-[#FF6014]"><LogOut size={15} /></div>
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  <motion.div
                    whileHover={{ y: -1.5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <Link
                      href="/login"
                      className="flex items-center gap-1.5 font-bold text-[#FF6014] bg-rose-50/50 hover:bg-rose-50 border border-rose-100/60 hover:border-[#FF6014]/30 py-2 px-4 rounded-xl text-xs lg:text-sm transition-all duration-200"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#FF6014]" />
                      Login
                    </Link>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -1.5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <Link
                      href="/signup"
                      className="flex items-center gap-1.5 bg-gradient-to-r from-[#FF6014] to-[#ff7b36] hover:from-[#e55610] hover:to-[#ff6c21] text-white font-bold py-2 px-4.5 rounded-xl text-xs lg:text-sm transition-all duration-200 shadow-[0_4px_14px_-3px_rgba(255,96,20,0.22)] hover:shadow-[0_6px_20px_-3px_rgba(255,96,20,0.35)]"
                    >
                      <UserCheck className="w-4 h-4 text-white" />
                      Signup
                    </Link>
                  </motion.div>
                </div>
              )}

              {/* Menu toggle — mobile only */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleMenuToggle}
                className={`md:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-all border outline-none ${isOpen
                  ? "text-[#FF6014] bg-rose-50/80 border-[#FF6014]/20 shadow-[0_2px_10px_-2px_rgba(255,96,20,0.15)]"
                  : "text-slate-600 bg-white/70 backdrop-blur-md border-slate-100 hover:text-[#FF6014] hover:bg-slate-50 shadow-sm"
                  }`}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
              >
                {isOpen ? <X className="w-[18px] h-[18px]" /> : <Menu className="w-[18px] h-[18px]" />}
              </motion.button>
            </div>
          </div>

          {/* ─── SEARCH BAR (mobile) ─── */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                key="search-bar"
                ref={searchContainerRef}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden overflow-visible border-t border-slate-100 relative z-[99]"
              >
                <div className="py-3 px-1 relative md:max-w-xl md:mx-auto">
                  <label htmlFor="navbar-search" className="sr-only">Search services</label>
                  <div className="flex items-center bg-[#FF6014]/5 border border-[#FF6014]/15 rounded-full px-4 h-11 gap-2 focus-within:border-[#FF6014] focus-within:ring-2 focus-within:ring-[#FF6014]/10 transition-all">
                    <Search className="w-4 h-4 text-[#FF6014] flex-shrink-0" aria-hidden="true" />
                    <input
                      id="navbar-search"
                      ref={searchInputRef}
                      type="text"
                      placeholder="What service do you need today?"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSearchResults(true);
                      }}
                      onFocus={() => setShowSearchResults(true)}
                      className="bg-transparent text-sm text-slate-700 outline-none w-full placeholder-slate-400 font-medium focus:ring-0"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setShowSearchResults(false);
                        }}
                        className="p-1 text-slate-400 hover:text-[#FF6014] transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {showSearchResults && searchQuery && (
                    <div className="absolute left-1 right-1 mt-2 bg-[#FFFDFB] rounded-2xl shadow-xl border border-[#FF6014]/20 overflow-hidden z-[100] max-h-[300px] overflow-y-auto text-left">
                      {isSearching ? (
                        <div className="p-6 flex justify-center items-center">
                          <div className="w-6 h-6 border-3 border-[#FF6014] border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="flex flex-col">
                          {searchResults.map((service: any) => (
                            <Link
                              key={service.id}
                              href={`/services/${service.id}`}
                              onClick={() => {
                                setSearchOpen(false);
                                setSearchQuery("");
                                setShowSearchResults(false);
                              }}
                              className="group flex items-center gap-3 p-3 hover:bg-[#FF6014]/5 transition-all border-b border-[#FF6014]/10 last:border-0"
                            >
                              <div className="w-9 h-9 bg-[#FF6014]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                                <LayoutGrid className="w-4.5 h-4.5 text-[#FF6014]" />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800 text-xs group-hover:text-[#FF6014] transition-colors duration-200">{service.name}</h4>
                                <p className="text-[10px] text-slate-500 font-medium">
                                  {service.category?.name || 'Service'} • {service.price ? `₹${service.price}` : 'Price varies'}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 text-center">
                          <p className="text-[#FF6014]/80 text-xs font-bold">No services found.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── MOBILE DRAWER ─── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="mobile-drawer"
              id="mobile-menu"
              role="navigation"
              aria-label="Mobile navigation"
              variants={mobileDrawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="md:hidden absolute top-full left-0 right-0 z-[99] max-h-[calc(100vh-80px)] overflow-y-auto border-t border-slate-100 bg-white/95 backdrop-blur-xl shadow-[0_12px_30px_rgba(0,0,0,0.08)] pb-8 scrollbar-none"
            >
              <div className="px-4.5 py-4 space-y-2">
                {ALL_NAV_LINKS.map((link, i) => {
                  const active = link.hasDropdown
                    ? pathname.startsWith("/categories") || pathname.startsWith("/services")
                    : isActive(link.href);
                  const Icon = link.icon;

                  if (link.hasDropdown) {
                    return (
                      <motion.div key={i} variants={mobileItemVariants} className="space-y-1">
                        <div
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                            active
                              ? "text-[#FF6014] bg-[#FFF4EE] font-bold border-l-2 border-[#FF6014]"
                              : "text-slate-700 hover:bg-slate-50 border-l-2 border-transparent"
                          }`}
                        >
                          <Link
                            href={link.href}
                            className="flex items-center gap-2 flex-grow text-sm font-semibold"
                            onClick={() => setIsOpen(false)}
                          >
                            <Icon className={`w-[18px] h-[18px] ${active ? "text-[#FF6014]" : "text-slate-400"}`} />
                            <span>{link.label}</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => setShowMobileAccordion(!showMobileAccordion)}
                            aria-label={showMobileAccordion ? "Collapse categories" : "Expand categories"}
                            aria-expanded={showMobileAccordion}
                            className="p-1 text-slate-400 hover:text-[#FF6014] transition-colors cursor-pointer"
                          >
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showMobileAccordion ? "rotate-180" : ""}`} />
                          </button>
                        </div>

                        <AnimatePresence>
                          {showMobileAccordion && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.22, ease: "easeOut" }}
                              className="overflow-hidden pl-2 pr-1 py-1"
                            >
                              <div className="grid grid-cols-2 gap-2">
                                {apiCategories.length === 0 ? (
                                  [1, 2, 3, 4].map((n) => (
                                    <div key={n} className="h-16 bg-slate-50/70 rounded-xl animate-pulse" />
                                  ))
                                ) : (
                                  apiCategories.map((cat: any) => {
                                    const isCategoryActive = pathname === `/categories/${cat.id}`;
                                    const CatIcon = getCategoryIcon(cat.name);
                                    return (
                                      <Link
                                        key={cat.id}
                                        href={`/categories/${cat.id}`}
                                        className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all ${
                                          isCategoryActive
                                            ? "bg-[#FFF4EE] border-[#FF6014]/20 text-[#FF6014] font-bold"
                                            : "bg-slate-50/50 border-slate-100 text-slate-600 hover:bg-slate-50 hover:text-[#FF6014]"
                                        }`}
                                        onClick={() => {
                                          setIsOpen(false);
                                          setShowMobileAccordion(false);
                                        }}
                                      >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                          isCategoryActive ? "bg-[#FF6014] text-white" : "bg-white border border-slate-200/60 text-slate-400"
                                        }`}>
                                          <CatIcon className="w-4 h-4" />
                                        </div>
                                        <span className="text-[10px] leading-tight text-center font-medium line-clamp-1">{cat.name}</span>
                                      </Link>
                                    );
                                  })
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div key={i} variants={mobileItemVariants}>
                      <Link
                        href={link.href}
                        className={`flex items-center gap-2 px-3 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                          active
                            ? "text-[#FF6014] bg-[#FFF4EE] font-bold border-l-2 border-[#FF6014]"
                            : "text-slate-700 hover:bg-slate-50 border-l-2 border-transparent"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon className={`w-[18px] h-[18px] ${active ? "text-[#FF6014]" : "text-slate-400"}`} />
                        <span>{link.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Auth Section */}
                {!mounted || authLoading ? (
                  <motion.div variants={mobileItemVariants} className="pt-3 border-t border-slate-100 mt-2">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/60">
                      <div className="w-10 h-10 bg-slate-200 rounded-full animate-pulse shrink-0" />
                      <div className="flex-grow space-y-1.5">
                        <div className="h-3 bg-slate-200 rounded animate-pulse w-2/3" />
                        <div className="h-2 bg-slate-200 rounded animate-pulse w-1/2" />
                      </div>
                    </div>
                  </motion.div>
                ) : isAuthenticated && profile ? (
                  <motion.div variants={mobileItemVariants} className="pt-3 border-t border-slate-100 mt-2 space-y-3">
                    {/* User profile card */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/40 border border-slate-100">
                      <div className="w-10 h-10 bg-orange-50 text-[#FF6014] font-bold rounded-full flex items-center justify-center overflow-hidden border border-orange-100 shadow-inner shrink-0 select-none">
                        {profile.avatarUrl ? (
                          <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                        ) : (
                          profile.avatar
                        )}
                      </div>
                      <div className="min-w-0 flex-grow">
                        <p className="text-xs font-bold text-slate-800 truncate">{profile.name}</p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5 font-medium">{profile.email}</p>
                        <span className="inline-block px-1.5 py-0.5 text-[8px] font-bold text-[#FF6014] bg-[#FFF4EE] border border-[#FF6014]/15 rounded-full mt-1.5 leading-none">
                          {profile.roleName}
                        </span>
                      </div>
                    </div>

                    {/* Quick action grid */}
                    <div className="grid grid-cols-3 gap-2">
                      <Link
                        href={role === "client" ? "/dashbord/overview" : "/dashbord"}
                        className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white border border-slate-200/50 text-slate-700 hover:bg-[#FFF4EE] hover:text-[#FF6014] hover:border-[#FF6014]/20 transition-all gap-1 cursor-pointer"
                        onClick={() => setIsOpen(false)}
                      >
                        <LayoutGrid size={15} className="text-slate-400 group-hover:text-[#FF6014]" />
                        <span className="text-[10px] font-bold">Dashboard</span>
                      </Link>
                      <Link
                        href="/dashbord/profile"
                        className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white border border-slate-200/50 text-slate-700 hover:bg-[#FFF4EE] hover:text-[#FF6014] hover:border-[#FF6014]/20 transition-all gap-1 cursor-pointer"
                        onClick={() => setIsOpen(false)}
                      >
                        <User size={15} className="text-slate-400 group-hover:text-[#FF6014]" />
                        <span className="text-[10px] font-bold">Profile</span>
                      </Link>
                      <Link
                        href="/dashbord/settings"
                        className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white border border-slate-200/50 text-slate-700 hover:bg-[#FFF4EE] hover:text-[#FF6014] hover:border-[#FF6014]/20 transition-all gap-1 cursor-pointer"
                        onClick={() => setIsOpen(false)}
                      >
                        <Settings size={15} className="text-slate-400 group-hover:text-[#FF6014]" />
                        <span className="text-[10px] font-bold">Settings</span>
                      </Link>
                    </div>

                    {/* Sign out */}
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        dispatch(authLogout());
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-rose-50 border border-rose-100 hover:bg-rose-100/65 text-rose-600 font-bold text-xs transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                ) : (
                  <motion.div variants={mobileItemVariants} className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 mt-2">
                    <Link
                      href="/login"
                      className="flex items-center justify-center gap-1.5 py-2.5 text-slate-700 font-bold text-xs border border-slate-200 bg-white rounded-xl hover:border-[#FF6014] hover:text-[#FF6014] transition-all cursor-pointer"
                      onClick={() => setIsOpen(false)}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#FF6014]" />
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-[#FF6014] to-[#FF7A37] text-white font-bold text-xs rounded-xl shadow-sm hover:shadow hover:shadow-orange-500/10 transition-all active:scale-[0.98] cursor-pointer"
                      onClick={() => setIsOpen(false)}
                    >
                      <UserCheck className="w-3.5 h-3.5 text-white" />
                      Signup
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ─── MOBILE BOTTOM NAVIGATION ─── */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 25, delay: 0.1 }}
        className="md:hidden fixed bottom-4 left-4 right-4 max-w-md mx-auto z-50"
      >
        <div className="absolute inset-0 bg-white/70 backdrop-blur-xl rounded-[24px] border border-white/30 shadow-[0_12px_40px_rgba(0,0,0,0.08)]" />

        <div className="relative grid grid-cols-5 gap-0 px-1 py-1.5">
          {bottomLinks.map((link: any, i) => {
            const Icon = link.icon;
            const isMenuActive = link.hasDropdown && pathname.startsWith("/categories");
            const active = link.hasDropdown ? isMenuActive : isActive(link.href);

            const handleClick = (e: React.MouseEvent) => {
              if (link.isSignOut) {
                e.preventDefault();
                dispatch(authLogout());
                return;
              }
              if (link.hasDropdown) {
                e.preventDefault();
                setIsOpen((prev) => !prev);
                setShowMobileAccordion(true);
              } else {
                setIsOpen(false);
              }
            };

            const isProfileLink = link.label === "Login" || link.isDashboard;
            const showAvatar = isProfileLink && mounted && isAuthenticated && profile;


            return (
              <Link
                key={i}
                href={link.href}
                onClick={handleClick}
                className="relative flex flex-col items-center justify-center py-1 group"
              >


                <motion.div
                  className="relative z-10"
                  whileTap={{ scale: 0.75 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  {showAvatar ? (
                    <motion.div
                      animate={active ? { scale: 1.1 } : { scale: 1 }}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border select-none overflow-hidden ${active
                        ? "bg-orange-100 text-[#FF6014] border-[#FF6014]/50 ring-2 ring-[#FF6014]/15 shadow-sm"
                        : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                    >
                      {profile?.avatarUrl ? (
                        <img src={profile.avatarUrl} alt={profile?.name} className="w-full h-full object-cover" />
                      ) : (
                        profile?.avatar
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={active ? { y: -2 } : { y: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      <Icon
                        className={`w-[21px] h-[21px] transition-colors duration-200 ${(link as any).isSignOut
                          ? "text-rose-500"
                          : active
                            ? "text-[#FF6014] drop-shadow-[0_0_8px_rgba(255,96,20,0.4)]"
                            : "text-slate-400 group-hover:text-slate-600"
                          }`}
                        strokeWidth={(link as any).isSignOut ? 2.2 : active ? 2.4 : 1.8}
                      />
                    </motion.div>
                  )}
                </motion.div>

                <motion.span
                  animate={active ? { y: -1, opacity: 1 } : { y: 0, opacity: 0.7 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`relative z-10 text-[10px] font-bold tracking-wide leading-none mt-1 ${(link as any).isSignOut
                    ? "text-rose-500"
                    : active
                      ? "text-[#FF6014]"
                      : "text-slate-400 group-hover:text-slate-600"
                    }`}
                >
                  {link.label}
                </motion.span>

                <AnimatePresence>
                  {active && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#FF6014] rounded-full shadow-[0_0_6px_2px_rgba(255,90,95,0.4)] z-10"
                    />
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}