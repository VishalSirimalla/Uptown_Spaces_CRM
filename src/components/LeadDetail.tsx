import React from "react";
import { Lead, LeadStatus } from "../types";
import { X, Phone, Mail, Clock, MessageSquare, Save } from "lucide-react";
import { cn, formatCurrency } from "../lib/utils";
import { STATUS_OPTIONS, STATUS_COLORS } from "../constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { noteSchema, type NoteFormData } from "../lib/validations";
import { api, LeadIntelligence } from "../lib/api";
import { useEffect, useState } from "react";

interface LeadDetailProps {
  lead: Lead;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onAddNote: (id: string, content: string) => void;
  onClose: () => void;
}

export default function LeadDetail({ lead, onUpdateStatus, onAddNote, onClose }: LeadDetailProps) {
  const [followUps, setFollowUps] = useState<Array<{ _id: string; date: string; time: string; type: string; notes: string; status: string }>>([]);
  const [matches, setMatches] = useState<Array<{ property: { _id: string; title: string; location: string; price: number }; matchPercentage: number }>>([]);
  const [followUp, setFollowUp] = useState({ date: new Date().toISOString().slice(0, 10), time: "11:00", type: "Call", notes: "" });
  const [followUpMessage, setFollowUpMessage] = useState("");
  const [intelligence, setIntelligence] = useState<LeadIntelligence | null>(null);
  const [loadError, setLoadError] = useState("");
  useEffect(() => {
    setLoadError("");
    void Promise.all([api.followUps(lead.id), api.matches(lead.id), api.leadDetails(lead.id)])
      .then(([scheduled, recommended, details]) => { setFollowUps(scheduled); setMatches(recommended); setIntelligence(details.intelligence); })
      .catch((error) => setLoadError(error instanceof Error ? error.message : "Could not load lead intelligence."));
  }, [lead.id]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema)
  });

  const onSubmitNote = (data: NoteFormData) => {
    onAddNote(lead.id, data.content);
    reset();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-[#1a1a1a]/40 dark:bg-black/60 backdrop-blur-sm transition-colors" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#fbfbfb] dark:bg-[#121212] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 transition-colors">
        <div className="p-4 sm:p-8 border-b border-[#1a1a1a]/5 dark:border-white/5 flex items-start justify-between gap-4 bg-white dark:bg-[#1a1a1a] transition-colors">
          <div className="flex min-w-0 items-center gap-4">
            <div className="hidden sm:flex w-16 h-16 shrink-0 bg-[#1a1a1a] dark:bg-[#f5f2ed] rounded-2xl items-center justify-center text-white dark:text-[#1a1a1a] text-2xl font-serif transition-colors">
              {lead.name.charAt(0)}
            </div>
            <div>
              <h2 className="truncate text-2xl sm:text-3xl font-serif font-bold text-[#1a1a1a] dark:text-[#f5f2ed] transition-colors">{lead.name}</h2>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 opacity-50 text-xs font-medium uppercase tracking-widest text-[#1a1a1a] dark:text-[#f5f2ed] transition-colors">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3 shrink-0" /> {lead.phone}</span>
                <span className="flex min-w-0 items-center gap-1"><Mail className="w-3 h-3 shrink-0" /> <span className="truncate">{lead.email}</span></span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#1a1a1a]/5 dark:hover:bg-white/5 rounded-full transition-colors text-[#1a1a1a] dark:text-[#f5f2ed]">
            <X className="w-7 h-7" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 sm:space-y-12">
          {loadError && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-300">{loadError}</div>}
          {/* Status Section */}
          <section className="bg-white dark:bg-[#1e1e1e] p-8 rounded-3xl border border-[#1a1a1a]/5 dark:border-white/5 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#1a1a1a]/40 dark:text-[#f5f2ed]/40 transition-colors">Pipeline Status</h3>
              <span className={cn("px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-colors", STATUS_COLORS[lead.status])}>
                {lead.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  onClick={() => onUpdateStatus(lead.id, status as LeadStatus)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all",
                    lead.status === status 
                      ? "bg-[#1a1a1a] text-white border-[#1a1a1a] dark:bg-[#f5f2ed] dark:text-[#1a1a1a] dark:border-[#f5f2ed]" 
                      : "bg-white text-[#1a1a1a]/40 border-[#1a1a1a]/10 hover:border-[#1a1a1a]/30 dark:bg-[#121212] dark:text-[#f5f2ed]/40 dark:border-white/10 dark:hover:border-white/30"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-[#1a1a1a] text-white dark:bg-[#1e1e1e] p-6 rounded-3xl border border-[#d4af37]/30 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37]">Lead intelligence</p><p className="mt-2 text-3xl font-serif font-bold">{intelligence?.score ?? "--"}<span className="ml-1 text-base opacity-50">/ 100</span></p></div>
              <span className="rounded-full bg-[#d4af37] px-3 py-1 text-xs font-bold tracking-widest text-[#1a1a1a]">{intelligence?.temperature || "Loading"}</span>
            </div>
            {intelligence && <><ul className="mt-5 space-y-2 text-sm text-white/70">{intelligence.reasons.slice(0, 3).map((reason) => <li key={reason}>• {reason}</li>)}</ul><p className="mt-5 border-t border-white/10 pt-4 text-sm"><span className="font-semibold text-[#d4af37]">Next action:</span> {intelligence.nextAction}</p></>}
          </section>

          {/* Details Grid */}
          <section className="grid grid-cols-2 gap-8 text-[#1a1a1a] dark:text-[#f5f2ed] transition-colors">
            <div className="space-y-1 border-l-2 border-[#d4af37] pl-4">
              <label className="text-[10px] uppercase font-bold text-[#1a1a1a]/30 dark:text-[#f5f2ed]/30 italic tracking-widest transition-colors">Target Budget</label>
              <p className="text-xl font-serif font-bold text-[#1a1a1a] dark:text-[#f5f2ed] transition-colors">{formatCurrency(lead.budget)}</p>
            </div>
            <div className="space-y-1 border-l-2 border-[#1a1a1a]/10 dark:border-white/10 pl-4 transition-colors">
              <label className="text-[10px] uppercase font-bold text-[#1a1a1a]/30 dark:text-[#f5f2ed]/30 italic tracking-widest transition-colors">Requirement</label>
              <p className="text-lg font-medium text-[#1a1a1a] dark:text-[#f5f2ed] transition-colors">{lead.propertyType}</p>
            </div>
            <div className="space-y-1 border-l-2 border-[#1a1a1a]/10 dark:border-white/10 pl-4 transition-colors">
              <label className="text-[10px] uppercase font-bold text-[#1a1a1a]/30 dark:text-[#f5f2ed]/30 italic tracking-widest transition-colors">Preferred Location</label>
              <p className="text-lg font-medium text-[#1a1a1a] dark:text-[#f5f2ed] transition-colors">{lead.location}</p>
            </div>
            <div className="space-y-1 border-l-2 border-[#1a1a1a]/10 dark:border-white/10 pl-4 transition-colors">
              <label className="text-[10px] uppercase font-bold text-[#1a1a1a]/30 dark:text-[#f5f2ed]/30 italic tracking-widest transition-colors">Lead Source</label>
              <p className="text-lg font-medium text-[#1a1a1a] dark:text-[#f5f2ed] underline decoration-[#d4af37] decoration-2 underline-offset-4 transition-colors">{lead.source}</p>
            </div>
          </section>

          <section className="space-y-5">
            <div className="flex items-center justify-between"><h3 className="text-sm font-bold uppercase tracking-[0.2em] opacity-50">Follow-ups</h3><span className="text-xs opacity-50">{followUps.length} scheduled</span></div>
            <form onSubmit={async (event) => { event.preventDefault(); try { await api.createFollowUp({ ...followUp, lead: lead.id }); setFollowUpMessage("Follow-up scheduled."); setFollowUps(await api.followUps(lead.id)); } catch (error) { setFollowUpMessage(error instanceof Error ? error.message : "Could not schedule follow-up."); } }} className="grid grid-cols-2 gap-3">
              <input type="date" value={followUp.date} onChange={(event) => setFollowUp({ ...followUp, date: event.target.value })} className="rounded-xl border p-3 bg-white dark:bg-[#1a1a1a]" required />
              <input type="time" value={followUp.time} onChange={(event) => setFollowUp({ ...followUp, time: event.target.value })} className="rounded-xl border p-3 bg-white dark:bg-[#1a1a1a]" required />
              <select value={followUp.type} onChange={(event) => setFollowUp({ ...followUp, type: event.target.value })} className="rounded-xl border p-3 bg-white dark:bg-[#1a1a1a]"><option>Call</option><option>Meeting</option><option>Email</option><option>Site Visit</option><option>WhatsApp</option></select>
              <input value={followUp.notes} onChange={(event) => setFollowUp({ ...followUp, notes: event.target.value })} placeholder="Follow-up note" className="rounded-xl border p-3 bg-white dark:bg-[#1a1a1a]" />
              <button className="col-span-2 rounded-xl bg-[#1a1a1a] dark:bg-[#f5f2ed] text-white dark:text-[#1a1a1a] p-3 text-xs font-bold uppercase tracking-widest">Schedule Follow-up</button>
            </form>
            {followUpMessage && <p className="text-xs text-[#d4af37]">{followUpMessage}</p>}
            <div className="space-y-2">{followUps.map((item) => <div key={item._id} className="flex justify-between rounded-xl bg-white dark:bg-[#1e1e1e] border p-3 text-sm"><span>{item.date} at {item.time} · {item.type}</span><span className="opacity-50">{item.status}</span></div>)}</div>
          </section>

          <section className="space-y-4"><div className="flex items-center justify-between"><h3 className="text-sm font-bold uppercase tracking-[0.2em] opacity-50">Recommended properties</h3><span className="text-xs opacity-50">{matches.length} match{matches.length === 1 ? "" : "es"}</span></div>{matches.slice(0, 5).map((match) => <div key={match.property._id} className="flex items-center justify-between rounded-xl bg-white dark:bg-[#1e1e1e] border p-4"><div><p className="font-semibold">{match.property.title}</p><p className="text-xs opacity-50">{match.property.location} · {formatCurrency(match.property.price)}</p></div><span className="text-sm font-bold text-emerald-600">{match.matchPercentage}%</span></div>)}</section>

          {/* Notes Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-[#1a1a1a]/5 dark:border-white/5 pb-4 transition-colors">
              <MessageSquare className="w-5 h-5 text-[#1a1a1a]/40 dark:text-[#f5f2ed]/40 transition-colors" />
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#1a1a1a] dark:text-[#f5f2ed] transition-colors">Client Communication Logs</h3>
            </div>

            <form onSubmit={handleSubmit(onSubmitNote)} className="space-y-4">
              <textarea
                {...register("content")}
                placeholder="Log a client interaction or site visit note..."
                className="w-full h-32 px-6 py-4 rounded-3xl bg-white dark:bg-[#1a1a1a] border border-[#1a1a1a]/10 dark:border-white/10 focus:border-[#1a1a1a] dark:focus:border-[#f5f2ed] outline-none transition-all resize-none text-sm placeholder:italic shadow-sm text-[#1a1a1a] dark:text-[#f5f2ed]"
              />
              {errors.content && <p className="text-red-500 text-xs italic font-bold">{errors.content.message}</p>}
              <button 
                type="submit"
                className="flex items-center gap-2 px-8 py-3 bg-[#1a1a1a] dark:bg-[#f5f2ed] text-white dark:text-[#1a1a1a] rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" />
                Commit Note
              </button>
            </form>

            <div className="space-y-6 pt-4">
              {lead.notes.length === 0 ? (
                <div className="text-center py-12 bg-[#1a1a1a]/[0.02] dark:bg-white/[0.02] rounded-3xl border border-dashed border-[#1a1a1a]/10 dark:border-white/10 transition-colors">
                  <p className="text-xs text-[#1a1a1a]/30 dark:text-[#f5f2ed]/30 italic font-medium">No archived notes for this lead</p>
                </div>
              ) : (
                lead.notes.map((note) => (
                  <div key={note.id} className="bg-white dark:bg-[#1e1e1e] p-6 rounded-[2rem] border border-[#1a1a1a]/5 dark:border-white/5 shadow-sm space-y-4 transition-colors">
                    <p className="text-sm text-[#1a1a1a]/80 dark:text-[#f5f2ed]/80 leading-relaxed italic">"{note.content}"</p>
                    <div className="flex items-center justify-between pt-4 border-t border-[#1a1a1a]/5 dark:border-white/5 transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#d4af37]/20 rounded-full flex items-center justify-center">
                          <Clock className="w-3 h-3 text-[#d4af37]" />
                        </div>
                        <span className="text-[10px] font-bold opacity-40 uppercase tracking-wider text-[#1a1a1a] dark:text-[#f5f2ed] transition-colors">
                          {new Date(note.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-[#1a1a1a]/60 dark:text-[#f5f2ed]/60 uppercase tracking-widest bg-[#1a1a1a]/5 dark:bg-white/5 px-3 py-1 rounded-full transition-colors">
                        Agent Log
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
