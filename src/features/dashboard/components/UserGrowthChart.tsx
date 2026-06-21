import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import type { UserGrowthData } from "../../../types";

interface UserGrowthChartProps {
  data: UserGrowthData[];
  isLoading?: boolean;
}

export function UserGrowthChart({
  data,
  isLoading,
}: UserGrowthChartProps) {
  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 animate-pulse">
        <div className="h-5 w-32 bg-muted rounded mb-4" />
        <div className="h-60 bg-muted rounded-xl" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
    >
      <div className="mb-5">
        <h3 className="text-lg font-semibold tracking-tight">
          User Growth
        </h3>

        <p className="text-sm text-muted-foreground">
          Monthly user acquisition and engagement
        </p>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -10,
            bottom: 0,
          }}
          barGap={8}
        >
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
          />

          <Tooltip
            cursor={false}
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

          <Bar
            dataKey="users"
            name="New Users"
            fill="#3B82F6"
            radius={[8, 8, 0, 0]}
          />

          <Bar
            dataKey="active"
            name="Active Users"
            fill="#10B981"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}