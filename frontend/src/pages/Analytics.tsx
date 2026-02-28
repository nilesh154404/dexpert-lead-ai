import { BarChart3, TrendingUp, Users, Bot, Calendar, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/lib/api/analytics.api";

// Fallback dummy data for the AI vs Human chart 
const conversionData = [
  { month: "Jan", ai: 12.5, human: 8.2 },
  { month: "Feb", ai: 14.2, human: 9.1 },
  { month: "Mar", ai: 13.8, human: 8.8 },
  { month: "Apr", ai: 15.5, human: 9.5 },
  { month: "May", ai: 16.2, human: 10.2 },
  { month: "Jun", ai: 17.1, human: 10.8 },
];

const COLORS = ["hsl(173, 80%, 40%)", "hsl(222, 47%, 20%)", "hsl(38, 92%, 50%)", "hsl(220, 14%, 60%)"];

export default function Analytics() {
  // 1. Fetch live top-level stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["analytics-stats"],
    queryFn: () => analyticsApi.getDashboardStats(),
  });

  // 2. Fetch live lead generation over time
  const { data: leadData, isLoading: chartLoading } = useQuery({
    queryKey: ["analytics-leads-over-time"],
    queryFn: () => analyticsApi.getLeadsOverTime(6),
  });

  // 3. Fetch live lead sources
  const { data: rawSourceData, isLoading: sourcesLoading } = useQuery({
    queryKey: ["analytics-sources"],
    queryFn: () => analyticsApi.getLeadSources(),
  });

  const sourceData = rawSourceData?.map((item, index) => ({
    ...item,
    color: COLORS[index % COLORS.length]
  })) || [];

  const isLoading = statsLoading || chartLoading || sourcesLoading;

  // Frontend Math for Top Cards (bypassing backend 0%)
  const totalLeads = stats?.totalLeads.value || 0;
  const totalConvos = stats?.totalConversations.value || 0;
  const totalAppointments = stats?.totalAppointments.value || 0;
  
  const calcConversionRate = totalLeads > 0 
    ? ((totalAppointments / totalLeads) * 100).toFixed(1) 
    : "0.0";

  const metrics = [
    {
      title: "Total Leads Generated",
      value: totalLeads.toLocaleString(),
      change: stats?.totalLeads.change || 0,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "AI Chatbot Conversations",
      value: totalConvos.toLocaleString(),
      change: stats?.totalConversations.change || 0,
      icon: Bot,
      color: "text-ai",
    },
    {
      title: "Converted (Appointments Booked)",
      value: totalAppointments.toLocaleString(),
      change: stats?.totalAppointments.change || 0,
      icon: Calendar,
      color: "text-violet-600",
    },
    {
      title: "Overall Conversion Rate",
      value: `${calcConversionRate}%`,
      change: stats?.conversionRate.change || 0,
      icon: TrendingUp,
      color: "text-emerald-600",
    },
  ];

  return (
    <AppLayout title="Analytics" subtitle="Track performance and insights">
      {/* Period Selector */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Badge variant="ai" className="animate-pulse">Live Data Syncing</Badge>
          <span className="text-sm text-muted-foreground">Fetching from database</span>
        </div>
        <Select defaultValue="6m" disabled>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6m">Last 6 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-4 text-ai" />
          <p>Loading real-time analytics...</p>
        </div>
      ) : (
        <>
          {/* Metrics Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {metrics.map((metric) => (
              <Card key={metric.title}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{metric.title}</p>
                      <p className="text-2xl font-semibold mt-1">{metric.value}</p>
                    </div>
                    <div className={`h-10 w-10 rounded-lg bg-secondary flex items-center justify-center ${metric.color}`}>
                      <metric.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {metric.change >= 0 ? (
                      <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${metric.change >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                      {Math.abs(metric.change).toFixed(1)}%
                    </span>
                    <span className="text-sm text-muted-foreground">vs last period</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            {/* Leads Over Time (Live Data) */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Leads Generated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={leadData || []}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                      />
                      <Bar dataKey="leads" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Total Leads" />
                      <Bar dataKey="aiGenerated" fill="hsl(var(--ai))" radius={[4, 4, 0, 0]} name="AI Generated" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Conversion Comparison (Dummy Data - Placeholder) */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">AI vs Human Conversion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={conversionData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" unit="%" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                        formatter={(value: number) => [`${value}%`, ""]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="ai" 
                        stroke="hsl(var(--ai))" 
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--ai))" }}
                        name="AI Qualified"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="human" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))" }}
                        name="Human Qualified"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Section */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Lead Sources (Live Data) */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Lead Sources</CardTitle>
              </CardHeader>
              <CardContent>
                {sourceData.length > 0 ? (
                  <>
                    <div className="h-[200px] flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={sourceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            dataKey="value"
                          >
                            {sourceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px"
                            }}
                            formatter={(value: number) => [`${value}%`, ""]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {sourceData.map((source) => (
                        <div key={source.name} className="flex items-center gap-2">
                          <div 
                            className="h-3 w-3 rounded-full shrink-0" 
                            style={{ backgroundColor: source.color }}
                          />
                          <span className="text-xs text-muted-foreground truncate" title={source.name}>
                            {source.name}
                          </span>
                          <span className="text-xs font-medium ml-auto">{source.value}%</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
                    No source data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">AI Performance Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-ai-muted">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-ai/10 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-ai" />
                      </div>
                      <div>
                        <p className="font-medium">AI Qualification Accuracy</p>
                        <p className="text-sm text-muted-foreground">Based on conversion outcomes</p>
                      </div>
                    </div>
                    <span className="text-2xl font-semibold text-ai">87%</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Average Response Time</p>
                        <p className="text-sm text-muted-foreground">AI chatbot first response</p>
                      </div>
                    </div>
                    <span className="text-2xl font-semibold">&lt;3s</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium">Appointment Success Rate</p>
                        <p className="text-sm text-muted-foreground">Scheduled via AI</p>
                      </div>
                    </div>
                    <span className="text-2xl font-semibold text-emerald-600">92%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </AppLayout>
  );
}