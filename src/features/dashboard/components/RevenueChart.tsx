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

export function RevenueChart({
  data,
  isLoading,
}: RevenueChartProps) {
  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 animate-pulse">
        <div className="h-5 w-40 bg-muted rounded mb-4" />
        <div className="h-64 bg-muted rounded-xl" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
    >
      <div className="mb-5">
        <h3 className="text-lg font-semibold tracking-tight">
          Revenue vs Expenses
        </h3>

        <p className="text-sm text-muted-foreground">
          Monthly financial overview
        </p>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -10,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient
              id="revenueGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#3B82F6"
                stopOpacity={0.35}
              />
              <stop
                offset="95%"
                stopColor="#3B82F6"
                stopOpacity={0}
              />
            </linearGradient>

            <linearGradient
              id="expenseGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#EF4444"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="#EF4444"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            vertical={false}
            strokeDasharray="4 4"
            stroke="hsl(var(--border))"
            opacity={0.4}
          />

          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 12,
              fill: "hsl(var(--muted-foreground))",
            }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 12,
              fill: "hsl(var(--muted-foreground))",
            }}
            tickFormatter={(value) =>
              `$${(value / 1000).toFixed(0)}k`
            }
          />

          <Tooltip
            cursor={false}
            formatter={(value: number) => [
              formatCurrency(value),
            ]}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "16px",
              color: "hsl(var(--foreground))",
              boxShadow: "0 12px 30px rgba(0,0,0,.18)",
            }}
            labelStyle={{
              color: "hsl(var(--foreground))",
              fontWeight: 600,
            }}
          />

          <Legend
            iconType="circle"
            wrapperStyle={{
              fontSize: "12px",
              paddingTop: "10px",
            }}
          />

          <Area
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#3B82F6"
            fill="url(#revenueGradient)"
            strokeWidth={3}
            dot={false}
            activeDot={{
              r: 6,
              strokeWidth: 2,
            }}
          />

          <Area
            type="monotone"
            dataKey="expenses"
            name="Expenses"
            stroke="#EF4444"
            fill="url(#expenseGradient)"
            strokeWidth={3}
            dot={false}
            activeDot={{
              r: 6,
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}