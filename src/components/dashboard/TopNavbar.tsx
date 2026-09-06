"use client";

import { Bell, Search, User, ChevronDown, Check, Shield, HardHat, CircleUser, Briefcase, Menu, LogOut, Settings, Languages, X, Calendar, Info, BellRing } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { UserRole, setRole as setAuthRole, getRoleName } from "@/redux/features/auth/authSlice";
import { logout as authLogout } from "@/redux/features/auth/authSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetNotificationsQuery, useMarkNotificationAsReadMutation } from "@/redux/features/notification/notificationApi";
import { useGetAllBookingsQuery } from "@/redux/features/admin/booking";
import { setLanguage, toggleLanguage } from "@/redux/features/shared/langSlice";
import { format } from "date-fns";
import { formatImageUrl } from "@/lib/utils";

export function TopNavbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const authUser = useAppSelector((state) => state.auth.user);
  const role = useAppSelector((state) => state.auth.role) || "client";
  const lang = useAppSelector((state) => state.lang.value);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const roleName = mounted ? getRoleName(role) : (lang === "bn" ? "ক্লায়েন্ট" : "Client");
  const logout = () => dispatch(authLogout());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { data: bookingsRes, isLoading: bookingsLoading } = useGetAllBookingsQuery(undefined, { skip: !mounted });

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'unread' | 'booking' | 'system'>('all');

  const [prevUnreadCount, setPrevUnreadCount] = useState(0);
  const { data: notifications = [], refetch } = useGetNotificationsQuery(undefined, { 
    skip: !mounted,
    pollingInterval: 30000 
  });
  const [markAsRead] = useMarkNotificationAsReadMutation();

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const formatNotificationTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const now = new Date();
      if (d.toDateString() === now.toDateString()) {
        return format(d, "h:mm a");
      }
      if (d.getFullYear() === now.getFullYear()) {
        return format(d, "MMM d");
      }
      return format(d, "MMM d, yyyy");
    } catch (error) {
      return "";
    }
  };

  const getNotificationIcon = (type: string, isRead: boolean) => {
    const normalizedType = type?.toLowerCase() || '';
    const hasUnreadDot = !isRead;
    
    let iconElement = <Info size={18} />;
    let colorClasses = "text-slate-500 bg-slate-50 border border-slate-100";
    
    if (normalizedType.includes('booking')) {
      iconElement = <Calendar size={18} />;
      colorClasses = "text-[#FF6014] bg-[#FFF8F4] border border-[#FF6014]/15";
    } else if (normalizedType.includes('reminder')) {
      iconElement = <BellRing size={18} />;
      colorClasses = "text-blue-500 bg-blue-50 border border-blue-100";
    }

    return (
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 relative ${colorClasses}`}>
        {hasUnreadDot && (
          <span className="absolute -top-0.5 -left-0.5 w-2.5 h-2.5 bg-orange-500 rounded-full border border-white shadow-xs" />
        )}
        {iconElement}
      </div>
    );
  };

  const getNotificationTitle = (type: string) => {
    const normalizedType = type?.toLowerCase() || '';
    if (normalizedType.includes('booking')) {
      return lang === 'bn' ? 'বুকিং আপডেট' : 'Booking Update';
    }
    if (normalizedType.includes('reminder')) {
      return lang === 'bn' ? 'স্মারক' : 'Reminder';
    }
    if (normalizedType.includes('system')) {
      return lang === 'bn' ? 'সিস্টেম এলার্ট' : 'System Alert';
    }
    return lang === 'bn' ? 'নোটিফিকেশন' : 'Notification';
  };

  const filteredNotifications = notifications.filter((n: any) => {
    if (notificationFilter === 'unread') return !n.isRead;
    if (notificationFilter === 'booking') return n.type?.toLowerCase().includes('booking');
    if (notificationFilter === 'system') return !n.type?.toLowerCase().includes('booking');
    return true;
  });

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n: any) => !n.isRead);
    for (const notification of unreadNotifications) {
      try {
        await markAsRead(notification.id).unwrap();
      } catch (err) {
        console.error("Failed to mark notification as read", err);
      }
    }
  };

  useEffect(() => {
    if (unreadCount > prevUnreadCount) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        oscillator.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.1); // A6
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
      } catch (e) {
        console.log("Audio not supported");
      }
    }
    setPrevUnreadCount(unreadCount);
  }, [unreadCount, prevUnreadCount]);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
        setNotificationDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const rolesList: { value: UserRole; label: string; desc: string; icon: React.ComponentType<any>; color: string }[] = [
    { value: "superadmin", label: "Super Admin", desc: "System control", icon: Shield, color: "text-[#FF6014] bg-[#FFF8F4]" },
    { value: "agent", label: "Agent", desc: "Booking agent", icon: Briefcase, color: "text-emerald-500 bg-emerald-50" },
    { value: "vendor", label: "Vendor", desc: "Service professional", icon: HardHat, color: "text-teal-500 bg-teal-50" },
    { value: "client", label: "Client", desc: "Client profile", icon: CircleUser, color: "text-indigo-500 bg-indigo-50" },
  ];

  // Derive display profile from real user data in Redux
  const name = mounted && authUser?.name ? authUser.name : "User";
  const email = mounted ? (authUser?.email || authUser?.phone || "") : "";
  const avatarText = name.substring(0, 2).toUpperCase();
  const profileImg = mounted ? formatImageUrl(authUser?.profile?.avatar || authUser?.profile?.images?.[0] || authUser?.profile?.picture || authUser?.avatar) : undefined;
  const activeRoleConfig = mounted
    ? (rolesList.find((x) => x.value === role) || rolesList[3])
    : rolesList[3];

  return (
    <header className="bg-white/60 backdrop-blur-xl border-b border-[#FF6014]/15 px-4 sm:px-8 py-4 flex items-center justify-between z-30 sticky top-0 shadow-[0_4px_30px_rgba(255,96,20,0.03)]">
      {/* Search Bar */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        <button onClick={onMenuClick} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl md:hidden shrink-0 focus:outline-none transition-colors">
          <Menu size={20} />
        </button>
        <div ref={searchContainerRef} className="relative w-full max-w-md hidden sm:block group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF6014] transition-colors" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            placeholder={lang === "bn" ? "বুকিং আইডি, সার্ভিস, ক্লায়েন্ট খুঁজুন..." : "Search booking ID, service, client..."}
            className="w-full bg-white/70 border border-slate-200/80 hover:border-[#FF6014]/30 rounded-2xl pl-11 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#FF6014]/40 focus:ring-4 focus:ring-[#FF6014]/10 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setShowSearchResults(false);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={14} />
            </button>
          )}

          {showSearchResults && searchQuery && (() => {
            const bookings = bookingsRes?.data || [];
            const results = bookings.filter((b: any) => {
              const q = searchQuery.toLowerCase();
              const matchId = String(b.id).includes(q);
              const matchService = b.service?.name?.toLowerCase().includes(q) || 
                                   b.nestedService?.name?.toLowerCase().includes(q) ||
                                   b.pkg?.name?.toLowerCase().includes(q) ||
                                   b.subServices?.some((s: any) => s.name?.toLowerCase().includes(q));
              const matchUser = b.user?.name?.toLowerCase().includes(q) || 
                                b.user?.email?.toLowerCase().includes(q) ||
                                b.user?.phone?.toLowerCase().includes(q);
              return matchId || matchService || matchUser;
            });

            return (
              <div className="absolute left-0 right-0 mt-2 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 overflow-hidden z-50 max-h-[350px] overflow-y-auto">
                <div className="px-4 py-2.5 bg-white/20 border-b border-white/30 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    {lang === "bn" ? "বুকিং ফলাফল" : "Booking Search Results"}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 bg-white/55 border border-slate-150 px-2 py-0.5 rounded-full shrink-0">
                    {results.length} {lang === "bn" ? "টি পাওয়া গেছে" : "found"}
                  </span>
                </div>
                {bookingsLoading ? (
                  <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-[#FF6014] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-slate-400 font-medium">
                      {lang === "bn" ? "বুকিং খোঁজা হচ্ছে..." : "Searching bookings..."}
                    </span>
                  </div>
                ) : results.length > 0 ? (
                  <div className="p-1.5 space-y-0.5">
                    {results.map((b: any) => {
                      const clientName = b.user?.name || "Guest Visitor";
                      const serviceName = b.service?.name || b.nestedService?.name || b.pkg?.name || "General Service";
                      const statusColors: Record<string, string> = {
                        pending: 'bg-amber-50 text-amber-600',
                        assigned: 'bg-blue-50 text-blue-600',
                        on_the_way: 'bg-purple-50 text-purple-600',
                        completed: 'bg-emerald-50 text-emerald-600',
                        cancelled: 'bg-red-50 text-red-600'
                      };
                      return (
                        <button
                          key={b.id}
                          onClick={() => {
                            setSearchQuery("");
                            setShowSearchResults(false);
                            router.push(`/dashbord/manage-bookings/${b.id}`);
                          }}
                          className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FF6014]/5 transition-all text-left group"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs font-black text-slate-800 truncate group-hover:text-[#FF6014] transition-colors">
                                {serviceName}
                              </span>
                              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full shrink-0">
                                #{b.id}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium truncate">
                              Client: {clientName}
                            </p>
                          </div>
                          <div className="text-right pl-3 shrink-0">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              statusColors[b.status?.toLowerCase()] || 'bg-slate-50 text-slate-600'
                            }`}>
                              {b.status}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400 font-medium">
                    {lang === "bn"
                      ? `"${searchQuery}" এর জন্য কোনো বুকিং পাওয়া যায়নি`
                      : `No bookings found matching "${searchQuery}"`}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Right Navbar Controls */}
      <div className="flex items-center gap-5">

        {/* Language Switcher (3-Way Pill for EN / বাং / हिं) */}
        <div className="flex items-center bg-slate-100/90 p-1 rounded-full border border-slate-200/80 shadow-2xs gap-0.5">
          <Languages size={14} className="text-[#FF6014] ml-1.5 mr-0.5 shrink-0" />
          <button
            onClick={() => dispatch(setLanguage("bn"))}
            className={`px-2 py-0.5 rounded-full text-[10px] font-black transition-all cursor-pointer ${
              lang === "bn"
                ? "bg-[#FF6014] text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
            title="বাংলায় পরিবর্তন করুন"
          >
            বাং
          </button>
          <button
            onClick={() => dispatch(setLanguage("en"))}
            className={`px-2 py-0.5 rounded-full text-[10px] font-black transition-all cursor-pointer ${
              lang === "en"
                ? "bg-[#FF6014] text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
            title="Switch to English"
          >
            EN
          </button>
          <button
            onClick={() => dispatch(setLanguage("hi"))}
            className={`px-2 py-0.5 rounded-full text-[10px] font-black transition-all cursor-pointer ${
              lang === "hi"
                ? "bg-[#FF6014] text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
            title="हिन्दी में बदलें"
          >
            हिं
          </button>
        </div>

        {/* Notifications Button (Rich Animations & Chime Sound) */}
        <div className="relative" ref={notificationDropdownRef}>
          {unreadCount > 0 && (
            <span className="absolute inset-0 rounded-full bg-[#FF6014]/20 animate-ping pointer-events-none" />
          )}
          <button 
            onClick={() => {
              setNotificationDropdownOpen(!notificationDropdownOpen);
              try {
                const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5 chime
                osc.frequency.exponentialRampToValueAtTime(1318.51, audioCtx.currentTime + 0.15); // E6
                gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.25);
              } catch {}
            }}
            className="w-10 h-10 rounded-full bg-slate-100/80 hover:bg-slate-200/80 active:scale-90 transition-all duration-200 flex items-center justify-center relative text-slate-700 border border-slate-200/80 shadow-xs cursor-pointer group"
            aria-label="Notifications"
          >
            <Bell
              size={19}
              className={`transition-all duration-300 ${
                unreadCount > 0 
                  ? "text-[#FF6014] animate-[bounce_1.5s_infinite] group-hover:rotate-12" 
                  : "text-slate-600 group-hover:rotate-12 group-hover:scale-110"
              }`}
            />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-gradient-to-r from-[#FF6014] via-[#FF7C71] to-rose-500 text-[10px] font-black text-white shadow-md border-2 border-white animate-bounce">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          
          {notificationDropdownOpen && (
            <div className="fixed top-[76px] right-4 left-4 sm:absolute sm:top-auto sm:right-0 sm:left-auto sm:w-[400px] bg-white/80 backdrop-blur-xl border border-white/50 rounded-[28px] shadow-2xl shadow-slate-900/5 p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Header */}
              <div className="flex justify-between items-center pb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">
                    {lang === "bn" ? "নোটিফিকেশন" : "Notifications"}
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-[#FF6014] hover:text-[#E0530A] font-extrabold transition-all cursor-pointer"
                    >
                      {lang === "bn" ? "সব পঠিত করুন" : "Mark all as read"}
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setNotificationDropdownOpen(false);
                      router.push('/dashbord/notifications');
                    }}
                    className="text-[11px] font-black text-[#FF6014] hover:bg-[#FFF8F4] border border-[#FF6014]/20 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                  >
                    {lang === "bn" ? "সব দেখুন" : "View All"}
                  </button>
                  <button
                    onClick={() => setNotificationDropdownOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/40 hover:bg-white/60 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
                {([
                  { value: 'all', labelEn: 'All', labelBn: 'সব' },
                  { value: 'unread', labelEn: 'Unread', labelBn: 'অপঠিত' },
                  { value: 'booking', labelEn: 'Bookings', labelBn: 'বুকিং' },
                  { value: 'system', labelEn: 'System', labelBn: 'সিস্টেম' }
                ] as const).map((tab) => {
                  const isActive = notificationFilter === tab.value;
                  return (
                    <button
                      key={tab.value}
                      onClick={() => setNotificationFilter(tab.value)}
                      className={`text-[11px] uppercase tracking-wider font-extrabold px-3.5 py-1.5 rounded-full transition-all shrink-0 active:scale-[0.97] cursor-pointer ${
                        isActive
                          ? "bg-[#FF6014] text-white shadow-xs"
                          : "bg-white/40 hover:bg-white/60 text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {lang === "bn" ? tab.labelBn : tab.labelEn}
                    </button>
                  );
                })}
              </div>

              {/* Notification List */}
              <div className="mt-4 space-y-2.5 max-h-[360px] overflow-y-auto pr-1 custom-sidebar-scrollbar">
                {filteredNotifications.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-sm font-semibold">
                    {lang === "bn" ? "কোনো নোটিফিকেশন পাওয়া যায়নি" : "No notifications found"}
                  </div>
                ) : (
                  filteredNotifications.map((notification) => {
                    const timeStr = formatNotificationTime(notification.createdAt);
                    const titleStr = getNotificationTitle(notification.type);
                    const isUnread = !notification.isRead;
                    return (
                      <div
                        key={notification.id}
                        onClick={() => {
                          if (isUnread) {
                            markAsRead(notification.id);
                          }
                          setNotificationDropdownOpen(false);
                          
                          // Smart Routing logic based on User Role & Message ID
                          const msg = (notification.message || '').toLowerCase();
                          const isBooking = notification.type?.toLowerCase().includes('booking') || msg.includes('booking') || msg.includes('বুকিং');
                          const bookingMatch = notification.message?.match(/#(\d+)/);
                          const bookingId = bookingMatch ? bookingMatch[1] : null;

                          if (isBooking) {
                            if (bookingId && (role === 'superadmin' || role === 'admin' || role === 'employee')) {
                              router.push(`/dashbord/manage-bookings/${bookingId}`);
                            } else if (role === 'client') {
                              router.push('/dashbord/overview');
                            } else if (role === 'vendor') {
                              router.push('/dashbord/vendor-bookings');
                            } else {
                              router.push('/dashbord/manage-bookings');
                            }
                          } else {
                            router.push('/dashbord/notifications');
                          }
                        }}
                        className={`group p-3.5 rounded-[20px] transition-all duration-200 border flex gap-3.5 items-start cursor-pointer relative ${
                          isUnread
                            ? "bg-white/60 border-orange-100/50 hover:bg-white/80 hover:border-orange-200/70 shadow-xs"
                            : "bg-white/30 border-transparent hover:bg-white/50 hover:border-white/40"
                        }`}
                      >
                        {/* Circular Icon Container */}
                        {getNotificationIcon(notification.type, notification.isRead)}

                        {/* Content Area */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider truncate">
                              {titleStr}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 shrink-0">
                              {timeStr}
                            </span>
                          </div>
                          <p className={`text-xs leading-relaxed line-clamp-2 ${
                            isUnread ? 'text-slate-900 font-extrabold' : 'text-slate-500 font-semibold'
                          }`}>
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              
              {/* Bottom Footer Button */}
              <div className="mt-3 pt-3 border-t border-slate-100/80 text-center">
                <button
                  onClick={() => {
                    setNotificationDropdownOpen(false);
                    router.push('/dashbord/notifications');
                  }}
                  className="text-xs font-black text-[#FF6014] hover:underline cursor-pointer"
                >
                  {lang === "bn" ? "সবগুলো নোটিফিকেশন পেজে দেখুন →" : "View All Notifications Page →"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Info & Dropdown */}
        <div className="relative" ref={profileDropdownRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-3 pl-4 border-l border-slate-200/70 text-left hover:opacity-95 transition-all active:scale-[0.98] focus:outline-none cursor-pointer group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-slate-900 leading-tight group-hover:text-[#FF6014] transition-colors">{name}</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="inline-block text-[9px] font-black text-[#FF6014] uppercase tracking-wider bg-[#FFF8F4] border border-[#FF6014]/20 px-2 py-0.5 rounded-full leading-none">
                  {roleName}
                </span>
              </div>
            </div>
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF6014] to-[#FF8142] p-0.5 shadow-md shadow-[#FF6014]/20 shrink-0 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-white rounded-[14px] overflow-hidden flex items-center justify-center font-black text-xs text-[#FF6014] select-none">
                {profileImg ? (
                  <img src={profileImg} alt={name} className="w-full h-full object-cover" />
                ) : (
                  avatarText
                )}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white/85 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">

              {/* User Info Header */}
              <div className="px-4 py-3 border-b border-white/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#FF6014] to-[#FF6014] text-white font-bold rounded-xl flex items-center justify-center overflow-hidden shadow-md shadow-[#FF6014]/20 select-none shrink-0">
                    {profileImg ? (
                      <img src={profileImg} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      avatarText
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate leading-none">{name}</p>
                    {email && (
                      <p className="text-xs text-slate-400 mt-1 truncate leading-none">{email}</p>
                    )}
                    <span className={`inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold rounded-full ${activeRoleConfig.color}`}>
                      {roleName}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-1 space-y-0.5">
                <Link
                  href="/dashbord/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full flex items-center gap-3 p-2 rounded-xl text-left text-sm text-slate-700 hover:bg-white/40 transition-all"
                >
                  <div className="p-1.5 rounded-lg bg-white/50 text-slate-500">
                    <User size={16} />
                  </div>
                  <span className="font-medium">{lang === "bn" ? "আমার প্রোফাইল" : "My Profile"}</span>
                </Link>

                <Link
                  href="/dashbord/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full flex items-center gap-3 p-2 rounded-xl text-left text-sm text-slate-700 hover:bg-white/40 transition-all"
                >
                  <div className="p-1.5 rounded-lg bg-white/50 text-slate-500">
                    <Settings size={16} />
                  </div>
                  <span className="font-medium">{lang === "bn" ? "সেটিংস" : "Settings"}</span>
                </Link>

                <div className="my-1 border-t border-white/30" />

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-xl text-left text-sm text-[#E0530A] hover:bg-white/40 transition-all"
                >
                  <div className="p-1.5 rounded-lg bg-white/50 text-[#FF6014]">
                    <LogOut size={16} />
                  </div>
                  <span className="font-semibold">{lang === "bn" ? "লগআউট" : "Sign Out"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}