import React from "react";
import StatsCard from "./StatsCard";
import { Users, Target, PieChart, TrendingUp, Filter, X } from "lucide-react";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Lead, LeadStatus, PropertyType } from "../types";
import { STATUS_OPTIONS, PROPERTY_TYPE_OPTIONS } from "../constants";
import { cn } from "../lib/utils";
import { api } from "../lib/api";

interface DashboardProps {
  leads: Lead[];
}

export default function Dashboard({ leads }: DashboardProps) {
  const isDark = true;
  const [dateRange, setDateRange] = React.useState("365");
  const [statusFilter, setStatusFilter] = React.useState<string>("All");
  const [propertyFilter, setPropertyFilter] = React.useState<string>("All");
  const [showFilters, setShowFilters] = React.useState(false);
  const [analytics, setAnalytics] = React.useState<Record<string, unknown> | null>(null);
  const [analyticsError, setAnalyticsError] = React.useState("");

  React.useEffect(() => {
    setAnalyticsError("");
    void api.analytics().then(setAnalytics).catch((error) => {
      setAnalytics(null);
      setAnalyticsError(error instanceof Error ? error.message : "Could not load dashboard analytics.");
    });
  }, [leads]);

  const filteredLeads = React.useMemo(() => {
    const now = Date.now();
    const days = parseInt(dateRange);
    return leads.filter(l => {
      const matchesDate = (now - l.createdAt) <= days * 24 * 60 * 60 * 1000;
      const matchesStatus = statusFilter === "All" || l.status === statusFilter;
      const matchesProperty = propertyFilter === "All" || l.propertyType === propertyFilter;
      return matchesDate && matchesStatus && matchesProperty;
    });
  }, [leads, dateRange, statusFilter, propertyFilter]);

  const totalLeads = filteredLeads.length;
  const closedLeads = filteredLeads.filter(l => l.status === "Won").length;
  const conversionRate = totalLeads ? ((closedLeads / totalLeads) * 100).toFixed(1) : "0.0";
  const analyticsLoading = analytics === null && !analyticsError;

  const sourceData = React.useMemo(() => {
    const sources: Record<string, number> = {};
    filteredLeads.forEach(l => {
      sources[l.source] = (sources[l.source] || 0) + 1;
    });
    return Object.entries(sources).map(([name, value]) => ({ name, value }));
  }, [filteredLeads]);

  const statusData = React.useMemo(() => {
    const statuses: Record<string, number> = {};
    filteredLeads.forEach(l => {
      statuses[l.status] = (statuses[l.status] || 0) + 1;
    });
    return Object.entries(statuses).map(([name, value]) => ({ name, value }));
  }, [filteredLeads]);

  const COLORS = isDark 
    ? ["#f5f2ed", "#d4af37", "#a0a080", "#8e9299", "#c0c0c0"]
    : ["#1a1a1a", "#d4af37", "#5a5a40", "#8e9299", "#c0c0c0"];

  const axisTickStyle = { 
    fontSize: 10, 
    fontWeight: 700, 
    fill: isDark ? '#f5f2ed40' : '#1a1a1a40' 
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold text-[#1a1a1a] dark:text-[#f5f2ed] tracking-tight transition-colors">Market Overview</h2>
          <p className="text-xs text-[#1a1a1a]/60 dark:text-[#f5f2ed]/60 font-medium tracking-wide">Performance analytics for Uptown CRM</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg hover:scale-105 active:scale-95 transition-all outline-none",
              showFilters 
                ? "bg-[#d4af37] text-white" 
                : "bg-[#1a1a1a] dark:bg-[#f5f2ed] text-white dark:text-[#1a1a1a]"
            )}
          >
            {showFilters ? <X className="w-3 h-3" /> : <Filter className="w-3 h-3" />}
            {showFilters ? "Close Filters" : "Filter Analytics"}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white dark:bg-[#161616] rounded-2xl border border-[#d4af37]/20 border-dashed animate-in zoom-in-95 duration-300">
          <div className="space-y-1">
            <label className="text-[8px] uppercase font-bold text-[#1a1a1a]/40 dark:text-[#f5f2ed]/40 tracking-widest leading-none">Time Period</label>
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 bg-[#1a1a1a]/5 dark:bg-[#262626] border-none rounded-lg text-[10px] font-bold text-[#1a1a1a] dark:text-[#f5f2ed] outline-none transition-colors"
            >
              <option value="7" className="dark:bg-[#161616]">Last 7 Days</option>
              <option value="30" className="dark:bg-[#161616]">Last 30 Days</option>
              <option value="90" className="dark:bg-[#161616]">Last Quarter</option>
              <option value="365" className="dark:bg-[#161616]">Last Year</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[8px] uppercase font-bold text-[#1a1a1a]/40 dark:text-[#f5f2ed]/40 tracking-widest leading-none">Status</label>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#1a1a1a]/5 dark:bg-[#262626] border-none rounded-lg text-[10px] font-bold text-[#1a1a1a] dark:text-[#f5f2ed] outline-none transition-colors"
            >
              <option value="All" className="dark:bg-[#161616]">All Statuses</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s} className="dark:bg-[#161616]">{s}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[8px] uppercase font-bold text-[#1a1a1a]/40 dark:text-[#f5f2ed]/40 tracking-widest leading-none">Requirement</label>
            <select 
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#1a1a1a]/5 dark:bg-[#262626] border-none rounded-lg text-[10px] font-bold text-[#1a1a1a] dark:text-[#f5f2ed] outline-none transition-colors"
            >
              <option value="All" className="dark:bg-[#161616]">All Types</option>
              {PROPERTY_TYPE_OPTIONS.map(p => <option key={p} value={p} className="dark:bg-[#161616]">{p}</option>)}
            </select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Total Leads" value={analyticsLoading ? "..." : analytics?.totalLeads as number ?? totalLeads} icon={Users} color="blue" />
        <StatsCard label="Conversion Rate" value={analyticsLoading ? "..." : `${analytics?.conversionRate as number ?? conversionRate}%`} icon={Target} color="emerald" />
        <StatsCard label="Site Visits" value={analyticsLoading ? "..." : analytics?.siteVisits as number ?? filteredLeads.filter(l => l.status === "Site Visit").length} icon={TrendingUp} color="purple" />
        <StatsCard label="Won Deals" value={analyticsLoading ? "..." : analytics?.wonDeals as number ?? closedLeads} icon={PieChart} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-[2rem] border border-[#1a1a1a]/5 dark:border-white/5 shadow-sm h-[320px] xl:h-[380px] flex flex-col transition-colors duration-300">
          <div className="mb-4">
            <h3 className="text-lg font-serif font-bold text-[#1a1a1a] dark:text-[#f5f2ed]">Lead Status Distribution</h3>
            <p className="text-[10px] text-[#1a1a1a]/40 dark:text-[#f5f2ed]/40 font-medium uppercase tracking-[0.15em] mt-1">Current pipeline health</p>
          </div>
          {analyticsError && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-500/10 dark:text-red-300">{analyticsError}</p>}
          <div className="flex-1 min-h-0">
            {analyticsLoading ? <div className="h-full grid place-items-center text-xs opacity-50">Loading pipeline data...</div> : <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
              <BarChart data={statusData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={axisTickStyle} />
                <Tooltip 
                  cursor={{ fill: isDark ? '#ffffff05' : '#1a1a1a05' }}
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)', 
                    backgroundColor: isDark ? '#1a1a1a' : '#ffffff', 
                    color: isDark ? '#f5f2ed' : '#1a1a1a' 
                  }}
                  itemStyle={{ color: isDark ? '#f5f2ed' : '#1a1a1a' }}
                />
                <Bar dataKey="value" fill={isDark ? "#f5f2ed" : "#1a1a1a"} radius={[8, 8, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-[2rem] border border-[#1a1a1a]/5 dark:border-white/5 shadow-sm h-[320px] xl:h-[380px] flex flex-col transition-colors duration-300">
          <div className="mb-4">
            <h3 className="text-lg font-serif font-bold text-[#1a1a1a] dark:text-[#f5f2ed]">Source Performance</h3>
            <p className="text-[10px] text-[#1a1a1a]/40 dark:text-[#f5f2ed]/40 font-medium uppercase tracking-[0.15em] mt-1">ROI across channels</p>
          </div>
          <div className="flex-1 min-h-0">
            {analyticsLoading ? <div className="h-full grid place-items-center text-xs opacity-50">Loading source data...</div> : <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
              <RechartsPie>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                    backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
                    color: isDark ? '#f5f2ed' : '#1a1a1a'
                  }}
                  itemStyle={{ color: isDark ? '#f5f2ed' : '#1a1a1a' }}
                />
                <Legend 
                  iconType="circle" 
                  formatter={(value) => <span style={{ color: isDark ? '#f5f2ed80' : '#1a1a1a80', fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{value}</span>}
                />
              </RechartsPie>
            </ResponsiveContainer>}
          </div>
        </div>
      </div>
    </div>
  );
}
