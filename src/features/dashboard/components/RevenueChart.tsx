import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import type { RevenueData } from "../../../types";
import { formatCurrency } from "@/app/helpers/helpers";

interface RevenueChartProps {
  data: RevenueData[];
  isLoading?: boolean;
}

export function RevenueChart({ data, isLoading }: RevenueChartProps) {
  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-5 animate-pulse">
        <div className="h-5 w-32 bg-muted rounded mb-4" />
        <div className="h-64 bg-muted rounded" />
      </div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-card border border-border rounded-xl p-5"
    >
      <div className="mb-4">
        <h3 className="font-semibold text-base">Revenue vs Expenses</h3>
        <p className="text-sm text-muted-foreground">
          Monthly financial overview
        </p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart
          data={data}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient id="expensesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(var(--destructive))"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--destructive))"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), ""]}
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: 12,
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="hsl(var(--primary))"
            fill="url(#revenueGrad)"
            strokeWidth={2}
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="hsl(var(--destructive))"
            fill="url(#expensesGrad)"
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
