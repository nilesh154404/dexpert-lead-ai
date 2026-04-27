import { Users, Calendar, MessageSquare, TrendingUp, Sparkles, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AIInsightCard } from "@/components/dashboard/AIInsightCard";
import { HotLeadsWidget } from "@/components/dashboard/HotLeadsWidget";
import { AppointmentsWidget } from "@/components/dashboard/AppointmentsWidget";
import { LeadFunnelWidget } from "@/components/dashboard/LeadFunnelWidget";
import PlanSelection from "@/components/dashboard/PlanSelection";
import { analyticsApi } from "@/lib/api/analytics.api";
import { leadsApi } from "@/lib/api/leads.api";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { SuperAdminDashboard } from "@/components/dashboard/SuperAdminDashboard";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (user?.role === "super_admin") {
    return <SuperAdminDashboard />;
  }

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => analyticsApi.getDashboardStats(),
  });

  const { data: hotLeads, isLoading: hotLeadsLoading } = useQuery({
    queryKey: ["hot-leads"],
    queryFn: () => leadsApi.getHotLeads(3),
  });

  // --- FRONTEND MATH CALCULATION ---
  const totalLeads = stats?.totalLeads.value || 0;
  const totalAppointments = stats?.totalAppointments.value || 0;
  const calcConversionRate = totalLeads > 0 
    ? ((totalAppointments / totalLeads) * 100).toFixed(1) 
    : "0.0";
  // ---------------------------------

  // Mock AI insights - can be replaced with API later
  const aiInsights = [
    {
      title: "Schedule follow-up with hot leads",
      insight: `You have ${hotLeads?.length || 0} hot leads that need attention today.`,
      confidence: 92,
      type: "recommendation" as const,
      action: {
        label: "View Leads",
        onClick: () => navigate("/leads"),
      },
    },
    {
      title: "Performance update",
      // Updated this line to use our calculated rate instead of the backend one
      insight: `Conversion rate is ${calcConversionRate}%. Keep engaging with qualified leads.`,
      confidence: 87,
      type: "trend" as const,
      action: {
        label: "View Analytics",
        onClick: () => navigate("/analytics"),
      },
    },
  ];

  return (
    <AppLayout title="Dashboard" subtitle={`Welcome back, ${user?.name || "User"}`}>
      {/* AI Insights Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-ai" />
          <h2 className="text-lg font-semibold">AI Recommendations</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {aiInsights.map((insight, index) => (
            <AIInsightCard key={index} {...insight} />
          ))}
        </div>
      </div>

      {/* Stats Row */}
      {!statsLoading && stats ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            title="Total Leads"
            value={stats.totalLeads.value.toLocaleString()}
            change={{ value: stats.totalLeads.change, label: "vs last month" }}
            icon={Users}
            iconColor="text-blue-600"
          />
          <StatsCard
            title="AI Conversations"
            value={stats.totalConversations.value.toLocaleString()}
            change={{ value: stats.totalConversations.change, label: "vs last month" }}
            icon={MessageSquare}
            iconColor="text-ai"
          />
          <StatsCard
            title="Appointments"
            value={stats.totalAppointments.value.toLocaleString()}
            change={{ value: stats.totalAppointments.change, label: "vs last month" }}
            icon={Calendar}
            iconColor="text-violet-600"
          />
          <StatsCard
            title="Conversion Rate"
            // Updated this line to use our calculated rate!
            value={`${calcConversionRate}%`}
            change={{ value: stats.conversionRate.change, label: "vs last month" }}
            icon={TrendingUp}
            iconColor="text-emerald-600"
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-secondary animate-pulse rounded-xl" />
          ))}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <HotLeadsWidget />
          {/* Plan Selection UI for Admins */}
          {/* <PlanSelection /> */}
        </div>
        <div className="space-y-6">
          <AppointmentsWidget />
          <LeadFunnelWidget />
        </div>
      </div>
    </AppLayout>
  );
}