import React, { useState, useEffect } from 'react';
import { X, UserCheck, CheckCircle2 } from 'lucide-react';
import { useAssignEmployeeToBookingMutation } from '@/redux/features/admin/booking';
import { useGetEmployeesByVendorQuery } from '@/redux/features/admin/user';
import { toast } from 'sonner';

import { Language } from '@/redux/features/shared/langSlice';

interface AssignEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  handleStatusChange: (id: number, status: string) => void;
  lang: Language | string;
}

const translations = {
  bn: {
    assignEmployees: "এমপ্লয়ি অ্যাসাইন করুন",
    selectEmployeesFor: "এই বুকিংয়ের জন্য যে এমপ্লয়িরা",
    service: "সার্ভিসটি",
    willPerform: "সম্পন্ন করবেন, তাদের নির্বাচন করুন।",
    noEmployees: "এই ভেন্ডরের অধীনে কোনো এমপ্লয়ি পাওয়া যায়নি।",
    noPhone: "ফোন নম্বর নেই",
    cancel: "ক্যান্সেল",
    assigning: "অ্যাসাইন করা হচ্ছে...",
    confirmAssignment: "কনফার্ম করুন",
    selectAtLeastOne: "অনুগ্রহ করে অন্তত একজন এমপ্লয়ি সিলেক্ট করুন।",
    successMsg: "সফলভাবে এমপ্লয়ি অ্যাসাইন করা হয়েছে!",
    failMsg: "এমপ্লয়ি অ্যাসাইন করতে ব্যর্থ হয়েছে।",
    errorMsg: "অ্যাসাইন করার সময় একটি ত্রুটি ঘটেছে।"
  },
  en: {
    assignEmployees: "Assign Employees",
    selectEmployeesFor: "Select the employees who will perform",
    service: "the service",
    willPerform: "for this booking.",
    noEmployees: "No employees available under this vendor.",
    noPhone: "No phone number",
    cancel: "Cancel",
    assigning: "Assigning...",
    confirmAssignment: "Confirm Assignment",
    selectAtLeastOne: "Please select at least one employee.",
    successMsg: "Employees assigned successfully!",
    failMsg: "Failed to assign employees.",
    errorMsg: "Something went wrong during assignment."
  },
  hi: {
    assignEmployees: "कर्मचारी आवंटित करें",
    selectEmployeesFor: "इस बुकिंग के लिए उन कर्मचारियों का चयन करें",
    service: "जो सेवा",
    willPerform: "पूरा करेंगे।",
    noEmployees: "इस विक्रेता के तहत कोई कर्मचारी उपलब्ध नहीं है।",
    noPhone: "कोई फोन नंबर नहीं",
    cancel: "रद्द करें",
    assigning: "आवंटित किया जा रहा है...",
    confirmAssignment: "पुष्टि करें",
    selectAtLeastOne: "कृपया कम से कम एक कर्मचारी का चयन करें।",
    successMsg: "कर्मचारियों को सफलतापूर्वक आवंटित किया गया!",
    failMsg: "कर्मचारियों को आवंटित करने में विफल।",
    errorMsg: "आवंटन के दौरान कुछ त्रुटि हुई।"
  }
};

export default function AssignEmployeeModal({ isOpen, onClose, booking, handleStatusChange, lang }: AssignEmployeeModalProps) {
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [assignEmployee, { isLoading }] = useAssignEmployeeToBookingMutation();
  
  // Fetch employees for this vendor
  const { data: vendorEmployeesRes } = useGetEmployeesByVendorQuery(booking?.vendor?.id || booking?.vendor_id, {
    skip: !isOpen || (!booking?.vendor?.id && !booking?.vendor_id)
  });
  
  const currentLang = (lang === 'bn' || lang === 'hi' ? lang : 'en') as keyof typeof translations;
  const t = translations[currentLang] || translations.en;

  useEffect(() => {
    if (isOpen) {
      setSelectedEmployees([]);
    }
  }, [isOpen]);

  if (!isOpen || !booking) return null;

  // Use the vendor's employees if available, otherwise fallback to the service's employees
  let employees = [];
  if (vendorEmployeesRes?.data) {
    employees = vendorEmployeesRes.data;
  } else if (Array.isArray(vendorEmployeesRes)) {
    employees = vendorEmployeesRes;
  } else {
    employees = booking.service?.employees || booking.nestedService?.employees || [];
  }

  const handleToggleEmployee = (id: number) => {
    setSelectedEmployees((prev) => 
      prev.includes(id) ? prev.filter((eId) => eId !== id) : [...prev, id]
    );
  };

  const handleConfirm = async () => {
    if (selectedEmployees.length === 0) {
      toast.error(t.selectAtLeastOne);
      return;
    }

    try {
      const res = await assignEmployee({ 
        id: booking.id, 
        employee_ids: selectedEmployees 
      }).unwrap();

      if (res.statusCode === 200) {
        toast.success(t.successMsg);
        handleStatusChange(booking.id, "assigned");
        onClose();
      } else {
        toast.error(res.message || t.failMsg);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || t.errorMsg);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg flex flex-col max-h-[85vh] shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/80">
          <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 text-blue-600 rounded-lg"><UserCheck size={18} /></span>
            {t.assignEmployees}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto bg-slate-50/50">
          <p className="text-sm text-slate-600 mb-4 font-medium leading-relaxed">
            {t.selectEmployeesFor} <span className="font-bold text-slate-800">"{booking.service?.name || t.service}"</span> {t.willPerform}
          </p>

          {employees.length > 0 ? (
            <div className="space-y-2">
              {employees.map((emp: any) => (
                <div 
                  key={emp.id} 
                  onClick={() => handleToggleEmployee(emp.id)}
                  className={`flex items-center gap-4 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedEmployees.includes(emp.id) 
                      ? "border-blue-500 bg-blue-50 shadow-sm" 
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    selectedEmployees.includes(emp.id) ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                    {emp.name?.charAt(0)?.toUpperCase() || 'E'}
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold ${selectedEmployees.includes(emp.id) ? "text-blue-900" : "text-slate-800"}`}>{emp.name}</p>
                    <p className="text-xs text-slate-500 font-medium">{emp.phone || t.noPhone}</p>
                  </div>
                  <div className="mr-2">
                    <CheckCircle2 
                      size={20} 
                      className={`transition-all ${selectedEmployees.includes(emp.id) ? "text-blue-500 scale-100" : "text-slate-200 scale-90"}`} 
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500 font-medium text-sm">{t.noEmployees}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end items-center gap-3 p-5 border-t border-slate-100 bg-white">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || employees.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-blue-500/20"
          >
            {isLoading ? t.assigning : t.confirmAssignment}
          </button>
        </div>
      </div>
    </div>
  );
}
