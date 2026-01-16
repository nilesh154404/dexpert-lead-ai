import { Mail, Phone, Building2, Clock, Sparkles, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IntentIndicator } from "./IntentIndicator";
import { cn } from "@/lib/utils";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: "new" | "qualified" | "nurturing" | "converted" | "lost";
  intentScore: number;
  aiSummary: string;
  lastInteraction: string;
  source: string;
}

interface LeadCardProps {
  lead: Lead;
  onClick?: () => void;
}

export function LeadCard({ lead, onClick }: LeadCardProps) {
  return (
    <div
      className="rounded-xl border bg-card p-5 hover:shadow-card-hover transition-all cursor-pointer group"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
            {lead.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <h3 className="font-medium">{lead.name}</h3>
            {lead.company && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {lead.company}
              </p>
            )}
          </div>
        </div>
        <IntentIndicator score={lead.intentScore} />
      </div>

      {/* AI Summary */}
      <div className="mt-4 ai-card p-3">
        <div className="flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-ai shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/80">{lead.aiSummary}</p>
        </div>
      </div>

      {/* Meta */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Badge variant={lead.status as any}>{lead.status}</Badge>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {lead.lastInteraction}
          </span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          View
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
