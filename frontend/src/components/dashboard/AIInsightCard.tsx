import { Sparkles, TrendingUp, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AIInsightCardProps {
  title: string;
  insight: string;
  confidence: number;
  type?: "recommendation" | "alert" | "trend";
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function AIInsightCard({
  title,
  insight,
  confidence,
  type = "recommendation",
  action,
  className,
}: AIInsightCardProps) {
  const Icon = type === "alert" ? AlertTriangle : type === "trend" ? TrendingUp : Sparkles;
  
  return (
    <div className={cn("ai-card p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={cn(
            "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
            type === "alert" ? "bg-warning/10 text-warning" : "bg-ai/10 text-ai"
          )}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium">{title}</h4>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <Info className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-xs">
                    AI confidence: {confidence}%. This recommendation is based on conversation analysis and behavioral patterns.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{insight}</p>
          </div>
        </div>
      </div>
      
      {action && (
        <div className="mt-3 pt-3 border-t border-ai/10">
          <Button 
            variant="ai-ghost" 
            size="sm" 
            onClick={action.onClick}
            className="w-full justify-center"
          >
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
