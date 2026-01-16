import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { leadsApi } from "@/lib/api/leads.api";
import { useMemo } from "react";

interface FunnelStage {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export function LeadFunnelWidget() {
  const { data: leadsData, isLoading } = useQuery({
    queryKey: ["leads", { limit: 1000 }],
    queryFn: () => leadsApi.getAll({ limit: 1000 }),
  });

  const funnelStages = useMemo(() => {
    if (!leadsData?.data) return [];

    const leads = leadsData.data;
    const total = leads.length;

    const stages = [
      { name: "New", status: "new" as const, color: "bg-blue-500" },
      { name: "Qualified", status: "qualified" as const, color: "bg-violet-500" },
      { name: "Nurturing", status: "nurturing" as const, color: "bg-amber-500" },
      { name: "Converted", status: "converted" as const, color: "bg-emerald-500" },
    ];

    let previousCount = total;

    return stages.map((stage) => {
      const count = leads.filter((l) => l.status === stage.status).length;
      const percentage = previousCount > 0 ? (count / previousCount) * 100 : 0;
      previousCount = count;

      return {
        name: stage.name,
        count,
        percentage: Math.round(percentage),
        color: stage.color,
      };
    });
  }, [leadsData]);

  const conversionRate = useMemo(() => {
    if (!leadsData?.data) return 0;
    const total = leadsData.data.length;
    const converted = leadsData.data.filter((l) => l.status === "converted").length;
    return total > 0 ? (converted / total) * 100 : 0;
  }, [leadsData]);

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-5">
        <div className="h-6 bg-secondary animate-pulse rounded w-32 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 bg-secondary animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-medium">Lead Funnel</h3>
          <p className="text-xs text-muted-foreground mt-0.5">This month</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold">{conversionRate.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground">Conversion rate</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {funnelStages.map((stage, index) => (
          <div key={stage.name}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-muted-foreground">{stage.name}</span>
              <span className="text-sm font-medium">{stage.count}</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-500", stage.color)}
                style={{ width: `${stage.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
