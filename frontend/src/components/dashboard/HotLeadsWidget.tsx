import { Flame, ArrowRight, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { leadsApi, Lead } from "@/lib/api/leads.api";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

function getIntentColor(score: number) {
  if (score >= 85) return "intent-hot";
  if (score >= 70) return "intent-warm";
  return "intent-cool";
}

export function HotLeadsWidget() {
  const navigate = useNavigate();
  const { data: hotLeads, isLoading } = useQuery({
    queryKey: ["hot-leads"],
    queryFn: () => leadsApi.getHotLeads(5),
  });

  const formatLastActivity = (dateString?: string) => {
    if (!dateString) return "Never";
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="p-4 border-b">
          <div className="h-6 bg-secondary animate-pulse rounded w-32" />
        </div>
        <div className="divide-y">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4">
              <div className="h-4 bg-secondary animate-pulse rounded w-3/4 mb-2" />
              <div className="h-3 bg-secondary animate-pulse rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const leads: Lead[] = hotLeads || [];

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center">
            <Flame className="h-4 w-4 text-red-600" />
          </div>
          <div>
            <h3 className="font-medium">Hot Leads</h3>
            <p className="text-xs text-muted-foreground">AI-qualified, high intent</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => navigate("/leads")}>
          View all
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      <div className="divide-y">
        {leads.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No hot leads at the moment
          </div>
        ) : (
          leads.map((lead) => (
            <div
              key={lead.id}
              className="p-4 hover:bg-secondary/50 transition-colors cursor-pointer"
              onClick={() => navigate(`/leads/${lead.id}`)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm truncate">{lead.name}</h4>
                    <Badge variant={getIntentColor(lead.intentScore) as any}>
                      {lead.intentScore}%
                    </Badge>
                  </div>
                  {lead.company && (
                    <p className="text-xs text-muted-foreground mt-0.5">{lead.company}</p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatLastActivity(lead.lastInteractionAt)}
                </span>
              </div>
              
              {lead.aiSummary && (
                <div className="mt-2 flex items-start gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-ai shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground line-clamp-2">{lead.aiSummary}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
