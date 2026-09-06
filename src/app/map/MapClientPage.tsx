"use client";

import dynamic from "next/dynamic";
import { Search, SlidersHorizontal, Map as MapIcon, List as ListIcon, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SidebarList from "@/components/home/map/SidebarList";
import FilterSidebar from "@/components/home/map/FilterSidebar";
import ExpertCard from "@/components/home/map/ExpertCard";
import FiltersModal from "@/components/home/map/FiltersModal";
import DetailModal from "@/components/home/map/DetailModal";
import { useMapState } from "@/app/map/hooks/useMapState";
import "@/components/home/map/leaflet-custom.css";

const DhakaMap = dynamic(() => import("@/components/home/map/DhakaMap"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 min-h-[480px] md:min-h-[600px] md:h-full rounded-3xl border border-slate-200 bg-slate-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6014]" />
        <p className="text-xs font-bold text-slate-400">Loading map...</p>
      </div>
    </div>
  ),
});

export default function MapClientPage() {
  const {
    isProfilesLoading, filteredExperts, categories, activeTab, setActiveTab,
    searchQuery, setSearchQuery, selectedCategory, setSelectedCategory,
    selectedExpertId, setSelectedExpertId, sortBy, setSortBy,
    tempPriceRange, setTempPriceRange, tempMinRating, setTempMinRating,
    showFiltersModal, setShowFiltersModal, detailExpert, setDetailExpert,
    handleApplyFilters, handleClearFilters,
  } = useMapState();

  if (isProfilesLoading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0" style={{ backgroundSize: 'auto' }} />
        <div className="flex flex-col items-center gap-3 relative z-10">
          <Loader2 className="w-10 h-10 animate-spin text-[#FF6014]" />
          <p className="text-sm font-semibold text-slate-500">Loading vendor profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans relative">
      <div className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0" style={{ backgroundSize: 'auto' }} />
      <div className="flex-1 flex flex-col relative z-10">
        {activeTab === "map" && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 w-full flex-1 flex flex-col gap-4 md:gap-5 py-4 md:py-5 h-auto md:h-[calc(100vh-72px)] md:min-h-[720px] md:overflow-hidden relative">
            {/* Professional Help Header Section (Ultra-Premium Glassmorphism) */}
            <div className="relative bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_12px_36px_0_rgba(255,96,20,0.06)] p-4 sm:p-5 md:p-6 rounded-2xl md:rounded-[32px] flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-5 shrink-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#FF6014]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-start gap-3.5 relative z-10">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/80 backdrop-blur-md border border-[#FF6014]/25 flex items-center justify-center text-[#FF6014] shrink-0 shadow-[0_4px_20px_rgba(255,96,20,0.15)] group">
                  <MapIcon className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-slate-900 flex flex-wrap items-center gap-2">
                    Live Vendor <span className="bg-gradient-to-r from-[#FF6014] to-amber-500 bg-clip-text text-transparent">Locator Map</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-[#FF6014]/15 text-[#FF6014] uppercase tracking-wider border border-[#FF6014]/30 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6014] animate-ping" />
                      Live
                    </span>
                  </h1>
                  <p className="text-xs md:text-sm text-slate-500 font-semibold mt-0.5 md:mt-1 leading-relaxed">
                    Locate verified service professionals, check starting rates, and book verified partners in your area.
                  </p>
                </div>
              </div>

              {/* Instructions/Help guide (Ultra-Premium Glass Pills) */}
              <div className="flex flex-wrap items-center gap-2 md:gap-3.5 lg:justify-end text-[10px] sm:text-[11px] font-bold text-slate-700 bg-white/60 backdrop-blur-md p-2 md:p-3 rounded-xl md:rounded-2xl border border-white/80 shadow-xs relative z-10">
                <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-white/80 border border-[#FF6014]/15 shadow-2xs">
                  <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-r from-[#FF6014] to-amber-500 text-white flex items-center justify-center font-black text-[9px] sm:text-[10px] shadow-xs">1</span>
                  <span className="font-extrabold text-slate-800">Select Category</span>
                </div>
                <div className="h-3.5 w-px bg-slate-200/80 hidden sm:block" />
                <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-white/80 border border-[#FF6014]/15 shadow-2xs">
                  <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-r from-[#FF6014] to-amber-500 text-white flex items-center justify-center font-black text-[9px] sm:text-[10px] shadow-xs">2</span>
                  <span className="font-extrabold text-slate-800">Tap Location Pin</span>
                </div>
                <div className="h-3.5 w-px bg-slate-200/80 hidden sm:block" />
                <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-white/80 border border-[#FF6014]/15 shadow-2xs">
                  <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-r from-[#FF6014] to-amber-500 text-white flex items-center justify-center font-black text-[9px] sm:text-[10px] shadow-xs">3</span>
                  <span className="font-extrabold text-slate-800">Click 'View Profile' & Book</span>
                </div>
              </div>
            </div>

            {/* Sidebar + Map Container (Sticky Map & Independent Scrollable Left Cards) */}
            <div className="flex-1 grid md:grid-cols-12 gap-4 md:gap-6 items-start relative overflow-visible">
              <div className="order-2 md:order-1 md:col-span-4 lg:col-span-4 h-auto md:h-full md:max-h-[calc(100vh-140px)] flex flex-col">
                <SidebarList searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} categories={categories} activeTab={activeTab} setActiveTab={setActiveTab} filteredExperts={filteredExperts} selectedExpertId={selectedExpertId} setSelectedExpertId={setSelectedExpertId} onOpenFilters={() => setShowFiltersModal(true)} onViewDetails={setDetailExpert} />
              </div>
              <div className="order-1 md:order-2 md:col-span-8 lg:col-span-8 md:sticky md:top-4 h-[380px] sm:h-[450px] md:h-[calc(100vh-140px)] min-h-[350px]">
                <DhakaMap filteredExperts={filteredExperts} selectedExpertId={selectedExpertId} setSelectedExpertId={setSelectedExpertId} onViewDetails={setDetailExpert} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "list" && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16 lg:py-20 flex-1 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-10 items-center md:items-start text-center md:text-left">
              <div className="flex flex-col items-center md:items-start">
                <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Available Experts</h1>
                <p className="text-slate-500 mt-2 text-xs md:text-sm font-semibold max-w-md">Discover verified vendors across Kolkata & West Bengal on the live service map.</p>
              </div>
              <div className="bg-slate-100 p-1 rounded-full flex items-center w-40 border border-slate-200/50 shadow-xs shrink-0">
                <Button variant="ghost" onClick={() => setActiveTab("map")} className="flex-1 py-1.5 h-auto rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-slate-500 hover:text-slate-800">
                  <MapIcon className="w-3.5 h-3.5" />Map
                </Button>
                <Button onClick={() => setActiveTab("list")} className="flex-1 py-1.5 h-auto rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-[#FF6014] hover:bg-[#FF6014]/90 text-white shadow-sm">
                  <ListIcon className="w-3.5 h-3.5" />List
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
              <FilterSidebar sortBy={sortBy} setSortBy={setSortBy} tempPriceRange={tempPriceRange} setTempPriceRange={setTempPriceRange} tempMinRating={tempMinRating} setTempMinRating={setTempMinRating} onApplyFilters={handleApplyFilters} onClearFilters={handleClearFilters} />

              <div className="lg:hidden flex items-center gap-3 w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search vendors or categories..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400" />
                </div>
                <Button variant="outline" onClick={() => setShowFiltersModal(true)} className="bg-white border border-slate-200 p-2.5 h-auto rounded-xl text-slate-700 flex items-center gap-1 text-sm font-bold shadow-xs cursor-pointer hover:bg-slate-50">
                  <SlidersHorizontal className="w-4 h-4" />Filters
                </Button>
              </div>

              <div className="col-span-1 lg:col-span-3 space-y-6">
                {filteredExperts.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                    <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-800">No available experts</h3>
                    <p className="text-sm text-slate-500 mt-2">Adjust your filters or search to discover vendors near you.</p>
                    <Button onClick={handleClearFilters} className="mt-6 px-6 py-2.5 h-auto bg-[#FF6014] text-white font-bold rounded-xl text-sm shadow-xs hover:bg-[#E0530A] transition-colors cursor-pointer">Clear Filters</Button>
                  </div>
                ) : (
                  filteredExperts.map((expert) => (
                    <ExpertCard key={expert.id} expert={expert} onViewDetails={() => setDetailExpert(expert)} />
                  ))
                )}
                {filteredExperts.length > 0 && (
                  <div className="flex justify-center pt-6">
                    <p className="text-sm font-semibold text-slate-400">Showing {filteredExperts.length} vendor{filteredExperts.length === 1 ? "" : "s"}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <FiltersModal isOpen={showFiltersModal} onClose={() => setShowFiltersModal(false)} tempPriceRange={tempPriceRange} setTempPriceRange={setTempPriceRange} tempMinRating={tempMinRating} setTempMinRating={setTempMinRating} sortBy={sortBy} setSortBy={setSortBy} onApplyFilters={handleApplyFilters} onClearFilters={handleClearFilters} />
      <DetailModal expert={detailExpert} onClose={() => setDetailExpert(null)} />
    </div>
  );
}
