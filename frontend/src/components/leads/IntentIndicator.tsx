import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sparkles } from "lucide-react";

interface IntentIndicatorProps {
  score: number;
  confidence?: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function IntentIndicator({
  score,
  confidence = 85,
  showLabel = true,
  size = "md",
}: IntentIndicatorProps) {
  const getIntentLevel = () => {
    if (score >= 85) return { label: "Hot", color: "text-red-600", bg: "bg-red-100", ring: "ring-red-500/20" };
    if (score >= 70) return { label: "Warm", color: "text-amber-600", bg: "bg-amber-100", ring: "ring-amber-500/20" };
    if (score >= 50) return { label: "Cool", color: "text-blue-600", bg: "bg-blue-100", ring: "ring-blue-500/20" };
    return { label: "Cold", color: "text-slate-500", bg: "bg-slate-100", ring: "ring-slate-500/20" };
  };

  const intent = getIntentLevel();
  
  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base",
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "rounded-full flex items-center justify-center font-semibold ring-2",
              intent.bg,
              intent.color,
              intent.ring,
              sizeClasses[size]
            )}
          >
            {score}
          </div>
          {showLabel && (
            <span className={cn("text-sm font-medium", intent.color)}>
              {intent.label}
            </span>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-ai" />
            <span className="text-xs font-medium">AI Intent Analysis</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Intent Score: {score}% ({intent.label})
          </p>
          <p className="text-xs text-muted-foreground">
            Confidence: {confidence}%
          </p>
          <p className="text-xs text-muted-foreground">
            Based on conversation patterns, engagement frequency, and behavioral signals.
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
