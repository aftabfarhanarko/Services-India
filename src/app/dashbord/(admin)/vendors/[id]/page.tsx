"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetUserByIdQuery } from "@/redux/features/admin/user";
import { useGetAllServicesQuery } from "@/redux/features/admin/service";
import { ArrowLeft, User, Mail, Phone, MapPin, Tag, Wrench, Package, Briefcase, Info, Globe } from "lucide-react";
import Image from "next/image";

export default function VendorDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: userRes, isLoading: isUserLoading, error } = useGetUserByIdQuery(id, { skip: !id });
  const { data: servicesRes, isLoading: isServicesLoading } = useGetAllServicesQuery();

  const vendor = userRes?.data || userRes;
  const profile = vendor?.profile;

  const allServices = servicesRes?.data || (Array.isArray(servicesRes) ? servicesRes : []);
  const vendorServices = allServices.filter((s: any) => s.vendor?.id?.toString() === id || s.vendor?.id === Number(id));

  if (isUserLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center">
        <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-400 font-medium">Loading vendor details...</p>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center">
        <h3 className="text-xl font-bold text-slate-800">Vendor Not Found</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm mb-6">
          The vendor you are looking for does not exist.
        </p>
        <button onClick={() => router.push("/dashbord/vendors")} className="bg-brand-primary hover:bg-brand-dark text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md flex items-center gap-2">
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200 pb-12">
      {/* Header Navigation */}
      <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
        <button onClick={() => router.push("/dashbord/vendors")} className="p-2 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded-xl transition-all">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vendor Profile</h1>
          <p className="text-sm text-slate-500">Details & Services for {vendor.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Vendor Profile Data */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 bg-[#FFF0EB] text-[#E0530A] rounded-full flex items-center justify-center font-black text-3xl shadow-inner relative">
              {vendor.name?.substring(0, 2).toUpperCase() || "UU"}
              <span className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-white flex items-center justify-center text-[10px] text-white ${vendor.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                {vendor.status === 'active' ? '✓' : '!'}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">{vendor.name}</h3>
              <span className="text-xs font-semibold text-[#FF6014] bg-[#FFF8F4] px-2.5 py-0.5 rounded-lg mt-1 inline-block capitalize">
                {vendor.role?.name || "Vendor"}
              </span>
            </div>

            <div className="w-full pt-4 border-t border-slate-50 space-y-3 text-sm font-medium text-slate-600 text-left">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-slate-400 shrink-0" />
                <span className="truncate">{vendor.email || "No Email"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-slate-400 shrink-0" />
                <span>{vendor.phone || "No Phone"}</span>
              </div>
            </div>
          </div>

          {/* Profile Additional Data */}
          {profile && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                <Info size={18} className="text-brand-primary" /> Professional Info
              </h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type</p>
                  <p className="font-semibold text-slate-700 text-sm capitalize">{profile.type}</p>
                </div>
                {profile.company_name && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Company</p>
                    <p className="font-semibold text-slate-700 text-sm">{profile.company_name}</p>
                  </div>
                )}
                {profile.category && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</p>
                    <div className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-600">
                      <Tag size={12} /> {profile.category.name}
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</p>
                  <p className="font-semibold text-slate-700 text-sm flex items-center gap-1">
                    <MapPin size={14} className="text-slate-400" /> {profile.location || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Min Starting Price</p>
                  <p className="font-semibold text-brand-primary text-sm">
                    {profile.min_starting_price ? `₹${profile.min_starting_price}` : "Negotiable"}
                  </p>
                </div>
                {profile.description && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</p>
                    <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{profile.description}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Vendor Services */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Briefcase size={20} className="text-brand-primary" /> Services Offered
              </h3>
              <span className="bg-brand-primary/10 text-brand-primary font-bold text-xs px-3 py-1 rounded-full">
                {vendorServices.length} Services
              </span>
            </div>

            {isServicesLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin mb-3" />
                <p className="text-sm font-medium">Loading services...</p>
              </div>
            ) : vendorServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vendorServices.map((service: any) => (
                  <div key={service.id} onClick={() => router.push(`/dashbord/services/${service.id}`)} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:border-brand-primary/40 cursor-pointer group flex flex-col">
                    <div className="h-32 w-full bg-slate-100 relative overflow-hidden">
                      {service.image ? (
                        <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Wrench size={32} />
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h4 className="text-base font-bold text-slate-800 leading-tight mb-1 group-hover:text-brand-primary transition-colors">{service.name}</h4>
                      {service.category?.name && (
                        <span className="text-[10px] font-bold text-slate-400 uppercase mb-2 inline-block">
                          {service.category.name}
                        </span>
                      )}
                      <div className="mt-auto pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs font-semibold text-slate-600">
                        <div className="bg-slate-50 rounded-lg py-1.5 flex flex-col items-center justify-center">
                          <Package size={14} className="mb-0.5 text-slate-400" />
                          {service.packages?.length || 0} Pkgs
                        </div>
                        <div className="bg-slate-50 rounded-lg py-1.5 flex flex-col items-center justify-center">
                          <Briefcase size={14} className="mb-0.5 text-slate-400" />
                          {service.nestedServices?.length || 0} Nested
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-50 border border-slate-100 rounded-2xl border-dashed">
                <Wrench size={48} className="text-slate-300 mb-3" />
                <h4 className="font-bold text-slate-700 mb-1">No Services Yet</h4>
                <p className="text-sm text-slate-500 max-w-xs">This vendor hasn't been assigned any services to offer.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
