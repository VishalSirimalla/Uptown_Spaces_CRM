import { LeadStatus, LeadSource, PropertyType } from "./types";

export const STATUS_OPTIONS = Object.values(LeadStatus);
export const SOURCE_OPTIONS = Object.values(LeadSource);
export const PROPERTY_TYPE_OPTIONS = Object.values(PropertyType);

export const STATUS_COLORS: Record<LeadStatus, string> = {
  [LeadStatus.NEW]: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  [LeadStatus.CONTACTED]: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  [LeadStatus.QUALIFIED]: "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20",
  [LeadStatus.SITE_VISIT]: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20",
  [LeadStatus.NEGOTIATION]: "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20",
  [LeadStatus.WON]: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  [LeadStatus.LOST]: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
};

export const SOURCE_COLORS: Record<LeadSource, string> = {
  [LeadSource.FACEBOOK]: "text-blue-600",
  [LeadSource.GOOGLE]: "text-red-500",
  [LeadSource.REFERRAL]: "text-teal-600",
  [LeadSource.ZILLOW]: "text-blue-800",
  [LeadSource.REALTOR]: "text-red-700",
};
