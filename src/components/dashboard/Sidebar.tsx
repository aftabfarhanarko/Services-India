"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Users,
  BarChart3,
  LogOut,
  Menu,
  Briefcase,
  ClipboardList,
  Heart,
  Wallet,
  User,
  UserPlus,
  HelpCircle,
  Zap,
  Percent,
  LayoutGrid,
  Calendar,
  Gift,
  Wrench,
  Layers,
  Package,
  MapPin,
  History,
  MessageSquare,
  Mail,
  Search,
  X,
  ChevronDown,
  Bot,
  Languages,
  Truck,
  Coins,
  Ticket,
  Shield,
  FileText,
  Receipt,
  PlusCircle,
  Trash2,
  Globe,
  Sparkles,
  BookOpen,
  UserCheck,
  Building2,
  ShieldCheck,
  Store,
  KeyRound,
  Megaphone,
  Headphones,
  Contact,
  CheckSquare,
  Settings,
  ShoppingBag
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { UserRole, getRoleName, logout as authLogout } from "@/redux/features/auth/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import { setLanguage, toggleLanguage } from "@/redux/features/shared/langSlice";
import { useGetPublicCompanyBrandingQuery } from "@/redux/features/landing/landingApi";
import { formatImageUrl } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SidebarGroup {
  label: string;
  icon: React.ComponentType<any>;
  href?: string;
  children?: {
    label: string;
    href: string;
    icon?: React.ComponentType<any>;
  }[];
}

export function Sidebar({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const rawRole = useAppSelector((state) => state.auth.role) || "superadmin";
  const role = (typeof rawRole === 'string' ? rawRole.toLowerCase().replace(/\s+/g, '') : "client") as UserRole;
  const roleName = getRoleName(role);

  useEffect(() => {
    setMounted(true);
  }, []);

  const lang = useAppSelector((state) => state.lang.value);

  // Helper for 3-way language label translation
  const getLabel = (bn: string, hi: string, en: string) => {
    if (lang === "bn") return bn;
    if (lang === "hi") return hi;
    return en;
  };

  // Dynamic grouped menu items based on role (Accordion Tree structure)
  const getSidebarGroups = (userRole: UserRole): SidebarGroup[] => {
    const homeItem = { label: getLabel("হোম পেজ", "होम पेज", "Home Page"), icon: Home, href: "/" };

    switch (userRole) {
      case "superadmin":
        return [
          homeItem,
          { label: getLabel("ওভারভিউ", "अवलोकन", "Overview"), icon: LayoutGrid, href: "/dashbord" },
          { label: getLabel("এআই অ্যাডভাইজর", "एआई सलाहकार", "AI Advisor"), icon: Bot, href: "/dashbord/analytics" },
          {
            label: getLabel("অপারেশনস", "संचालन", "Operations"),
            icon: Calendar,
            children: [
              { label: getLabel("বুকিং ম্যানেজ করুন", "बुकिंग प्रबंधित करें", "Manage Bookings"), href: "/dashbord/manage-bookings", icon: ClipboardList },
              { label: getLabel("কুইক বুকিং", "त्वरित बुकिंग", "Quick Booking"), href: "/dashbord/quick-booking", icon: Zap },
              { label: getLabel("উত্তোলনের অনুরোধসমূহ", "निकासी अनुरोध", "Withdraw Requests"), href: "/dashbord/withdraw", icon: Wallet }
            ]
          },
          {
            label: getLabel("কাস্টম রিকোয়েস্ট", "कस्टम अनुरोध", "Custom Requests"),
            icon: FileText,
            children: [
              { label: getLabel("সার্ভিসেস রিকোয়েস্ট", "सेवा अनुरोध", "Service Requests"), href: "/dashbord/custom-requests", icon: Wrench },
              { label: getLabel("হোম শিফটিং", "होम शिफ्टिंग", "Home Shifting"), href: "/dashbord/custom-shifting", icon: Truck }
            ]
          },
          {
            label: getLabel("ইউজার ডিরেক্টরি", "उपयोगकर्ता निर्देशिका", "User Directory"),
            icon: Users,
            children: [
              { label: getLabel("সুপার অ্যাডমিন", "सुपर एडमिन", "Super Admins"), href: "/dashbord/superadmins", icon: ShieldCheck },
              { label: getLabel("ক্লায়েন্ট ম্যানেজ করুন", "ग्राहक प्रबंधित करें", "Manage Clients"), href: "/dashbord/users", icon: UserCheck },
              { label: getLabel("ভেন্ডর ম্যানেজ করুন", "विक्रेता प्रबंधित करें", "Manage Vendors"), href: "/dashbord/vendors", icon: Store },
              { label: getLabel("এজেন্ট ম্যানেজ করুন", "एजेंट प्रबंधित करें", "Manage Agents"), href: "/dashbord/agents", icon: Zap },
              { label: getLabel("কর্মচারী ম্যানেজ করুন", "कर्मचारी प्रबंधित करें", "Manage Employees"), href: "/dashbord/employees", icon: UserPlus },
              { label: getLabel("রোল ম্যানেজমেন্ট", "भूमिका प्रबंधन", "Role Management"), href: "/dashbord/role", icon: KeyRound }
            ]
          },
          {
            label: getLabel("সার্ভিস ক্যাটালগ", "सेवा सूची", "Service Catalog"),
            icon: Layers,
            children: [
              { label: getLabel("ক্যাটাগরিস", "श्रेणियां", "Categories"), href: "/dashbord/category", icon: ClipboardList },
              { label: getLabel("লোকেশনসমূহ", "स्थान", "Locations"), href: "/dashbord/locations", icon: MapPin },
              { label: getLabel("সার্ভিসেস", "सेवाएं", "Services"), href: "/dashbord/services", icon: Wrench },
              { label: getLabel("নেস্টেড সার্ভিসেস", "नेस्टेड सेवाएं", "Nested Services"), href: "/dashbord/nested-services", icon: Layers },
              { label: getLabel("প্যাকেজসমূহ", "पैकेज", "Packages"), href: "/dashbord/packages", icon: Package }
            ]
          },
          {
            label: getLabel("ল্যান্ডিং পেজ", "लैंडिंग पेज", "Landing Page"),
            icon: Globe,
            children: [
              { label: getLabel("হিরো ম্যানেজমেন্ট", "हीरो प्रबंधन", "Hero Management"), href: "/dashbord/hero", icon: Sparkles },
              { label: getLabel("ব্লগ ম্যানেজমেন্ট", "ब्लॉग प्रबंधन", "Blog Management"), href: "/dashbord/blogs", icon: BookOpen },
              { label: getLabel("কোম্পানি ব্র্যান্ডিং", "कंपनी ब्रांडिंग", "Company Branding"), href: "/dashbord/company-branding", icon: Building2 }
            ]
          },
          {
            label: getLabel("মার্কেটিং", "मार्केटिंग", "Marketing"),
            icon: Megaphone,
            children: [
              { label: getLabel("কুপনসমূহ", "कूपन", "Coupons"), href: "/dashbord/coupons", icon: Percent }
            ]
          },
          {
            label: getLabel("ম্যানুয়াল ইনভয়েস", "मैनुअल चालान", "Manual Invoice"),
            icon: Receipt,
            children: [
              { label: getLabel("ড্যাশবোর্ড", "डैशबोर्ड", "Dashboard"), href: "/dashbord/manual-invoice", icon: LayoutGrid },
              { label: getLabel("নতুন ইনভয়েস", "चालान बनाएं", "Create Invoice"), href: "/dashbord/manual-invoice/create", icon: PlusCircle },
              { label: getLabel("ক্লায়েন্ট ডিরেক্টরি", "ग्राहक निर्देशिका", "Client Directory"), href: "/dashbord/manual-invoice/customers", icon: Users },
              { label: getLabel("সার্ভিস ক্যাটালগ", "सेवा सूची", "Service Catalog"), href: "/dashbord/manual-invoice/services", icon: Wrench },
              { label: getLabel("ট্র্যাশ বিন", "कचरा पात्र", "Trash Bin"), href: "/dashbord/manual-invoice/trash", icon: Trash2 }
            ]
          },
          {
            label: getLabel("সাপোর্ট ডেস্ক", "सहायता डेस्क", "Support Desk"),
            icon: Mail,
            children: [
              { label: getLabel("টিকেট ম্যানেজমেন্ট", "टिकट प्रबंधन", "Ticket Management"), href: "/dashbord/support-desk", icon: Ticket },
              { label: getLabel("যোগাযোগ", "संपर्क", "Contacts"), href: "/dashbord/contacts", icon: Mail },
              { label: getLabel("লাইভ চ্যাট", "लाइव चैट", "Live Chat"), href: "/dashbord/live-chat", icon: MessageSquare },
              { label: getLabel("এআই চ্যাট লগ", "एआई चैट लॉग", "AI Chat Log"), href: "/dashbord/ai-chat-log", icon: Bot },
            ]
          },
          {
            label: getLabel("সেটিংস", "सेटिंग्स", "Settings"),
            icon: User,
            children: [
              { label: getLabel("আমার প্রোফাইল", "मेरी प्रोफ़ाइल", "My Profile"), href: "/dashbord/profile", icon: User }
            ]
          }
        ];
      case "agent":
        return [
          homeItem,
          { label: getLabel("ওভারভিউ", "अवलोकन", "Overview"), icon: LayoutGrid, href: "/dashbord" },
          {
            label: getLabel("অপারেশনস", "संचालन", "Operations"),
            icon: Calendar,
            children: [
              { label: getLabel("বুকিং ম্যানেজ করুন", "बुकिंग प्रबंधित करें", "Manage Bookings"), href: "/dashbord/manage-bookings", icon: ClipboardList },
              { label: getLabel("কুইক বুকিং", "त्वरित बुकिंग", "Quick Booking"), href: "/dashbord/quick-booking", icon: Zap },
              { label: getLabel("কমিশনসমূহ", "कमीशन", "Commissions"), href: "/dashbord/commissions", icon: Coins },
              { label: getLabel("অর্ডারসমূহ", "ऑर्डर", "Orders"), href: "/dashbord/orders", icon: ShoppingBag },
              { label: getLabel("ওয়ালেট এবং উপার্জন", "वॉलेट और कमाई", "Wallet & Earnings"), href: "/dashbord/vendor-wallet", icon: Wallet }
            ]
          },
          {
            label: getLabel("ডিরেক্টরি", "निर्देशिका", "Directories"),
            icon: Users,
            children: [
              { label: getLabel("ক্লায়েন্ট ম্যানেজ করুন", "ग्राहक प्रबंधित करें", "Manage Clients"), href: "/dashbord/users", icon: UserCheck },
              { label: getLabel("সার্ভিসেস", "सेवाएं", "Services"), href: "/dashbord/services", icon: Wrench }
            ]
          },
          {
            label: getLabel("ম্যানুয়াল ইনভয়েস", "मैनुअल चालान", "Manual Invoice"),
            icon: Receipt,
            children: [
              { label: getLabel("ড্যাশবোর্ড", "चालान डैशबोर्ड", "Invoice Dashboard"), href: "/dashbord/manual-invoice", icon: LayoutGrid },
              { label: getLabel("নতুন ইনভয়েস", "चालान बनाएं", "Create Invoice"), href: "/dashbord/manual-invoice/create", icon: PlusCircle },
              { label: getLabel("ক্লায়েন্ট ডিরেক্টরি", "ग्राहक निर्देशिका", "Client Directory"), href: "/dashbord/manual-invoice/customers", icon: Users },
              { label: getLabel("সার্ভিস ক্যাটালগ", "सेवा सूची", "Service Catalog"), href: "/dashbord/manual-invoice/services", icon: Wrench },
              { label: getLabel("ট্র্যাশ বিন", "कचरा पात्र", "Trash Bin"), href: "/dashbord/manual-invoice/trash", icon: Trash2 }
            ]
          },
          {
            label: getLabel("সাপোর্ট এবং প্রোফাইল", "सहायता और प्रोफ़ाइल", "Support & Profile"),
            icon: HelpCircle,
            children: [
              { label: getLabel("লাইভ চ্যাট", "लाइव चैट", "Live Chat"), href: "/dashbord/live-chat", icon: MessageSquare },
              { label: getLabel("সাপোর্ট ডেস্ক", "सहायता डेस्क", "Support Desk"), href: "/dashbord/support", icon: HelpCircle },
              { label: getLabel("আমার প্রোফাইল", "मेरी प्रोफ़ाइल", "My Profile"), href: "/dashbord/profile", icon: User }
            ]
          }
        ];
      case "vendor":
        return [
          homeItem,
          { label: getLabel("ওভারভিউ", "अवलोकन", "Overview"), icon: LayoutGrid, href: "/dashbord" },
          {
            label: getLabel("বুকিংস", "बुकिंग", "Bookings"),
            icon: Calendar,
            children: [
              { label: getLabel("বুকিং ম্যানেজ করুন", "बुकिंग प्रबंधित करें", "Manage Bookings"), href: "/dashbord/manage-bookings", icon: ClipboardList },
              { label: getLabel("কাস্টম শিফটিং", "कस्टम शिफ्टिंग", "Custom Shifting"), href: "/dashbord/custom-shifting", icon: Truck },
              { label: getLabel("ওয়ালেট এবং উপার্জন", "वॉलेट और कमाई", "Wallet & Earnings"), href: "/dashbord/vendor-wallet", icon: Wallet }
            ]
          },
          {
            label: getLabel("সার্ভিসেস", "सेवाएं", "Services"),
            icon: Wrench,
            children: [
              { label: getLabel("আমার সার্ভিসেস", "मेरी सेवाएं", "My Services"), href: "/dashbord/vendor-services", icon: Briefcase },
              { label: getLabel("নেস্টেড সার্ভিসেস", "नेस्टेड सेवाएं", "Nested Services"), href: "/dashbord/nested-services", icon: Layers },
              { label: getLabel("প্যাকেজসমূহ", "पैकेज", "Packages"), href: "/dashbord/vendor-packages", icon: Package }
            ]
          },
          {
            label: getLabel("টিম এবং ক্লাইন্টস", "टीम और ग्राहक", "Team & Clients"),
            icon: Users,
            children: [
              { label: getLabel("আমার কর্মচারীবৃন্দ", "मेरे कर्मचारी", "My Employees"), href: "/dashbord/employees", icon: UserPlus },
              { label: getLabel("আমার ক্লাইন্টস", "मेरे ग्राहक", "My Clients"), href: "/dashbord/users", icon: UserCheck }
            ]
          },
          {
            label: getLabel("সাপোর্ট এবং প্রোফাইল", "सहायता और प्रोफ़ाइल", "Support & Profile"),
            icon: HelpCircle,
            children: [
              { label: getLabel("লাইভ চ্যাট", "लाइव चैट", "Live Chat"), href: "/dashbord/live-chat", icon: MessageSquare },
              { label: getLabel("আমার প্রোফাইল", "मेरी प्रोफ़ाइल", "My Profile"), href: "/dashbord/profile", icon: User }
            ]
          }
        ];
      case "employee":
        return [
          homeItem,
          { label: getLabel("ওভারভিউ", "अवलोकन", "Overview"), icon: LayoutGrid, href: "/dashbord" },
          { label: getLabel("আমার টাস্কসমূহ", "मेरे कार्य", "My Tasks"), icon: ClipboardList, href: "/dashbord/employee-tasks" },
          { label: getLabel("কাজের ইতিহাস", "कार्य इतिहास", "Work History"), icon: Calendar, href: "/dashbord/employee-history" },
          { label: getLabel("আমার প্রোফাইল", "मेरी प्रोफ़ाइल", "My Profile"), icon: User, href: "/dashbord/profile" }
        ];
      case "client":
        return [
          homeItem,
          { label: getLabel("ওভারভিউ", "अवलोकन", "Overview"), icon: LayoutGrid, href: "/dashbord/overview" },
          { label: getLabel("আমার বুকিংস", "मेरी बुकिंग", "My Bookings"), icon: Calendar, href: "/dashbord/bookings" },
          { label: getLabel("সংরক্ষিত সার্ভিসেস", "सहेजी गई सेवाएं", "Saved Services"), icon: Heart, href: "/dashbord/saved" },
          { label: getLabel("হেল্প সেন্টার", "सहायता केंद्र", "Help Center"), icon: HelpCircle, href: "/dashbord/help" },
          { label: getLabel("আমার প্রোফাইল", "मेरी प्रोफ़ाइल", "My Profile"), icon: User, href: "/dashbord/profile" }
        ];
      default:
        return [];
    }
  };

  // Fuzzy / Multi-word Search Algorithm: Matches if ALL or ANY query words match label
  const isSearchMatch = (text: string, query: string) => {
    if (!query.trim()) return true;
    const cleanText = text.toLowerCase();
    const queryTokens = query.toLowerCase().trim().split(/\s+/);
    // Return true if every searched word token exists anywhere in the text
    return queryTokens.every(token => cleanText.includes(token));
  };

  // Filter sidebar groups based on search query
  const sidebarGroups = useMemo(() => {
    const groups = getSidebarGroups(role);
    if (!searchQuery.trim()) return groups;

    return groups
      .map(group => {
        if (group.children) {
          const matchedChildren = group.children.filter(child =>
            isSearchMatch(child.label, searchQuery) || isSearchMatch(child.href, searchQuery)
          );
          if (matchedChildren.length > 0) {
            return { ...group, children: matchedChildren };
          }
        }
        if (isSearchMatch(group.label, searchQuery) || (group.href && isSearchMatch(group.href, searchQuery))) {
          return group;
        }
        return null;
      })
      .filter((g): g is SidebarGroup => g !== null);
  }, [role, searchQuery, lang]);

  // Auto-expand group that contains active link or matching search
  useEffect(() => {
    const groups = getSidebarGroups(role);
    if (searchQuery.trim()) {
      const matchedGroup = groups.find(group =>
        isSearchMatch(group.label, searchQuery) ||
        group.children?.some(c => isSearchMatch(c.label, searchQuery) || isSearchMatch(c.href, searchQuery))
      );
      if (matchedGroup) {
        setExpandedGroup(matchedGroup.label);
      }
    } else {
      const activeGroup = groups.find(group =>
        group.children?.some(child => pathname === child.href)
      );
      if (activeGroup) {
        setExpandedGroup(activeGroup.label);
      }
    }
  }, [pathname, role, searchQuery, lang]);

  const handleLogout = () => {
    dispatch(authLogout());
  };

  const { data: brandingRes, isLoading: isBrandingLoading } = useGetPublicCompanyBrandingQuery();
  const rawCompanyLogo = brandingRes?.data?.logoUrl || "/rajshiblogo.png";
  const companyLogo = formatImageUrl(rawCompanyLogo);
  const companyName = brandingRes?.data?.companyName || "Rajseba";

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Backdrop overlay for mobile */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      />

      <div
        className={`bg-white text-slate-800 border-r-[2px] border-[#FF6014]/15 shadow-[6px_0_24px_rgba(0,0,0,0.015)] transition-all duration-300 flex flex-col h-screen fixed inset-y-0 left-0 z-[60] md:relative md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } ${collapsed ? "w-20" : "w-64"} overflow-hidden`}
      >
        {/* Repeating background icons pattern inside sidebar */}
        <div
          className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0"
          style={{ backgroundSize: 'auto' }}
        />

        {/* Brand Header */}
        <div className="p-5 flex items-start justify-between border-b border-slate-100 relative z-10">
          <Link href="/" className="flex flex-col items-start gap-2">
            <div className="relative max-h-11 max-w-[170px] min-w-[60px] min-h-[32px] flex items-center justify-start">
              {isBrandingLoading ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-[#FF6014]">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              ) : (
                <img
                  src={companyLogo}
                  alt={companyName}
                  className={collapsed ? "h-8 w-8 object-contain shrink-0" : "max-h-11 w-auto max-w-[170px] object-contain object-left shrink-0"}
                />
              )}
            </div>
            {!collapsed && (
              <span className="text-[9px] text-[#FF6014] font-black tracking-wider uppercase bg-[#FF6014]/5 border border-[#FF6014]/20 px-2.5 py-0.5 rounded-full shrink-0">
                {roleName}
              </span>
            )}
          </Link>
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg transition-colors shrink-0">
            <X size={18} />
          </button>
        </div>

        {/* Search Bar */}
        {!collapsed && (
          <div className="px-4 pt-4 pb-2 relative z-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder={lang === "bn" ? "মেনু খুঁজুন..." : "Search menu..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200/80 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-700 placeholder:text-slate-400/80 outline-none focus:border-[#FF6014] focus:ring-4 focus:ring-[#FF6014]/10 transition-all shadow-sm focus:shadow-[0_0_20px_-3px_rgba(255,96,20,0.15)]"
              />
            </div>
          </div>
        )}

        {/* Accordion Tree Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-sidebar-scrollbar relative z-10">
          {sidebarGroups.map((group, index) => {
            const hasChildren = group.children && group.children.length > 0;
            const isExpanded = expandedGroup === group.label;

            // Check if active item is inside this group
            const containsActive = hasChildren && group.children?.some(c => pathname === c.href);
            const isDirectActive = !hasChildren && group.href && pathname === group.href;

            const handleToggle = () => {
              if (hasChildren) {
                setExpandedGroup(isExpanded ? null : group.label);
              }
            };

            return (
              <div key={index} className="space-y-1">
                {/* Parent Row Button / Link */}
                {group.href ? (
                  <Link
                    href={group.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group border relative ${isDirectActive
                      ? "bg-gradient-to-r from-[#FF6014] to-[#FF7C71] text-white font-extrabold shadow-md shadow-[#FF6014]/20 scale-[1.01] border-transparent"
                      : "border-transparent text-slate-600 hover:bg-[#FF6014]/5 hover:text-[#FF6014] hover:translate-x-1 font-semibold"
                      }`}
                  >
                    {isDirectActive && (
                      <div className="absolute left-1.5 w-1 h-5 bg-white rounded-full" />
                    )}
                    <group.icon size={18} className={isDirectActive ? "text-white" : "text-slate-400 group-hover:text-slate-600 transition-colors"} />
                    {!collapsed && <span className="text-[14px]">{group.label}</span>}
                  </Link>
                ) : (
                  <button
                    onClick={handleToggle}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group border relative ${containsActive
                      ? isExpanded
                        ? "bg-[#FF6014]/5 border-[#FF6014]/15 text-[#FF6014] font-extrabold shadow-sm"
                        : "bg-gradient-to-r from-[#FF6014] to-[#FF7C71] text-white font-extrabold shadow-md shadow-[#FF6014]/20 scale-[1.01] border-transparent"
                      : "border-transparent text-slate-600 hover:bg-[#FF6014]/5 hover:text-[#FF6014] hover:translate-x-1 font-semibold"
                      }`}
                  >
                    {containsActive && isExpanded && (
                      <div className="absolute left-1.5 w-1 h-5 bg-[#FF6014] rounded-full" />
                    )}
                    {containsActive && !isExpanded && (
                      <div className="absolute left-1.5 w-1 h-5 bg-white rounded-full" />
                    )}
                    <div className="flex items-center gap-3">
                      <group.icon
                        size={18}
                        className={
                          containsActive
                            ? isExpanded
                              ? "text-[#FF6014]"
                              : "text-white"
                            : "text-slate-400 group-hover:text-slate-600 transition-colors"
                        }
                      />
                      {!collapsed && <span className="text-[14px]">{group.label}</span>}
                    </div>
                    {!collapsed && (
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${containsActive
                          ? isExpanded
                            ? "text-[#FF6014]/70"
                            : "text-white/70"
                          : "text-slate-400"
                          } ${isExpanded ? "rotate-180" : ""}`}
                      />
                    )}
                  </button>
                )}

                {/* Collapsible Sub-menu (Tree branch hierarchy) */}
                {hasChildren && group.children && (
                  <AnimatePresence initial={false}>
                    {isExpanded && !collapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        className="relative pl-6 space-y-1 overflow-hidden"
                      >
                        {/* Parent vertical timeline trunk */}
                        <div className="absolute left-[27px] top-0 bottom-4 w-[1.5px] bg-[#FF6014]/25" />

                        {group.children.map((child, cIdx) => {
                          const isChildActive = pathname === child.href;
                          return (
                            <Link
                              key={cIdx}
                              href={child.href}
                              onClick={onClose}
                              className={`flex items-center gap-2.5 pl-9 pr-3 py-2 rounded-xl text-[13px] font-bold transition-all relative group border ${isChildActive
                                ? "bg-gradient-to-r from-[#FF6014] to-[#FF7C71] text-white shadow-md shadow-[#FF6014]/15 border-transparent scale-[1.01]"
                                : "border-transparent text-slate-500 hover:bg-[#FF6014]/5 hover:text-[#FF6014] hover:translate-x-1.5"
                                }`}
                            >
                              {/* Branch hook curve SVG-style path connector */}
                              <div className="absolute left-[27px] top-0 w-3.5 h-[20px] border-l-[1.5px] border-b-[1.5px] border-[#FF6014]/30 rounded-bl-lg pointer-events-none" />

                              {isChildActive && (
                                <div className="absolute left-[25px] top-[12px] w-1.5 h-1.5 bg-[#FF7C71] rounded-full ring-2 ring-white z-10" />
                              )}

                              {child.icon && (
                                <child.icon
                                  size={14}
                                  className={isChildActive ? "text-white shrink-0" : "text-slate-400 group-hover:text-slate-600 transition-colors shrink-0"}
                                />
                              )}
                              <span className="truncate">{child.label}</span>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </nav>



        {/* Bottom Language & Logout Controls (Premium Glass Card) */}
        <div className="p-3 border-t border-slate-100 bg-gradient-to-b from-white/40 to-slate-50/60 relative z-10 space-y-1.5">
          <div className="flex items-center justify-between p-2 rounded-2xl bg-white border border-slate-200/70 shadow-2xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-xl bg-slate-100 text-[#FF6014] shrink-0">
                <Languages size={16} />
              </div>
              {!collapsed && (
                <span className="text-xs font-black text-slate-800 truncate">
                  {lang === "bn" ? "ভাষা" : lang === "hi" ? "भाषा" : "Language"}
                </span>
              )}
            </div>
            <div className="flex items-center gap-0.5 bg-slate-100/90 p-0.5 rounded-xl shrink-0">
              <button
                onClick={() => dispatch(setLanguage("bn"))}
                className={`px-1.5 py-0.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                  lang === "bn" ? "bg-[#FF6014] text-white shadow-2xs" : "text-slate-500 hover:text-slate-800"
                }`}
                title="বাংলা"
              >
                বাং
              </button>
              <button
                onClick={() => dispatch(setLanguage("en"))}
                className={`px-1.5 py-0.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                  lang === "en" ? "bg-[#FF6014] text-white shadow-2xs" : "text-slate-500 hover:text-slate-800"
                }`}
                title="English"
              >
                EN
              </button>
              <button
                onClick={() => dispatch(setLanguage("hi"))}
                className={`px-1.5 py-0.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                  lang === "hi" ? "bg-[#FF6014] text-white shadow-2xs" : "text-slate-500 hover:text-slate-800"
                }`}
                title="हिन्दी"
              >
                हिं
              </button>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3.5 py-2.5 text-slate-600 hover:text-rose-600 w-full rounded-2xl bg-white border border-slate-200/70 hover:border-rose-200 hover:bg-rose-50/50 transition-all duration-200 shadow-xs cursor-pointer group"
          >
            <div className="p-1.5 rounded-xl bg-slate-100 group-hover:bg-rose-100/80 text-slate-500 group-hover:text-rose-600 transition-colors shrink-0">
              <LogOut size={16} />
            </div>
            {!collapsed && (
              <span className="text-xs font-black text-slate-700 group-hover:text-rose-600 transition-colors">
                {lang === "bn" ? "লগআউট" : "Logout"}
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}