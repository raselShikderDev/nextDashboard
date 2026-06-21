import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { StatsBadge } from "../../../components/StatsBadge";
import { formatCurrency, formatNumber } from "@/app/helpers/helpers";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number;
  growth?: number;
  icon: LucideIcon;
  format?: "number" | "currency" | "percent";
  color?: "blue" | "green" | "purple" | "orange" | "red";
  index?: number;
}

const colorMap = {
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  green: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  purple:
    "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  orange:
    "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  red: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

export function StatsCard({
  title,
  value,
  growth,
  icon: Icon,
  format = "number",
  color = "blue",
  index = 0,
}: StatsCardProps) {
  const displayValue =
    format === "currency"
      ? formatCurrency(value)
      : format === "percent"
        ? `${value}%`
        : formatNumber(value);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center",
            colorMap[color],
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
        {growth !== undefined && <StatsBadge value={growth} />}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold tracking-tight">{displayValue}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{title}</p>
      </div>
    </motion.div>
  );
}
