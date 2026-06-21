import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "../lib/utils";

interface StatsBadgeProps {
  value: number;
  suffix?: string;
  className?: string;
}

export function StatsBadge({ value, suffix = "%", className }: StatsBadgeProps) {
  const isPositive = value > 0;
  const isZero = value === 0;
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full", isZero && "bg-muted text-muted-foreground", isPositive && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", !isPositive && !isZero && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", className)}>
      {isZero ? <Minus className="w-3 h-3" /> : isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {isPositive && "+"}{value}{suffix}
    </span>
  );
}
