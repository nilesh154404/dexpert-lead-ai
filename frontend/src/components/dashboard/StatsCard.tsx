import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    label: string;
  };
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = "text-ai",
  className,
}: StatsCardProps) {
  const isPositive = change && change.value >= 0;
  
  return (
    <div className={cn(
      "rounded-xl border bg-card p-5 transition-all hover:shadow-card-hover",
      className
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
          
          {change && (
            <div className="flex items-center gap-1.5 mt-2">
              {isPositive ? (
                <TrendingUp className="h-3.5 w-3.5 text-success" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-destructive" />
              )}
              <span className={cn(
                "text-xs font-medium",
                isPositive ? "text-success" : "text-destructive"
              )}>
                {isPositive && "+"}{change.value}%
              </span>
              <span className="text-xs text-muted-foreground">{change.label}</span>
            </div>
          )}
        </div>
        
        <div className={cn(
          "h-10 w-10 rounded-lg flex items-center justify-center bg-secondary",
          iconColor
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
