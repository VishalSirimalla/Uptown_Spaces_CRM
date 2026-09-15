export enum LeadStatus {
  NEW = "New",
  CONTACTED = "Contacted",
  QUALIFIED = "Qualified",
  SITE_VISIT = "Site Visit",
  NEGOTIATION = "Negotiation",
  WON = "Won",
  LOST = "Lost",
}

export enum LeadSource {
  FACEBOOK = "Facebook",
  GOOGLE = "Google",
  REFERRAL = "Referral",
  ZILLOW = "Zillow",
  REALTOR = "Realtor",
}

export enum PropertyType {
  BHK_1 = "1 BHK",
  BHK_2 = "2 BHK",
  BHK_3 = "3 BHK",
  PLOT = "Plot",
  PENTHOUSE = "Penthouse",
  VILLA = "Villa",
}

export interface Note {
  id: string;
  content: string;
  author: string;
  createdAt: number;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  budget: number;
  location: string;
  propertyType: PropertyType;
  source: LeadSource;
  status: LeadStatus;
  createdAt: number;
  updatedAt: number;
  notes: Note[];
  assignedAgent?: { id: string; name: string; email: string; role: string } | string | null;
}

export interface DashboardStats {
  totalLeads: number;
  conversionRate: number;
  leadsBySource: { name: string; value: number }[];
  statusDistribution: { name: string; value: number }[];
  budgetTrends: { month: string; average: number }[];
}
