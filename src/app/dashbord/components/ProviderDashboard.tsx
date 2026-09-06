"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppSelector } from "@/redux/hooks";
import {
  useGetAllProfilesQuery,
  useCreateProfileMutation,
  useUpdateProfileMutation,
} from "@/redux/features/shared/profileApi";
import { useGetAllCategoriesQuery } from "@/redux/features/admin/category";
import {
  useGetAllBookingsQuery,
  useUpdateBookingStatusMutation,
  useAssignEmployeeToBookingMutation,
} from "@/redux/features/admin/booking";
import { useGetEmployeesByVendorQuery } from "@/redux/features/admin/user";
import { useGetNotificationsQuery, useMarkNotificationAsReadMutation } from "@/redux/features/notification/notificationApi";
import { toast } from "sonner";
import {
  DollarSign,
  CheckCircle2,
  Calendar,
  Star,
  MapPin,
  ChevronRight,
  Phone,
  Building,
  Briefcase,
  FileText,
  Globe,
  Languages,
  Users,
  X,
  Bell
} from "lucide-react";

// Basic translations for the dashboard
const dashboardTranslations = {
  bn: {
    providerMode: "প্রোভাইডার মোড",
    dashboardTitle: "প্রোভাইডার ড্যাশবোর্ড",
    hello: "হ্যালো,",
    subtitle: "আপনার অ্যাক্টিভ শিডিউল এবং উপার্জন ম্যানেজ করুন।",
    online: "অনলাইন এবং অ্যাভেইলেবল",
    toggleOffline: "অফলাইন করুন",
    todaysEarnings: "আজকের আয়",
    fromCompleted: "কমপ্লিট বুকিং থেকে",
    projectsCompleted: "প্রজেক্ট সম্পন্ন হয়েছে",
    totalProjects: "মোট প্রজেক্ট সম্পন্ন",
    startingPrice: "শুরুর মূল্য",
    minPrice: "সর্বনিম্ন শুরুর মূল্য",
    myRating: "আমার রেটিং",
    professionalProfile: "প্রফেশনাল প্রোফাইল",
    myJobSchedule: "আমার জব শিডিউল",
    jobConsole: "জব কনসোল",
    updateStatusOf: "বর্তমান স্ট্যাটাস আপডেট করুন: বুকিং",
    clientContact: "ক্লাইন্ট কন্টাক্ট",
    updateStatus: "স্ট্যাটাস আপডেট",
    onTheWay: "অন দ্য ওয়ে",
    markCompleted: "কমপ্লিট মার্ক করুন",
    cancelBooking: "বুকিং বাতিল করুন",
    jobCompletedSuccess: "জব সফলভাবে সম্পন্ন হয়েছে!",
    businessProfile: "বিজনেস প্রোফাইল",
    manageBusinessProfile: "আপনার কমার্শিয়াল প্রোফাইল ডিটেইলস ম্যানেজ করুন",
    edit: "এডিট",
    saveDetails: "সেভ করুন",
    cancel: "বাতিল",
    setupProfileNow: "প্রোফাইল সেটআপ করুন",
    setupProfilePrompt: "আপনি এখনও আপনার বিজনেস প্রোফাইল সেটআপ করেননি। বুকিং পেতে প্রোফাইল সেটআপ সম্পূর্ণ করুন!",
    profileType: "প্রোফাইলের ধরন",
    companyName: "কোম্পানি/বিজনেস নাম",
    businessCategory: "বিজনেস ক্যাটাগরি",
    serviceLocation: "সার্ভিস লোকেশন",
    businessDescription: "বিজনেস ডেসক্রিপশন",
    googleMapsLink: "গুগল ম্যাপস লিংক",
    personal: "পার্সোনাল",
    company: "কোম্পানি",
    selectCategory: "ক্যাটাগরি নির্বাচন করুন",
    assignEmployee: "এমপ্লয়ি অ্যাসাইন করুন",
    selectEmployee: "এমপ্লয়ি নির্বাচন করুন",
    assign: "অ্যাসাইন করুন",
    noEmployeesFound: "কোনো এমপ্লয়ি পাওয়া যায়নি",
    assignedEmployee: "অ্যাসাইনকৃত এমপ্লয়ি",
    totalRevenue: "মোট আয়",
  },
  en: {
    providerMode: "Provider Mode",
    dashboardTitle: "Provider Dashboard",
    hello: "Hello,",
    subtitle: "Manage your active schedules and monitor earnings.",
    online: "Online & Available",
    toggleOffline: "Toggle Offline",
    todaysEarnings: "Today's Earnings",
    fromCompleted: "From completed bookings",
    projectsCompleted: "Projects completed",
    totalProjects: "Total projects completed",
    startingPrice: "Starting Price",
    minPrice: "Minimum starting price",
    myRating: "My Rating",
    professionalProfile: "Professional Profile",
    myJobSchedule: "My Job Schedule",
    jobConsole: "Job Console",
    updateStatusOf: "Update current status of Booking",
    clientContact: "Client Contact",
    updateStatus: "Update Status",
    onTheWay: "On The Way",
    markCompleted: "Mark as Completed",
    cancelBooking: "Cancel Booking",
    jobCompletedSuccess: "Job Completed successfully!",
    businessProfile: "Business Profile",
    manageBusinessProfile: "Manage your commercial profile details",
    edit: "Edit",
    saveDetails: "Save Details",
    cancel: "Cancel",
    setupProfileNow: "Set Up Profile Now",
    setupProfilePrompt: "You haven't set up your business profile yet. Complete your profile setup to receive bookings!",
    profileType: "Profile Type",
    companyName: "Company/Business Name",
    businessCategory: "Business Category",
    serviceLocation: "Service Location",
    businessDescription: "Business Description",
    googleMapsLink: "Google Maps Link",
    personal: "Personal",
    company: "Company",
    selectCategory: "Select a Category",
    assignEmployee: "Assign Employee",
    selectEmployee: "Select Employee",
    assign: "Assign",
    noEmployeesFound: "No employees found",
    assignedEmployee: "Assigned Employee",
    totalRevenue: "Total Revenue",
  }
};

export default function ProviderDashboard() {
  const authUser = useAppSelector((state) => state.auth.user);
  const { data: profilesRes } = useGetAllProfilesQuery();
  const { data: categoriesRes } = useGetAllCategoriesQuery();
  const { data: employeesRes } = useGetEmployeesByVendorQuery(authUser?.id as any, { skip: !authUser?.id });
  const { data: notificationsRes } = useGetNotificationsQuery(undefined, {
    pollingInterval: 30000, // Poll every 30s
  });
  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();

  const [createProfileMut, { isLoading: isCreating }] = useCreateProfileMutation();
  const [updateProfileMut, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [assignEmployeeMut, { isLoading: isAssigning }] = useAssignEmployeeToBookingMutation();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [prevUnreadCount, setPrevUnreadCount] = useState(0);
  const [lang, setLang] = useState<"bn" | "en">("bn");
  const t = dashboardTranslations[lang];

  const myProfile = profilesRes?.data?.find(
    (p: any) =>
      p.user?.id === authUser?.id ||
      p.user?.id === Number(authUser?.id) ||
      p.user_id === authUser?.id ||
      p.user_id === Number(authUser?.id)
  );

  const [updateBookingStatus] = useUpdateBookingStatusMutation();
  const { data: bookingsRes } = useGetAllBookingsQuery(undefined);
  const myBookings =
    bookingsRes?.data?.filter(
      (b: any) =>
        b.vendor?.id === authUser?.id || b.vendor?.id === Number(authUser?.id)
    ) || [];
  const completedBookings = myBookings.filter((b: any) => b.status === "completed");
  const todayEarnings = completedBookings.reduce((sum, b) => {
    const completedDate = new Date(b.updatedAt).toDateString();
    const today = new Date().toDateString();
    if (completedDate === today) {
      return sum + Number(b.total_price || 0);
    }
    return sum;
  }, 0);
  
  const totalRevenue = completedBookings.reduce((sum, b) => sum + Number(b.total_price || 0), 0);

  const stats = [
    {
      label: t.todaysEarnings,
      value: `₹${todayEarnings.toLocaleString()}`,
      desc: t.fromCompleted,
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: t.totalRevenue,
      value: `₹${totalRevenue.toLocaleString()}`,
      desc: t.fromCompleted,
      icon: DollarSign,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: t.projectsCompleted,
      value: completedBookings.length.toString(),
      desc: t.totalProjects,
      icon: CheckCircle2,
      color: "text-teal-600 bg-teal-50",
    },
    {
      label: t.myRating,
      value: myProfile?.rating !== undefined ? `${myProfile.rating} / 5` : "New",
      desc: myProfile?.company_name || t.professionalProfile,
      icon: Star,
      color: "text-amber-600 bg-amber-50",
    },
  ];

  const providerJobs = myBookings.map((b: any) => ({
    id: String(b.id),
    customer: b.user?.name || "Unknown Customer",
    phone: b.user?.phone || "N/A",
    address: b.location || "N/A",
    service: b.nestedService?.name || b.pkg?.name || "Service",
    time: `${b.date || ""} ${b.time || ""}`,
    amount: `₹${Number(b.total_price || 0).toLocaleString()}`,
    status: b.status,
    employees: b.employees || [],
  }));

  const [activeJob, setActiveJob] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = providerJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(providerJobs.length / jobsPerPage);

  const notifications = notificationsRes || [];
  const unreadNotifications = notifications.filter((n: any) => !n.isRead && n.userId === authUser?.id);
  const unreadCount = unreadNotifications.length;

  // Play sound when new notification arrives
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

  useEffect(() => {
    if (!activeJob && providerJobs.length > 0) {
      setActiveJob(providerJobs[0].id);
    }
  }, [providerJobs, activeJob]);

  const updateJobStatus = async (id: string, newStatus: string) => {
    try {
      await updateBookingStatus({ id, status: newStatus.toLowerCase().replace(/\s+/g, "_") }).unwrap();
      toast.success(`Booking ${id} status updated to ${newStatus}`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  const activeJobDetails = providerJobs.find((j) => j.id === activeJob);

  const handleAssignEmployee = async () => {
    if (!activeJob || selectedEmployeeIds.length === 0) {
      toast.error(lang === "bn" ? "দয়া করে এমপ্লয়ি নির্বাচন করুন" : "Please select an employee");
      return;
    }
    try {
      await assignEmployeeMut({ id: activeJob, employee_ids: selectedEmployeeIds }).unwrap();
      toast.success(lang === "bn" ? "এমপ্লয়ি সফলভাবে অ্যাসাইন করা হয়েছে" : "Employees assigned successfully");
      setIsEmployeeModalOpen(false);
      setSelectedEmployeeIds([]);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to assign employees");
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const profileData: any = {
      type: formData.get("type") as "personal" | "company",
      company_name: (formData.get("company_name") as string) || undefined,
      description: (formData.get("description") as string) || undefined,
      location: (formData.get("location") as string) || undefined,
      min_starting_price: formData.get("min_starting_price")
        ? Number(formData.get("min_starting_price"))
        : undefined,
      google_map_link: (formData.get("google_map_link") as string) || undefined,
      category_id: formData.get("category_id") ? Number(formData.get("category_id")) : undefined,
    };

    try {
      if (myProfile) {
        await updateProfileMut({ id: myProfile.id, data: profileData }).unwrap();
        toast.success("Business profile updated successfully!");
        setIsEditingProfile(false);
      } else {
        profileData.user_id = Number(authUser?.id);
        await createProfileMut(profileData).unwrap();
        toast.success("Business profile created successfully!");
        setIsCreatingProfile(false);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save profile. Please check validation.");
      console.error(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-7"
    >
      {/* ── Light Primary Glassmorphism Header ── */}
      <motion.div
        whileHover={{ y: -2 }}
        className="relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-3xl border border-orange-100/90 shadow-sm px-7 py-6.5 group hover:shadow-xl hover:shadow-[#FF6014]/5 transition-all duration-300"
      >
        {/* Language Toggle */}
        <div className="absolute top-6 right-7 z-20 flex items-center gap-3">
          <button
            onClick={() => setLang(lang === "bn" ? "en" : "bn")}
            className="flex items-center gap-1.5 bg-orange-50/80 hover:bg-orange-100/80 text-[#FF6014] px-3.5 py-1.5 rounded-full text-xs font-black border border-orange-200/60 shadow-2xs transition-colors cursor-pointer"
          >
            <Languages className="w-3.5 h-3.5 text-[#FF6014]" />
            {lang === "bn" ? "English" : "বাংলা"}
          </button>
        </div>

        <div className="absolute -top-10 -right-10 w-52 h-52 bg-gradient-to-br from-[#FF6014]/15 to-[#FFB3AD]/10 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-gradient-to-tr from-amber-100/40 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-[70%] space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-orange-50/90 border border-orange-200/60 text-[#FF6014] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6014] animate-ping inline-block" />
              {t.providerMode}
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t.dashboardTitle}</h1>
            <p className="text-slate-500 text-sm font-semibold flex items-center gap-1.5">
              <Briefcase size={14} className="text-[#FF6014]" />
              {t.hello}{" "}
              <span className="text-slate-900 font-extrabold text-wrap">
                {authUser?.name || myProfile?.company_name || "Provider"}
              </span>
              ! {t.subtitle}
            </p>
          </div>

          {/* Status info toggle */}
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md border border-slate-100 p-3 rounded-2xl shadow-2xs shrink-0 md:mt-10 lg:mt-0 lg:mr-28">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-black text-slate-800">{t.online}</span>
            <button className="text-xs font-extrabold text-[#FF6014] bg-[#FFF8F4] hover:bg-[#FFF0EB] px-3 py-1.5 rounded-xl border border-orange-100 transition-all cursor-pointer">
              {t.toggleOffline}
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Stats Cards Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              whileHover={{ y: -3, scale: 1.015 }}
              className="group bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-2xl border border-slate-100/90 shadow-sm flex items-start gap-3 sm:gap-4 hover:shadow-xl hover:shadow-[#FF6014]/5 hover:border-[#FF6014]/20 transition-all duration-300 cursor-pointer"
            >
              <div
                className={`p-2.5 sm:p-3 rounded-xl border ${stat.color} group-hover:scale-110 transition-transform duration-200 shrink-0`}
              >
                <Icon size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wider truncate">{stat.label}</p>
                <h4 className="text-lg sm:text-2xl font-black text-slate-900 mt-0.5 leading-tight tracking-tight">
                  {stat.value}
                </h4>
                <span className="text-[10px] sm:text-xs text-slate-400 mt-1 block font-extrabold leading-tight">
                  {stat.desc}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Jobs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Jobs List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-slate-900">{t.myJobSchedule}</h3>

          <div className="space-y-4">
            {currentJobs.map((job: any) => {
              const currentStatus = job.status;
              return (
                <div
                  key={job.id}
                  onClick={() => setActiveJob(job.id)}
                  className={`p-4 border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md cursor-pointer transition-all ${
                    activeJob === job.id ? "border-[#FF6014]/40 bg-[#FFF8F4]/20" : "border-slate-100"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#FF6014]">#{job.id}</span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          currentStatus === "completed"
                            ? "bg-emerald-50 text-emerald-700"
                            : currentStatus === "on_the_way"
                            ? "bg-indigo-50 text-indigo-700"
                            : currentStatus === "assigned"
                            ? "bg-amber-50 text-amber-700"
                            : currentStatus === "cancelled"
                            ? "bg-red-50 text-red-700"
                            : "bg-slate-50 text-slate-700"
                        }`}
                      >
                        {currentStatus.replace(/_/g, " ")}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-800">{job.service}</h4>
                    <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <MapPin size={14} /> {job.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">{job.amount}</p>
                      <p className="text-xs text-slate-400">{job.time}</p>
                    </div>
                    <ChevronRight size={18} className="text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <span className="text-xs font-bold text-slate-500">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {activeJobDetails && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-950">{t.jobConsole}</h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  {t.updateStatusOf} {activeJobDetails.id}
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{t.clientContact}</p>
                  <h5 className="text-sm font-bold text-slate-850">{activeJobDetails.customer}</h5>
                  <p className="text-xs font-semibold text-[#FF6014] flex items-center gap-1">
                    <Phone size={12} /> {activeJobDetails.phone}
                  </p>
                </div>

                {/* Assign Employee Section */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{t.assignedEmployee}</p>
                  
                  {activeJobDetails.employees && activeJobDetails.employees.length > 0 ? (
                    <div className="space-y-2">
                      {activeJobDetails.employees.map((emp: any) => (
                        <div key={emp.id} className="flex items-center gap-2">
                          <Users size={14} className="text-slate-400" />
                          <span className="text-sm font-semibold text-slate-700">{emp.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 font-medium">{t.noEmployeesFound}</p>
                  )}

                  {activeJobDetails.status !== "completed" && activeJobDetails.status !== "cancelled" && (
                    <button
                      onClick={() => setIsEmployeeModalOpen(true)}
                      className="w-full py-2 bg-white border border-slate-200 hover:border-[#FF6014]/50 rounded-lg text-xs font-semibold text-slate-700 hover:text-[#FF6014] transition-all flex justify-center items-center gap-1.5"
                    >
                      <Users size={14} /> {t.assignEmployee}
                    </button>
                  )}
                </div>

                <div className="space-y-2 pt-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.updateStatus}</p>
                  {activeJobDetails.status !== "completed" && activeJobDetails.status !== "cancelled" ? (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => updateJobStatus(activeJobDetails.id, "On The Way")}
                        className={`w-full py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                          activeJobDetails.status === "on_the_way"
                            ? "bg-amber-500 border-amber-500 text-white"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        {t.onTheWay}
                      </button>
                      <button
                        onClick={() => updateJobStatus(activeJobDetails.id, "Completed")}
                        className="w-full py-2.5 rounded-xl text-xs font-semibold border transition-all border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 text-slate-700"
                      >
                        {t.markCompleted}
                      </button>
                      <button
                        onClick={() => updateJobStatus(activeJobDetails.id, "Cancelled")}
                        className="w-full py-2.5 rounded-xl text-xs font-semibold border transition-all border-slate-200 hover:bg-red-50 hover:text-red-600 text-red-505 text-red-600"
                      >
                        {t.cancelBooking}
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-center text-xs font-semibold flex items-center justify-center gap-1.5">
                      <CheckCircle2 size={16} /> {t.jobCompletedSuccess}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Business Profile Console */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{t.businessProfile}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{t.manageBusinessProfile}</p>
              </div>
              {!isEditingProfile && !isCreatingProfile && myProfile && (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="text-xs font-semibold text-[#FF6014] hover:text-[#E0530A] px-3 py-1.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-100/50 transition-colors"
                >
                  {t.edit}
                </button>
              )}
            </div>

            {isEditingProfile || isCreatingProfile || !myProfile ? (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                {!myProfile && !isCreatingProfile && (
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl space-y-2">
                    <p className="text-xs text-amber-800 font-semibold leading-relaxed">
                      {t.setupProfilePrompt}
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsCreatingProfile(true)}
                      className="text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg transition-all"
                    >
                      {t.setupProfileNow}
                    </button>
                  </div>
                )}

                {(isCreatingProfile || myProfile) && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                          {t.profileType}
                        </label>
                        <select
                          name="type"
                          defaultValue={myProfile?.type || "personal"}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-850 focus:outline-none focus:border-[#FF6014]/40"
                          required
                        >
                          <option value="personal">{t.personal}</option>
                          <option value="company">{t.company}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                          {t.startingPrice} (₹)
                        </label>
                        <input
                          name="min_starting_price"
                          type="number"
                          placeholder="800"
                          defaultValue={myProfile?.min_starting_price}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-850 focus:outline-none focus:border-[#FF6014]/40"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                        {t.companyName}
                      </label>
                      <input
                        name="company_name"
                        type="text"
                        placeholder="e.g. Rana AC Services"
                        defaultValue={myProfile?.company_name}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-850 focus:outline-none focus:border-[#FF6014]/40"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                        {t.businessCategory}
                      </label>
                      <select
                        name="category_id"
                        defaultValue={myProfile?.category?.id || ""}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-850 focus:outline-none focus:border-[#FF6014]/40"
                      >
                        <option value="">{t.selectCategory}</option>
                        {categoriesRes?.data?.map((cat: any) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                        {t.serviceLocation}
                      </label>
                      <input
                        name="location"
                        type="text"
                        placeholder="e.g. Mirpur, Dhaka"
                        defaultValue={myProfile?.location}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-850 focus:outline-none focus:border-[#FF6014]/40"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                        {t.businessDescription}
                      </label>
                      <textarea
                        name="description"
                        rows={3}
                        placeholder="Describe your expertise and service quality..."
                        defaultValue={myProfile?.description}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-850 focus:outline-none focus:border-[#FF6014]/40"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                        {t.googleMapsLink}
                      </label>
                      <input
                        name="google_map_link"
                        type="url"
                        placeholder="https://maps.google.com/..."
                        defaultValue={myProfile?.google_map_link}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-850 focus:outline-none focus:border-[#FF6014]/40"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        disabled={isCreating || isUpdating}
                        className="flex-1 py-2 bg-[#FF6014] hover:bg-[#E0530A] text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                      >
                        {isCreating || isUpdating ? "Saving..." : t.saveDetails}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingProfile(false);
                          setIsCreatingProfile(false);
                        }}
                        className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 transition-all"
                      >
                        {t.cancel}
                      </button>
                    </div>
                  </>
                )}
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#FFF8F4] rounded-xl flex items-center justify-center text-[#FF6014] font-bold shrink-0">
                    <Building size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-850">{myProfile.company_name}</h4>
                    <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-500 capitalize">
                      {myProfile.type}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 text-xs">
                  <div className="flex items-start gap-2.5">
                    <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-750">{t.serviceLocation}</p>
                      <p className="text-slate-500">{myProfile.location || "Not provided"}</p>
                    </div>
                  </div>

                  {myProfile.category && (
                    <div className="flex items-start gap-2.5">
                      <Briefcase size={14} className="text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-750">{t.businessCategory}</p>
                        <p className="text-slate-500">{myProfile.category.name}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-2.5">
                    <FileText size={14} className="text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-750">{t.businessDescription}</p>
                      <p className="text-slate-500 leading-relaxed">{myProfile.description || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <DollarSign size={14} className="text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-750">{t.minPrice}</p>
                      <p className="text-slate-500">₹{myProfile.min_starting_price || "Not set"}</p>
                    </div>
                  </div>

                  {myProfile.google_map_link && (
                    <div className="flex items-start gap-2.5">
                      <Globe size={14} className="text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-750">{t.googleMapsLink}</p>
                        <a
                          href={myProfile.google_map_link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#FF6014] hover:underline font-semibold"
                        >
                          View on Google Maps
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Employee Assignment Modal */}
      {isEmployeeModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Users size={18} className="text-[#FF6014]" />
                {t.assignEmployee}
              </h3>
              <button 
                onClick={() => {
                  setIsEmployeeModalOpen(false);
                  setSelectedEmployeeIds([]);
                }}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {employeesRes?.data && employeesRes.data.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    {t.selectEmployee}
                  </p>
                  {employeesRes.data.map((emp: any) => {
                    const isSelected = selectedEmployeeIds.includes(emp.id);
                    return (
                      <div 
                        key={emp.id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedEmployeeIds(prev => prev.filter(id => id !== emp.id));
                          } else {
                            setSelectedEmployeeIds(prev => [...prev, emp.id]);
                          }
                        }}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                          isSelected 
                            ? "border-[#FF6014] bg-[#FFF8F4] shadow-sm" 
                            : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 shrink-0">
                          <Users size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{emp.name}</p>
                          <p className="text-xs text-slate-500">{emp.email || "No email"}</p>
                        </div>
                        {isSelected && (
                          <div className="ml-auto text-[#FF6014]">
                            <CheckCircle2 size={18} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-3">
                    <Users size={24} />
                  </div>
                  <p className="text-slate-500 font-medium">{t.noEmployeesFound}</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsEmployeeModalOpen(false);
                  setSelectedEmployeeIds([]);
                }}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleAssignEmployee}
                disabled={selectedEmployeeIds.length === 0 || isAssigning}
                className="px-6 py-2 text-sm font-bold text-white bg-[#FF6014] hover:bg-[#E0530A] rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isAssigning ? "..." : t.assign}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
