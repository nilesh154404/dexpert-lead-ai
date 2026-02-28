import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { tenantsAdminApi } from "@/lib/api/tenants-admin.api";
import { 
  CreditCard, 
  Calendar, 
  IndianRupee, 
  Loader2, 
  Globe, 
  ArrowUpRight,
  Activity,
  Link2
} from "lucide-react";

export const SuperAdminDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["superadmin-tenants"],
    queryFn: tenantsAdminApi.getAll,
  });

  const tenants = data?.data || [];

  return (
    <AppLayout 
      title="Platform Command Center" 
      subtitle="Comprehensive overview of network health and revenue"
    >
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0A0A0F] p-4">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#1eb4a1]" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tenants.map((tenant) => (
              <Card 
                key={tenant.id} 
                className="group relative overflow-hidden border-none bg-white shadow-lg transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl dark:bg-[#161b22]"
              >
                <CardContent className="p-6">
                  {/* Header Section */}
                  <div className="mb-6 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0f2f5] text-[#0f1b29] transition-colors group-hover:bg-[#1eb4a1] group-hover:text-white dark:bg-[#0f1b29] dark:text-[#1eb4a1]">
                        <Globe className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold tracking-tight text-[#0f1b29] dark:text-white">
                          {tenant.name}
                        </h3>
                        {/* Replaced Tenant ID with a cleaner Domain view */}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Link2 className="h-3 w-3" />
                          <span>{tenant.name.toLowerCase().replace(/\s+/g, '-')}.dexpert.ai</span>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      className={`${
                        tenant.status === 'active' 
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" 
                          : "bg-rose-100 text-rose-700 hover:bg-rose-100"
                      } border-none px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all group-hover:px-4`}
                    >
                      {tenant.status}
                    </Badge>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 rounded-2xl bg-[#f8fafc] p-4 transition-colors group-hover:bg-[#f1f5f9] dark:bg-[#0f1b29]/50">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <CreditCard className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-medium uppercase">Plan</span>
                      </div>
                      <p className="text-sm font-bold text-[#0f1b29] dark:text-white">
                        {(tenant as any).subscription?.planName || "Trial"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-medium uppercase">Expiry</span>
                      </div>
                      <p className="text-sm font-bold text-[#0f1b29] dark:text-white">
                        {(tenant as any).subscription?.endDate 
                          ? new Date((tenant as any).subscription.endDate).toLocaleDateString() 
                          : "Permanent"}
                      </p>
                    </div>
                  </div>

                  {/* Revenue Footer */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-semibold uppercase text-muted-foreground">Contribution</span>
                      <div className="flex items-center gap-1 text-xl font-black text-[#1eb4a1]">
                        <IndianRupee className="h-4 w-4" />
                        <span>{(tenant as any).subscription?.price || "0"}</span>
                      </div>
                    </div>
                    
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0f1b29] text-white shadow-lg transition-all duration-300 hover:rotate-12 group-hover:scale-110 dark:bg-[#1eb4a1]">
                      <ArrowUpRight className="h-5 w-5" />
                    </button>
                  </div>
                </CardContent>

                {/* Background Subtle Pattern */}
                <Activity className="absolute -bottom-4 -right-4 h-24 w-24 opacity-[0.03] text-[#0f1b29] transition-transform duration-700 group-hover:scale-150" />
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};