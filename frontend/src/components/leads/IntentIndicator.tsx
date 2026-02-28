import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Sparkles } from "lucide-react";

interface IntentIndicatorProps {
  lead?: any;
  conversationsCount?: number;
  appointmentsCount?: number;
  size?: "sm" | "md" | "lg";
}

export function IntentIndicator({ lead, conversationsCount = 0, appointmentsCount = 0, size = "md" }: IntentIndicatorProps) {
  if (!lead) return null;

  // --- FINAL REFINED LOGIC ---
  let score = 20; // Default base for everyone

  // 1. Identification Check
  const name = (lead.name || "").toLowerCase();
  const isRealLead = lead.name && 
                     !name.includes("visitor") && 
                     !name.includes("anonymous") && 
                     !name.includes("tester");

  // 2. Intent Calculation
  if (isRealLead) {
    // Lead is identified: Start at Cool
    score = 55;

    // Engagement: If chatting, move to Warm
    if (conversationsCount > 0 || lead.lastInteractionAt) {
      score = 70;
    }

    // "HOT" RULE: Confirmed appointment AND not anonymous
    if (appointmentsCount > 0 || lead.status === "qualified" || lead.status === "converted") {
      score = 85;
    }
  } else {
    // Lead is anonymous/visitor: Stay Cold/Cool regardless of activity
    score = (conversationsCount > 0 || lead.lastInteractionAt) ? 35 : 20;
  }

  const getIntent = () => {
    if (score >= 85) return { label: "Hot", color: "text-red-600", bg: "bg-red-100" };
    if (score >= 70) return { label: "Warm", color: "text-amber-600", bg: "bg-amber-100" };
    if (score >= 50) return { label: "Cool", color: "text-blue-600", bg: "bg-blue-100" };
    return { label: "Cold", color: "text-slate-500", bg: "bg-slate-100" };
  };

  const intent = getIntent();
  const sizeClasses = { sm: "h-6 w-6 text-xs", md: "h-8 w-8 text-sm", lg: "h-10 w-10 text-base" };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-2">
          <div className={cn("rounded-full flex items-center justify-center font-semibold ring-2 ring-black/5", intent.bg, intent.color, sizeClasses[size])}>
            {score}
          </div>
          <span className={cn("text-sm font-medium", intent.color)}>{intent.label}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">Smart Intent: {score}% ({intent.label})</p>
      </TooltipContent>
    </Tooltip>
  );
}