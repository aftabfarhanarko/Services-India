"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";
import { uploadImage } from "@/lib/upload";
import { useCreateNestedServiceMutation } from "@/redux/features/admin/service";
import { useGetAllServicesQuery } from "@/redux/features/admin/service";
import { Sparkles, PlusCircle, Trash2, Image as ImageIcon, ArrowLeft, X, Layers, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CustomSelect } from "@/components/ui/select";
import RichTextEditor from "@/components/ui/RichTextEditor";
import Link from "next/link";

export default function CreateNestedServicePage() {
  const router = useRouter();
  const rawRole = useAppSelector((state) => state.auth.role) || "superadmin";
  const role = typeof rawRole === "string" ? rawRole.toLowerCase().replace(/\s+/g, "") : "client";
  const currentUser = useAppSelector((state) => state.auth.user);
  const currentUserId = currentUser?.id || currentUser?._id || "";

  const { data: apiServicesRes } = useGetAllServicesQuery();
  const [createMut, { isLoading: isCreating }] = useCreateNestedServiceMutation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [isContactForPrice, setIsContactForPrice] = useState(false);
  const [subServices, setSubServices] = useState<{ 
    name: string; 
    price: string; 
    is_contact_for_price?: boolean;
    agent_commission_percentage: string; 
    vendor_commission_percentage: string;
    description: string;
    image1: string;
    image2: string;
    faq: { question: string; answer: string }[];
  }[]>([]);
  const [serviceId, setServiceId] = useState("NONE");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // All services for the dropdown
  const allServices = apiServicesRes?.data || (Array.isArray(apiServicesRes) ? apiServicesRes : []);

  // Filter services for vendor — only their own
  const serviceOptions = (() => {
    const base =
      role === "vendor"
        ? allServices.filter((s: any) => String(s.vendor?.id || s.vendor_id) === String(currentUserId))
        : allServices;
    return [
      { value: "NONE", label: "মূল সার্ভিস নির্বাচন করুন" },
      ...base.map((s: any) => ({
        value: String(s.id),
        label: s.name,
        desc: s.subtitle || s.slug,
      })),
    ];
  })();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const url = await uploadImage(file);
      setImage(url);
      toast.success("ছবি আপলোড সফল হয়েছে!");
    } catch (err: any) {
      toast.error(err.message || "ছবি আপলোড করতে ব্যর্থ হয়েছে");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("নেস্টেড সার্ভিসের নাম প্রয়োজন");
      return;
    }
    if (serviceId === "NONE") {
      toast.error("অনুগ্রহ করে একটি মূল সার্ভিস নির্বাচন করুন");
      return;
    }

    try {
      const payload: any = {
        service_id: Number(serviceId),
        name: name.trim(),
        description: description.trim() || undefined,
        image: image.trim() || undefined,
        sub_services: subServices
          .filter((s) => s.name.trim() !== "")
          .map((s) => {
            const subObj: any = {
              name: s.name.trim(),
              price: !s.is_contact_for_price ? Number(s.price || 0) : 0,
              agent_commission_percentage: Number(s.agent_commission_percentage || 0),
              vendor_commission_percentage: Number(s.vendor_commission_percentage || 0),
              description: s.description.trim() || undefined,
              image1: s.image1.trim() || undefined,
              image2: s.image2.trim() || undefined,
              faq: s.faq.filter(f => f.question.trim() !== "" && f.answer.trim() !== "")
            };
            if (s.is_contact_for_price) {
              subObj.is_contact_for_price = true;
            }
            return subObj;
          }),
      };

      if (isContactForPrice) {
        payload.is_contact_for_price = true;
      } else if (price !== "") {
        payload.starting_price = Number(price);
      }

      await createMut(payload).unwrap();
      toast.success("নেস্টেড সার্ভিস সফলভাবে তৈরি হয়েছে!");
      router.push("/dashbord/nested-services");
    } catch (err: any) {
      toast.error(err.data?.message || err.message || "নেস্টেড সার্ভিস তৈরি করতে ব্যর্থ হয়েছে");
    }
  };

  if (role !== "superadmin" && role !== "vendor") {
    return (
      <div className="p-8 text-center">
        <h3 className="text-xl font-bold text-slate-800">প্রবেশাধিকার নেই</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
        <Link
          href="/dashbord/nested-services"
          className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Layers className="text-[#FF6014]" size={20} /> নতুন সাব-সার্ভিস যোগ করুন
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">আপনার মূল সার্ভিসের অধীনে নতুন একটি সাব-সার্ভিস যোগ করুন।</p>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 mb-6 flex gap-4 items-start shadow-sm">
        <div className="bg-indigo-100 text-indigo-600 p-2 rounded-xl mt-0.5 shrink-0">
          <Info size={20} />
        </div>
        <div className="text-sm text-indigo-900 space-y-2 leading-relaxed">
          <h4 className="font-bold text-base text-indigo-800">কীভাবে সাব-সার্ভিস তৈরি করবেন?</h4>
          <p>১. <strong>সাধারণ তথ্য:</strong> উপরের অংশে মূল নেস্টেড সার্ভিসের নাম, ক্যাটাগরি, শুরুর মূল্য এবং ছবি যুক্ত করুন।</p>
          <p>২. <strong>সাব-সার্ভিসেস / অপশনসমূহ:</strong> নিচের অংশে <strong>"+ অপশন যোগ করুন"</strong> বাটনে ক্লিক করে নির্দিষ্ট অপশন তৈরি করুন (যেমন: 1 Ton AC, 2 Ton AC)।</p>
          <p>৩. <strong>প্রতিটি অপশনের বিবরণ:</strong> প্রতিটি অপশন কার্ডে তার নির্দিষ্ট নাম, মূল্য, কমিশন, ডেসক্রিপশন, ছবি এবং ঐচ্ছিক FAQs যুক্ত করুন।</p>
          <p>৪. <strong>পাবলিশ:</strong> সব তথ্য পূরণ হলে একদম নিচের <strong>সেভ করুন</strong> বাটনে ক্লিক করুন।</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                মূল সার্ভিস (Parent Service) *
              </label>
              <CustomSelect options={serviceOptions} value={serviceId} onChange={setServiceId} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                সাব-সার্ভিস নাম *
              </label>
              <Input
                placeholder="যেমন: ফিল্টার রিপ্লেসমেন্ট"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  শুরুর মূল্য (Starting Price - ₹)
                </label>
                <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-bold text-[#FF6014] select-none bg-orange-50/80 px-2 py-0.5 rounded-lg border border-orange-100">
                  <input
                    type="checkbox"
                    checked={isContactForPrice}
                    onChange={(e) => setIsContactForPrice(e.target.checked)}
                    className="w-3.5 h-3.5 accent-[#FF6014] rounded cursor-pointer"
                  />
                  <span>যোগাযোগের মাধ্যমে (Contact for Price)</span>
                </label>
              </div>
              {isContactForPrice ? (
                <div className="w-full bg-amber-50/80 border border-amber-200 rounded-xl px-4 py-3 text-xs font-bold text-amber-800 flex items-center gap-2">
                  <span>📞 সরাসরি যোগাযোগের মাধ্যমে সার্ভিস মূল্য নির্ধারণ (Contact for Price)</span>
                </div>
              ) : (
                <Input
                  type="number"
                  placeholder="যেমন: ৫০০"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min={0}
                />
              )}
            </div>
          </div>

          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                অপশন / সাব-সার্ভিসেস
              </label>
              <button
                type="button"
                onClick={() => setSubServices([...subServices, { name: "", price: "", is_contact_for_price: false, agent_commission_percentage: "", vendor_commission_percentage: "", description: "", image1: "", image2: "", faq: [] }])}
                className="text-xs font-bold text-[#FF6014] flex items-center gap-1 hover:underline"
              >
                <PlusCircle size={14} /> অপশন যোগ করুন
              </button>
            </div>
            {subServices.length === 0 ? (
              <p className="text-xs text-slate-400 italic">এখনো কোনো অপশন যোগ করা হয়নি। 'অপশন যোগ করুন' ক্লিক করুন।</p>
            ) : (
              <div className="space-y-3">
                {subServices.map((sub, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-white space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-slate-700">অপশন {idx + 1}</h4>
                      <div className="flex items-center gap-3">
                        <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-600 select-none bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                          <input
                            type="checkbox"
                            checked={sub.is_contact_for_price || false}
                            onChange={(e) => {
                              const newSubs = [...subServices];
                              newSubs[idx].is_contact_for_price = e.target.checked;
                              setSubServices(newSubs);
                            }}
                            className="w-3.5 h-3.5 accent-[#FF6014] rounded cursor-pointer"
                          />
                          <span>Contact for Price</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setSubServices(subServices.filter((_, i) => i !== idx))}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="অপশনের নাম (যেমন: ১ টন)"
                        value={sub.name}
                        onChange={(e) => {
                          const newSubs = [...subServices];
                          newSubs[idx].name = e.target.value;
                          setSubServices(newSubs);
                        }}
                      />
                      {sub.is_contact_for_price ? (
                        <div className="w-full bg-amber-50/80 border border-amber-200 rounded-xl px-3 py-2 text-xs font-bold text-amber-800 flex items-center gap-1.5">
                          <span>📞 Contact for Price (ম্যানুয়াল মূল্য)</span>
                        </div>
                      ) : (
                        <Input
                          type="number"
                          placeholder="মূল্য (₹)"
                          value={sub.price}
                          onChange={(e) => {
                            const newSubs = [...subServices];
                            newSubs[idx].price = e.target.value;
                            setSubServices(newSubs);
                          }}
                          min={0}
                        />
                      )}
                      {role === "superadmin" && (
                        <>
                          <Input
                            type="number"
                            placeholder="এজেন্ট কমিশন (%)"
                            value={sub.agent_commission_percentage}
                            onChange={(e) => {
                              const newSubs = [...subServices];
                              newSubs[idx].agent_commission_percentage = e.target.value;
                              setSubServices(newSubs);
                            }}
                            min={0}
                          />
                          <Input
                            type="number"
                            placeholder="ভেন্ডর কমিশন (%)"
                            value={sub.vendor_commission_percentage}
                            onChange={(e) => {
                              const newSubs = [...subServices];
                              newSubs[idx].vendor_commission_percentage = e.target.value;
                              setSubServices(newSubs);
                            }}
                            min={0}
                          />
                        </>
                      )}
                    </div>
                    
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">বিবরণ</label>
                        <RichTextEditor
                          value={sub.description}
                          onChange={(val) => {
                            const newSubs = [...subServices];
                            newSubs[idx].description = val;
                            setSubServices(newSubs);
                          }}
                          placeholder="সাব-সার্ভিস সম্পর্কে বিস্তারিত..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 border border-dashed border-slate-300 rounded-xl p-4 relative group">
                        <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-2">
                           <ImageIcon size={14} /> ছবি ১ <span className="text-[9px] text-slate-400 font-normal">(সর্বোচ্চ ৬ এমবি)</span>
                        </label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            if (e.target.files?.[0]) {
                              const url = await uploadImage(e.target.files[0]);
                              if (url) {
                                const newSubs = [...subServices];
                                newSubs[idx].image1 = url;
                                setSubServices(newSubs);
                              }
                            }
                          }}
                        />
                        {sub.image1 && <img src={sub.image1} alt="Image 1" className="mt-2 h-20 w-full object-cover rounded-md border" />}
                      </div>
                      <div className="space-y-2 border border-dashed border-slate-300 rounded-xl p-4 relative group">
                        <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-2">
                           <ImageIcon size={14} /> ছবি ২ <span className="text-[9px] text-slate-400 font-normal">(সর্বোচ্চ ৬ এমবি)</span>
                        </label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            if (e.target.files?.[0]) {
                              const url = await uploadImage(e.target.files[0]);
                              if (url) {
                                const newSubs = [...subServices];
                                newSubs[idx].image2 = url;
                                setSubServices(newSubs);
                              }
                            }
                          }}
                        />
                        {sub.image2 && <img src={sub.image2} alt="Image 2" className="mt-2 h-20 w-full object-cover rounded-md border" />}
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-500 uppercase">সাধারণ জিজ্ঞাসা (FAQs)</label>
                        <button
                          type="button"
                          onClick={() => {
                            const newSubs = [...subServices];
                            newSubs[idx].faq.push({ question: "", answer: "" });
                            setSubServices(newSubs);
                          }}
                          className="text-xs font-bold text-[#FF6014] flex items-center gap-1"
                        >
                          <PlusCircle size={12} /> FAQ যোগ করুন
                        </button>
                      </div>
                      {sub.faq.map((f, fIdx) => (
                        <div key={fIdx} className="flex gap-2">
                          <Input
                            placeholder="প্রশ্ন"
                            value={f.question}
                            onChange={(e) => {
                              const newSubs = [...subServices];
                              newSubs[idx].faq[fIdx].question = e.target.value;
                              setSubServices(newSubs);
                            }}
                          />
                          <Input
                            placeholder="উত্তর"
                            value={f.answer}
                            onChange={(e) => {
                              const newSubs = [...subServices];
                              newSubs[idx].faq[fIdx].answer = e.target.value;
                              setSubServices(newSubs);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newSubs = [...subServices];
                              newSubs[idx].faq = newSubs[idx].faq.filter((_, i) => i !== fIdx);
                              setSubServices(newSubs);
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              ডেসক্রিপশন
            </label>
            <RichTextEditor
              value={description}
              onChange={setDescription}
              placeholder="এই সাব-সার্ভিসটি সম্পর্কে বর্ণনা করুন..."
              minHeight={150}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              সাব-সার্ভিস ছবি
            </label>
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="w-20 h-20 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 relative group shadow-sm">
                {image ? (
                  <>
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImage("")}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-150 rounded-2xl"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                ) : (
                  <ImageIcon className="text-slate-400" size={24} />
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <label className="cursor-pointer bg-[#FF6014] hover:bg-[#E0530A] text-white text-xs font-bold px-4 py-2.5 rounded-lg inline-flex items-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-[#FF6014]/10">
                  {isUploadingImage ? "আপলোড হচ্ছে..." : "ছবি বাছুন"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploadingImage}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-slate-400">স্কোয়ার (Square) সাইজের ছবি ব্যবহার করার পরামর্শ দেওয়া হচ্ছে (সর্বোচ্চ ৬ এমবি)।</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/dashbord/nested-services")}
              className="px-6 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
            >
              বাতিল করুন
            </button>
            <button
              type="submit"
              disabled={isCreating || isUploadingImage}
              className="bg-[#FF6014] hover:bg-[#E0530A] disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl text-sm transition-all active:scale-[0.98] shadow-md shadow-[#FF6014]/10"
            >
              {isCreating ? "তৈরি হচ্ছে..." : "তৈরি করুন"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
