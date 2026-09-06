"use client";

import { useState, useMemo } from "react";
import { ShieldAlert, Wallet, RefreshCw, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import WithdrawDetailModal from "./components/WithdrawDetailModal";
import WithdrawActionModal from "./components/WithdrawActionModal";
import WithdrawTable from "./components/WithdrawTable";
import { useWithdrawState } from "./hooks/useWithdrawState";

const staggerContainer: any = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardFadeUp: any = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function AdminWithdrawPage() {
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const {
    role,
    isLoading,
    refetch,
    withdraws = [],
    selectedItem,
    setSelectedItem,
    actionModal,
    setActionModal,
    handleUpdateStatus,
    handleDelete,
    totalPending,
    totalApproved,
    totalAmount,
    isUpdating,
  } = useWithdrawState();

  const filteredWithdraws = useMemo(() => {
    if (!withdraws) return [];
    if (activeTab === "all") return withdraws;
    return withdraws.filter((w) => w.status === activeTab);
  }, [withdraws, activeTab]);

  if (role !== "superadmin") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center animate-in fade-in duration-200">
        <div className="p-4 bg-[#FFF8F4] rounded-2xl text-[#FF6014] mb-4">
          <ShieldAlert size={48} />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Access Denied</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">This panel is restricted to Administrators only.</p>
      </div>
    );
  }

  const stats = [
    {
      label: "Pending",
      value: totalPending,
      icon: Clock,
      gradient: "from-amber-500/10 to-transparent",
      bgLight: "bg-amber-50 border-amber-100/80 text-amber-600",
      borderColor: "hover:border-amber-200/70",
      shadow: "hover:shadow-amber-500/5 hover:shadow-xl",
      textClass: "text-amber-600",
    },
    {
      label: "Approved",
      value: totalApproved,
      icon: CheckCircle2,
      gradient: "from-emerald-500/10 to-transparent",
      bgLight: "bg-emerald-50 border-emerald-100/80 text-emerald-600",
      borderColor: "hover:border-emerald-200/70",
      shadow: "hover:shadow-emerald-500/5 hover:shadow-xl",
      textClass: "text-emerald-600",
    },
    {
      label: "Total Paid Out",
      value: `₹${totalAmount.toLocaleString()}`,
      icon: TrendingUp,
      gradient: "from-indigo-500/10 to-transparent",
      bgLight: "bg-indigo-50 border-indigo-100/80 text-indigo-600",
      borderColor: "hover:border-indigo-200/70",
      shadow: "hover:shadow-indigo-500/5 hover:shadow-xl",
      textClass: "text-slate-900",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FFF8F4] text-[#FF6014] rounded-2xl">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Withdraw Requests</h1>
            <p className="text-xs text-slate-400 mt-0.5">Review and manage vendor payout requests.</p>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold px-4 py-2.5 rounded-xl text-sm transition-all border border-slate-200"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-3 gap-5"
      >
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              variants={cardFadeUp}
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => {
                if (i === 0) setActiveTab("pending");
                else if (i === 1) setActiveTab("approved");
                else setActiveTab("all");
              }}
              className={`group cursor-pointer bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden flex items-center justify-between ${stat.borderColor}`}
            >
              <div className={`absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br ${stat.gradient} rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
              
              <div className="space-y-1.5 z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {stat.label}
                </p>
                <h4 className={`text-3xl font-black ${stat.textClass} tracking-tight`}>
                  {stat.value}
                </h4>
              </div>
              
              <div className={`p-4 rounded-2xl border ${stat.bgLight} shrink-0 transition-all duration-300 group-hover:scale-110 shadow-xs z-10`}>
                <Icon className="w-6 h-6" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Tabs Filter Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs overflow-x-auto">
        <div className="flex items-center gap-1.5">
          {[
            { id: "all", label: "All Requests", count: withdraws.length, icon: Wallet },
            { id: "pending", label: "Pending Approval", count: totalPending, icon: Clock, badgeBg: "bg-amber-100 text-amber-800" },
            { id: "approved", label: "Approved Payouts", count: totalApproved, icon: CheckCircle2, badgeBg: "bg-emerald-100 text-emerald-800" },
            { id: "rejected", label: "Rejected Requests", count: withdraws.filter(w => w.status === 'rejected').length, icon: ShieldAlert, badgeBg: "bg-rose-100 text-rose-800" }
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-[#FF6014] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                }`}
              >
                <TabIcon size={14} />
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  isActive ? "bg-white/20 text-white" : tab.badgeBg || "bg-slate-100 text-slate-700"
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Withdraw Requests Divided Cards Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm">
          <div className="w-8 h-8 border-4 border-[#FF6014] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredWithdraws.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center shadow-xs">
          <div className="w-16 h-16 bg-[#FFF8F4] text-[#FF6014] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#FF6014]/20">
            <Wallet size={28} />
          </div>
          <h3 className="text-base font-black text-slate-800">No {activeTab} Requests</h3>
          <p className="text-xs text-slate-500 font-semibold mt-1">There are currently no withdrawal requests in this status category.</p>
        </div>
      ) : (
        <motion.div
          key={activeTab}
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredWithdraws.map((item) => {
            const statusMap: Record<string, { bg: string; text: string; icon: any; border: string; headerBg: string }> = {
              pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", headerBg: "bg-amber-50/50", icon: Clock },
              approved: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", headerBg: "bg-emerald-50/40", icon: CheckCircle2 },
              rejected: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", headerBg: "bg-rose-50/40", icon: ShieldAlert },
            };
            const currentStatus = statusMap[item.status] || { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", headerBg: "bg-slate-50", icon: Clock };
            const StatusIcon = currentStatus.icon;

            return (
              <motion.div
                key={item.id}
                variants={cardFadeUp}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Top Section Header */}
                <div className={`p-5 border-b border-slate-100 ${currentStatus.headerBg}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-white text-[#FF6014] border border-slate-200 flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                        {item.vendor?.name?.charAt(0)?.toUpperCase() || "V"}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-black text-slate-900 truncate">{item.vendor?.name || "Unknown Vendor"}</h4>
                        <p className="text-[11px] text-slate-500 font-semibold truncate">{item.vendor?.email || "No email"}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shrink-0 ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border}`}>
                      <StatusIcon size={12} />
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-3.5">
                  <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-xs text-slate-500 font-bold">Payout Amount</span>
                    <span className="text-lg font-black text-emerald-600">₹{(item.amount || 0).toLocaleString()}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-black uppercase">Booking Ref</p>
                      <p className="font-black text-slate-900 mt-0.5">{item.booking?.id ? `#${item.booking.id}` : "Manual"}</p>
                    </div>

                    <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-black uppercase">Gateway Method</p>
                      <p className="font-black text-slate-900 mt-0.5 truncate uppercase">{item.getway?.getway_type || "N/A"}</p>
                    </div>
                  </div>

                  {item.booking?.service?.name && (
                    <div className="p-3 bg-indigo-50/40 rounded-xl border border-indigo-100">
                      <p className="text-[10px] text-indigo-500 font-black uppercase">Service Context</p>
                      <p className="font-extrabold text-slate-900 truncate mt-0.5">{item.booking.service.name}</p>
                    </div>
                  )}
                </div>

                {/* Footer Action Bar */}
                <div className="p-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-500 font-black">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                  </span>

                  <div className="flex items-center gap-2">
                    {item.status === "pending" && (
                      <>
                        <button
                          onClick={() => setActionModal({ type: "approved", item })}
                          className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black transition-all shadow-xs active:scale-95 cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setActionModal({ type: "rejected", item })}
                          className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-black transition-all shadow-xs active:scale-95 cursor-pointer"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-black transition-all active:scale-95 cursor-pointer shadow-xs"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Detail Modal */}
      <WithdrawDetailModal
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        isUpdating={isUpdating}
        handleUpdateStatus={handleUpdateStatus}
        handleDelete={handleDelete}
      />

      {/* Action Modal (Approve/Reject from Table) */}
      <WithdrawActionModal
        actionModal={actionModal}
        setActionModal={setActionModal}
        isUpdating={isUpdating}
        handleUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
