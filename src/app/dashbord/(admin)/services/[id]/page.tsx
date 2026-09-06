"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetServiceByIdQuery } from "@/redux/features/admin/service";
import { ArrowLeft, Tag, Globe, User, Users, Briefcase, Wrench, Package } from "lucide-react";
import Image from "next/image";
import { formatImageUrl } from "@/lib/utils";

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: serviceRes, isLoading, error } = useGetServiceByIdQuery(id, {
    skip: !id,
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center">
        <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-400 font-medium">Loading service details...</p>
      </div>
    );
  }

  const service = serviceRes?.data;

  if (error || !service) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center">
        <h3 className="text-xl font-bold text-slate-800">Service Not Found</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm mb-6">
          The service you are looking for does not exist or has been deleted.
        </p>
        <button
          onClick={() => router.push("/dashbord/services")}
          className="bg-brand-primary hover:bg-brand-dark text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200 pb-12">
      {/* Header Navigation */}
      <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
        <button
          onClick={() => router.push("/dashbord/services")}
          className="p-2 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded-xl transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Service Details</h1>
          <p className="text-sm text-slate-500">Overview of {service.name}</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Image & Basic Info */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="h-48 w-full bg-slate-100 relative">
              {service.image ? (
                <img src={formatImageUrl(service.image)} alt={service.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <Wrench size={48} />
                </div>
              )}
            </div>
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold text-slate-900">{service.name}</h2>
              {service.subtitle && <p className="text-slate-500 font-medium text-sm mt-1">{service.subtitle}</p>}
              <div className="mt-4 inline-flex items-center gap-1.5 bg-slate-50 text-slate-600 font-mono font-bold text-xs px-3 py-1.5 rounded-xl border border-slate-200/60">
                <Globe size={14} /> /{service.slug}
              </div>
            </div>
          </div>

          {/* Quick Stats / Relations */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 space-y-4">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Properties</h3>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                <Tag size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</p>
                <p className="font-semibold text-slate-700 text-sm">{service.category?.name || "Unassigned"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                <User size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vendor</p>
                <p className="font-semibold text-slate-700 text-sm">{service.vendor?.name || "No Vendor"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Descriptions & Lists */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Wrench size={18} className="text-brand-primary" /> Service Description
            </h3>
            {service.description ? (
              /<[a-z]/.test(service.description) ? (
                <div
                  className="text-slate-600 text-sm leading-relaxed rich-content"
                  dangerouslySetInnerHTML={{ __html: service.description }}
                />
              ) : (
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{service.description}</p>
              )
            ) : (
              <p className="text-slate-400 text-sm italic">No description provided.</p>
            )}
          </div>

          {/* Assigned Employees */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Users size={18} className="text-brand-primary" /> Assigned Employees
            </h3>
            {service.employees && service.employees.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.employees.map((emp: any) => (
                  <div key={emp.id} className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 bg-white shadow-sm border border-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center shrink-0 text-sm">
                      {emp.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-slate-900 text-sm truncate">{emp.name}</p>
                      <p className="text-xs text-slate-500 truncate">{emp.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-slate-50 border border-slate-100 rounded-2xl border-dashed">
                <p className="text-sm text-slate-400 font-medium">No employees assigned to this service yet.</p>
              </div>
            )}
          </div>

          {/* Packages Grid */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Package size={18} className="text-brand-primary" /> Available Packages
            </h3>
            {service.packages && service.packages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {service.packages.map((pkg: any) => (
                  <div key={pkg.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:border-brand-primary/30 transition-all hover:shadow-md group">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-primary mb-4 group-hover:scale-110 transition-transform">
                      <Package size={18} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 mb-1">{pkg.name}</h4>
                    {pkg.description && <p className="text-xs text-slate-500 mb-4 line-clamp-2">{pkg.description}</p>}
                    
                    {pkg.features && pkg.features.length > 0 && (
                      <ul className="space-y-1 mb-4 mt-2">
                        {pkg.features.map((feature: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
                            <span className="text-brand-primary mt-0.5">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-auto pt-4 border-t border-slate-200/60">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1">Price</span>
                      <span className="text-lg font-black text-brand-primary">₹{pkg.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-slate-50 border border-slate-100 rounded-2xl border-dashed">
                <p className="text-sm text-slate-400 font-medium italic">No packages available.</p>
              </div>
            )}
          </div>

          {/* Nested Services Grid */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Briefcase size={18} className="text-brand-primary" /> Included Services
            </h3>
            {service.nestedServices && service.nestedServices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {service.nestedServices.map((ns: any) => (
                  <div key={ns.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:border-brand-primary/30 group flex flex-col">
                    <div className="h-32 w-full bg-slate-100 relative overflow-hidden">
                      {ns.image ? (
                        <img src={formatImageUrl(ns.image)} alt={ns.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Briefcase size={32} />
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h4 className="text-sm font-bold text-slate-800 leading-tight mb-1">{ns.name}</h4>
                      {ns.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2 mb-3">{ns.description}</p>}
                      <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Starting Price</span>
                        <span className="text-sm font-black text-brand-primary">
                          {ns.starting_price ? `₹${ns.starting_price}` : "Variable"}
                        </span>
                      </div>
                      {ns.subServices && ns.subServices.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-100 border-dashed">
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Options</p>
                          <div className="grid grid-cols-1 gap-2">
                            {ns.subServices.map((sub: any) => (
                              <div key={sub.id} className="flex flex-col bg-slate-50 border border-slate-100 rounded-xl p-3 hover:border-brand-primary/20 transition-colors">
                                <span className="text-xs font-bold text-slate-700 leading-tight mb-1">{sub.name}</span>
                                <span className="text-sm font-black text-brand-primary">₹{sub.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-slate-50 border border-slate-100 rounded-2xl border-dashed">
                <p className="text-sm text-slate-400 font-medium italic">No nested services included.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
