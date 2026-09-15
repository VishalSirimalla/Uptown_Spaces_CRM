import React from "react";
import { Lead, LeadStatus, LeadSource } from "../types";
import { Search, Filter, SortAsc, MoreVertical, Phone, Mail, Users } from "lucide-react";
import { cn, formatCurrency } from "../lib/utils";
import { STATUS_COLORS, STATUS_OPTIONS, SOURCE_OPTIONS } from "../constants";

interface LeadTableProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
}

export default function LeadTable({ leads, onSelectLead }: LeadTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("All");
  const [sourceFilter, setSourceFilter] = React.useState<string>("All");
  
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setSourceFilter("All");
  };

  const filteredLeads = leads.filter((lead) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = lead.name.toLowerCase().includes(term) || lead.phone.toLowerCase().includes(term) || lead.email.toLowerCase().includes(term) || lead.location.toLowerCase().includes(term);
    const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
    const matchesSource = sourceFilter === "All" || lead.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl border border-[#1a1a1a]/5 dark:border-white/5 shadow-sm overflow-hidden h-full flex flex-col transition-colors duration-300">
      <div className="p-6 border-b border-[#1a1a1a]/5 dark:border-white/5 flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a1a1a]/30 dark:text-[#f5f2ed]/30" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name, email, phone, or location..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#1a1a1a]/5 dark:bg-white/5 border-none focus:ring-1 focus:ring-[#1a1a1a]/10 dark:focus:ring-white/10 outline-none text-sm transition-all shadow-inner text-[#1a1a1a] dark:text-[#f5f2ed] placeholder:text-[#1a1a1a]/30 dark:placeholder:text-[#f5f2ed]/30"
          />
        </div>
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-2xl bg-white dark:bg-[#262626] border border-[#1a1a1a]/10 dark:border-white/10 text-xs font-bold uppercase tracking-widest outline-none text-[#1a1a1a] dark:text-[#f5f2ed] transition-colors"
          >
            <option value="All" className="dark:bg-[#1e1e1e]">All Status</option>
            {STATUS_OPTIONS.map(status => <option key={status} value={status} className="dark:bg-[#1e1e1e]">{status}</option>)}
          </select>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-4 py-3 rounded-2xl bg-white dark:bg-[#262626] border border-[#1a1a1a]/10 dark:border-white/10 text-xs font-bold uppercase tracking-widest outline-none text-[#1a1a1a] dark:text-[#f5f2ed] transition-colors"
          >
            <option value="All" className="dark:bg-[#1e1e1e]">All Sources</option>
            {SOURCE_OPTIONS.map(source => <option key={source} value={source} className="dark:bg-[#1e1e1e]">{source}</option>)}
          </select>
          <button 
            onClick={clearFilters}
            className="px-4 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/40 dark:text-[#f5f2ed]/40 hover:text-[#d4af37] transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-[#fbfbfb] dark:bg-[#1a1a1a] border-b border-[#1a1a1a]/5 dark:border-white/5 z-10">
            <tr>
              <th className="text-left py-4 px-6 text-[10px] uppercase tracking-[0.2em] font-bold text-[#1a1a1a]/40 dark:text-[#f5f2ed]/40">Status</th>
              <th className="text-left py-4 px-6 text-[10px] uppercase tracking-[0.2em] font-bold text-[#1a1a1a]/40 dark:text-[#f5f2ed]/40">Lead Contact</th>
              <th className="text-left py-4 px-6 text-[10px] uppercase tracking-[0.2em] font-bold text-[#1a1a1a]/40 dark:text-[#f5f2ed]/40">Budget</th>
              <th className="text-left py-4 px-6 text-[10px] uppercase tracking-[0.2em] font-bold text-[#1a1a1a]/40 dark:text-[#f5f2ed]/40">Property & Location</th>
              <th className="text-left py-4 px-6 text-[10px] uppercase tracking-[0.2em] font-bold text-[#1a1a1a]/40 dark:text-[#f5f2ed]/40">Source</th>
              <th className="text-right py-4 px-6 text-[10px] uppercase tracking-[0.2em] font-bold text-[#1a1a1a]/40 dark:text-[#f5f2ed]/40">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr 
                key={lead.id} 
                className="group border-b border-[#1a1a1a]/5 dark:border-white/5 hover:bg-[#1a1a1a]/[0.02] dark:hover:bg-white/[0.02] cursor-pointer transition-colors"
                onClick={() => onSelectLead(lead)}
              >
                <td className="py-5 px-6">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-colors",
                    STATUS_COLORS[lead.status]
                  )}>
                    {lead.status}
                  </span>
                </td>
                <td className="py-5 px-6">
                  <div className="flex flex-col">
                    <span className="font-serif font-bold text-[#1a1a1a] dark:text-[#f5f2ed]">{lead.name}</span>
                    <div className="flex items-center gap-2 mt-1 opacity-50 text-[#1a1a1a] dark:text-[#f5f2ed]">
                      <Phone className="w-3 h-3" />
                      <span className="text-xs font-mono">{lead.phone}</span>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <span className="text-sm font-bold text-[#1a1a1a] dark:text-[#f5f2ed]">{formatCurrency(lead.budget)}</span>
                </td>
                <td className="py-5 px-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-[#1a1a1a] dark:text-[#f5f2ed]">{lead.propertyType}</span>
                    <span className="text-xs text-[#1a1a1a]/50 dark:text-[#f5f2ed]/50 italic">{lead.location}</span>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <span className="text-xs font-semibold text-[#1a1a1a]/60 dark:text-[#f5f2ed]/60 uppercase tracking-wider">{lead.source}</span>
                </td>
                <td className="py-5 px-6 text-right">
                  <button aria-label={`Open ${lead.name}`} onClick={(event) => { event.stopPropagation(); onSelectLead(lead); }} className="p-2 hover:bg-[#1a1a1a]/5 dark:hover:bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-all text-[#1a1a1a] dark:text-[#f5f2ed]">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredLeads.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center opacity-30 text-[#1a1a1a] dark:text-[#f5f2ed]">
            <Users className="w-16 h-16 mb-4" />
            <p className="font-serif italic text-lg">No leads matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
