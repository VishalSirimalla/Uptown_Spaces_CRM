import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema, type LeadFormData } from "../lib/validations";
import { PropertyType, LeadSource } from "../types";
import { SOURCE_OPTIONS, PROPERTY_TYPE_OPTIONS } from "../constants";
import { X } from "lucide-react";

interface LeadFormProps {
  onSubmit: (data: LeadFormData) => void | Promise<void>;
  onClose: () => void;
}

export default function LeadForm({ onSubmit, onClose }: LeadFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      budget: 50000,
    },
  });

  return (
    <div className="fixed inset-0 bg-[#1a1a1a]/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-300">
        <div className="p-6 border-b border-[#1a1a1a]/5 dark:border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#1a1a1a] dark:text-[#f5f2ed]">Register New Lead</h2>
            <p className="text-sm text-[#1a1a1a]/60 dark:text-[#f5f2ed]/60 font-medium">Enter high-intent lead details for tracking</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#1a1a1a]/5 dark:hover:bg-white/5 rounded-full transition-colors text-[#1a1a1a] dark:text-[#f5f2ed]">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#1a1a1a] dark:text-[#f5f2ed]">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 dark:text-[#f5f2ed]/40">Full Name</label>
              <input
                {...register("name")}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl border border-[#1a1a1a]/10 dark:border-white/10 bg-white dark:bg-[#1a1a1a] focus:border-[#1a1a1a] dark:focus:border-[#f5f2ed] focus:ring-0 outline-none transition-all placeholder:text-[#1a1a1a]/20 dark:placeholder:text-[#f5f2ed]/20"
              />
              {errors.name && <p className="text-red-500 text-[10px] mt-1 font-bold italic">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 dark:text-[#f5f2ed]/40">Phone Number</label>
              <input
                {...register("phone")}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 rounded-xl border border-[#1a1a1a]/10 dark:border-white/10 bg-white dark:bg-[#1a1a1a] focus:border-[#1a1a1a] dark:focus:border-[#f5f2ed] focus:ring-0 outline-none transition-all placeholder:text-[#1a1a1a]/20 dark:placeholder:text-[#f5f2ed]/20"
              />
              {errors.phone && <p className="text-red-500 text-[10px] mt-1 font-bold italic">{errors.phone.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 dark:text-[#f5f2ed]/40">Email Address</label>
              <input
                {...register("email")}
                placeholder="john@example.com"
                className="w-full px-4 py-3 rounded-xl border border-[#1a1a1a]/10 dark:border-white/10 bg-white dark:bg-[#1a1a1a] focus:border-[#1a1a1a] dark:focus:border-[#f5f2ed] focus:ring-0 outline-none transition-all placeholder:text-[#1a1a1a]/20 dark:placeholder:text-[#f5f2ed]/20"
              />
              {errors.email && <p className="text-red-500 text-[10px] mt-1 font-bold italic">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 dark:text-[#f5f2ed]/40">Budget (INR)</label>
              <input
                {...register("budget", { valueAsNumber: true })}
                type="number"
                placeholder="5,00,00,000"
                className="w-full px-4 py-3 rounded-xl border border-[#1a1a1a]/10 dark:border-white/10 bg-white dark:bg-[#1a1a1a] focus:border-[#1a1a1a] dark:focus:border-[#f5f2ed] focus:ring-0 outline-none transition-all placeholder:text-[#1a1a1a]/20 dark:placeholder:text-[#f5f2ed]/20"
              />
              {errors.budget && <p className="text-red-500 text-[10px] mt-1 font-bold italic">{errors.budget.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 dark:text-[#f5f2ed]/40">Location</label>
              <input
                {...register("location")}
                placeholder="Whitefield, Bangalore"
                className="w-full px-4 py-3 rounded-xl border border-[#1a1a1a]/10 dark:border-white/10 bg-white dark:bg-[#1a1a1a] focus:border-[#1a1a1a] dark:focus:border-[#f5f2ed] focus:ring-0 outline-none transition-all placeholder:text-[#1a1a1a]/20 dark:placeholder:text-[#f5f2ed]/20"
              />
              {errors.location && <p className="text-red-500 text-[10px] mt-1 font-bold italic">{errors.location.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 dark:text-[#f5f2ed]/40">Property Type</label>
              <select
                {...register("propertyType")}
                className="w-full px-4 py-3 rounded-xl border border-[#1a1a1a]/10 dark:border-white/10 focus:border-[#1a1a1a] dark:focus:border-[#f5f2ed] focus:ring-0 outline-none transition-all bg-white dark:bg-[#1a1a1a]"
              >
                {PROPERTY_TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 dark:text-[#f5f2ed]/40">Lead Source</label>
              <select
                {...register("source")}
                className="w-full px-4 py-3 rounded-xl border border-[#1a1a1a]/10 dark:border-white/10 focus:border-[#1a1a1a] dark:focus:border-[#f5f2ed] focus:ring-0 outline-none transition-all bg-white dark:bg-[#1a1a1a]"
              >
                {SOURCE_OPTIONS.map((source) => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1a1a1a]/5 dark:border-white/10 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 text-sm font-bold uppercase tracking-widest border border-[#1a1a1a]/10 dark:border-white/10 rounded-2xl hover:bg-[#1a1a1a]/5 dark:hover:bg-white/5 transition-all text-[#1a1a1a] dark:text-[#f5f2ed]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-4 text-sm font-bold uppercase tracking-widest bg-[#1a1a1a] dark:bg-[#f5f2ed] text-white dark:text-[#1a1a1a] rounded-2xl hover:opacity-90 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : "Create Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
