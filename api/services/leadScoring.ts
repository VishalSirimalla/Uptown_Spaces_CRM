type ScorableLead = { budget: number; propertyType?: string; location?: string; source?: string; status?: string; phone?: string; email?: string; notes?: unknown[]; createdAt?: Date | string };

export function scoreLead(lead: ScorableLead) {
  let score = 20;
  const reasons: string[] = [];
  if (lead.budget >= 10000000) { score += 20; reasons.push("Budget supports premium inventory"); }
  else if (lead.budget >= 5000000) { score += 12; reasons.push("Budget fits mid-market inventory"); }
  if (lead.propertyType && lead.location) { score += 15; reasons.push("Property preference and location are defined"); }
  if (lead.email && lead.phone) { score += 15; reasons.push("Complete contact information"); }
  if (["Contacted", "Qualified", "Site Visit", "Negotiation"].includes(lead.status || "")) { score += 15; reasons.push("Lead has progressed beyond initial capture"); }
  if ((lead.notes?.length || 0) > 0) { score += 5; reasons.push("Recent communication is logged"); }
  const age = lead.createdAt ? Date.now() - new Date(lead.createdAt).getTime() : 0;
  if (age < 7 * 86400000) { score += 10; reasons.push("Lead was captured recently"); }
  score = Math.min(100, score);
  const temperature = score >= 80 ? "HOT" : score >= 50 ? "WARM" : "COLD";
  const nextAction = score >= 80 ? "Schedule a site visit within 24 hours." : score >= 50 ? "Contact the lead and confirm property preferences." : "Complete qualification and establish a follow-up date.";
  return { score, temperature, reasons, nextAction };
}