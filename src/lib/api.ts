import { Lead, Note } from "../types";

type ApiLead = Omit<Lead, "id" | "createdAt" | "updatedAt"> & { _id: string; createdAt: string; updatedAt: string };
export type LeadIntelligence = { score: number; temperature: "HOT" | "WARM" | "COLD"; reasons: string[]; nextAction: string };
const mapLead = (lead: ApiLead): Lead => ({ ...lead, id: lead._id, createdAt: new Date(lead.createdAt).getTime(), updatedAt: new Date(lead.updatedAt).getTime(), notes: (lead.notes || []).map((note: Note & { _id?: string }) => ({ ...note, id: note.id || note._id || crypto.randomUUID(), createdAt: new Date(note.createdAt).getTime() })) });

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, { headers: { "Content-Type": "application/json", ...(options?.headers || {}) }, credentials: "include", ...options });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error || `Request failed (${response.status})`);
  return body as T;
}

export const api = {
  leads: async (filters: Record<string, string> = {}) => { const query = new URLSearchParams(Object.entries(filters).filter(([, value]) => value && value !== "All")); const data = await request<ApiLead[]>(`/api/leads${query.toString() ? `?${query}` : ""}`); return data.map(mapLead); },
  createLead: async (data: Partial<Lead>) => mapLead(await request<ApiLead>("/api/leads", { method: "POST", body: JSON.stringify(data) })),
  updateLead: async (id: string, data: Record<string, unknown>) => mapLead(await request<ApiLead>(`/api/leads/${id}`, { method: "PATCH", body: JSON.stringify(data) })),
  leadDetails: async (id: string) => request<{ lead: ApiLead; intelligence: LeadIntelligence }>(`/api/leads/${id}`),
  deleteLead: (id: string) => request<void>(`/api/leads/${id}`, { method: "DELETE" }),
  analytics: () => request<Record<string, unknown>>("/api/analytics"),
  login: (email: string, password: string) => request<{ user: { name: string; email: string; role: string } }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (name: string, email: string, password: string) => request<{ user: { name: string; email: string; role: string } }>("/api/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) }),
  me: () => request<{ user: { name: string; email: string; role: string } }>("/api/auth/me"),
  logout: () => request<void>("/api/auth/logout", { method: "POST" }),
  followUps: (lead: string) => request<Array<{ _id: string; date: string; time: string; type: string; notes: string; status: string }>>(`/api/follow-ups?lead=${lead}`),
  createFollowUp: (data: Record<string, unknown>) => request<unknown>("/api/follow-ups", { method: "POST", body: JSON.stringify(data) }),
  matches: (lead: string) => request<Array<{ property: { _id: string; title: string; location: string; price: number }; matchPercentage: number }>>(`/api/leads/${lead}/matches`),
};