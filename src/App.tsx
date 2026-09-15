import React from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import LeadTable from "./components/LeadTable";
import LeadForm from "./components/LeadForm";
import LeadDetail from "./components/LeadDetail";
import Settings from "./components/Settings";
import LoginPage from "./components/LoginPage";
import { Lead, LeadStatus } from "./types";
import { api } from "./lib/api";

export default function App() {
  const [user, setUser] = React.useState<{ name: string; email: string; role: string } | null>(null);
  const [authLoading, setAuthLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState("dashboard");
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [notice, setNotice] = React.useState("");

  const loadLeads = React.useCallback(async () => {
    setLoading(true); setError("");
    try { setLeads(await api.leads()); } catch (err) { setError(err instanceof Error ? err.message : "Could not load leads."); }
    finally { setLoading(false); }
  }, []);
  React.useEffect(() => { document.documentElement.classList.add("dark"); }, []);
  React.useEffect(() => {
    void api.me().then((response) => setUser(response.user)).catch(() => setUser(null)).finally(() => setAuthLoading(false));
  }, []);
  React.useEffect(() => { if (user) void loadLeads(); }, [user, loadLeads]);

  const handleAddLead = async (data: Parameters<NonNullable<React.ComponentProps<typeof LeadForm>["onSubmit"]>>[0]) => {
    try { const created = await api.createLead(data); setLeads((current) => [created, ...current]); setShowAddForm(false); setActiveTab("leads"); setNotice("Lead created successfully."); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not create lead."); }
  };
  const handleUpdateLeadStatus = async (id: string, status: LeadStatus) => {
    try { const updated = await api.updateLead(id, { status }); setLeads((current) => current.map((lead) => lead.id === id ? updated : lead)); setSelectedLead(updated); setNotice("Pipeline stage updated."); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not update status."); }
  };
  const handleAddNote = async (leadId: string, content: string) => {
    try { const updated = await api.updateLead(leadId, { addNote: { content, author: user?.name || "Agent" } }); setLeads((current) => current.map((lead) => lead.id === leadId ? updated : lead)); setSelectedLead(updated); setNotice("Note saved."); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not save note."); }
  };
  const handleLogout = async () => { await api.logout().catch(() => undefined); setUser(null); setLeads([]); };
  const handleTabChange = (tab: string) => tab === "add" ? setShowAddForm(true) : setActiveTab(tab);

  if (authLoading) return <div className="min-h-screen grid place-items-center bg-[#0c0c0c] text-[#f5f2ed]">Restoring session...</div>;
  if (!user) return <LoginPage onLogin={setUser} />;
  return <div className="flex h-screen bg-[#fafaf9] dark:bg-[#0c0c0c] text-[#1a1a1a] dark:text-[#f5f2ed] overflow-hidden">
    <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} onLogout={handleLogout} />
    <main className="flex-1 overflow-hidden h-screen bg-[#fafaf9] dark:bg-[#0c0c0c] flex flex-col">
      {notice && <button onClick={() => setNotice("")} className="absolute top-5 right-8 z-40 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg">{notice}</button>}
      {error && <button onClick={() => setError("")} className="absolute top-5 right-8 z-40 bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg max-w-sm text-left">{error}</button>}
      {activeTab === "dashboard" && <div className="flex-1 overflow-y-auto p-8 lg:p-12"><Dashboard leads={leads} /></div>}
      {activeTab === "leads" && <div className="flex-1 overflow-hidden flex flex-col p-8 lg:p-12"><div className="flex items-center justify-between mb-8"><div><h2 className="text-4xl font-serif font-bold">Active Pipeline</h2><p className="text-sm opacity-60">Manage and track your potential clients</p></div><button onClick={() => setShowAddForm(true)} className="px-6 py-3 bg-[#1a1a1a] dark:bg-[#f5f2ed] text-white dark:text-[#1a1a1a] rounded-2xl text-xs font-bold uppercase tracking-[0.2em]">Register New Lead</button></div>{loading ? <div className="flex-1 grid place-items-center opacity-50">Loading leads...</div> : <div className="flex-1 overflow-hidden"><LeadTable leads={leads} onSelectLead={setSelectedLead} /></div>}</div>}
      {activeTab === "settings" && <div className="flex-1 overflow-y-auto p-8 lg:p-12"><Settings /></div>}
    </main>
    {showAddForm && <LeadForm onSubmit={handleAddLead} onClose={() => setShowAddForm(false)} />}
    {selectedLead && <LeadDetail lead={selectedLead} onUpdateStatus={handleUpdateLeadStatus} onAddNote={handleAddNote} onClose={() => setSelectedLead(null)} />}
  </div>;
}
