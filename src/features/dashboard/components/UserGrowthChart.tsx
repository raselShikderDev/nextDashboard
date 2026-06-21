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

export function UserGrowthChart({ data, isLoading }: UserGrowthChartProps) {
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
        <h3 className="text-lg font-semibold tracking-tight">User Growth</h3>

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
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;

              return (
                <div
                  className="
          min-w-[180px]
          rounded-2xl
          border border-border/50
          bg-background/80
          backdrop-blur-xl
          shadow-xl
          px-4 py-3
        "
                >
                  <p className="mb-3 text-sm font-semibold text-primary">
                    {label}
                  </p>

                  {payload.map((entry) => (
                    <div
                      key={entry.name}
                      className="flex items-center justify-between gap-6 py-1"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2.5 w-2.5 rounded-full"
                          style={{
                            backgroundColor: String(entry.color),
                          }}
                        />

                        <span className="text-sm text-foreground">
                          {entry.name}
                        </span>
                      </div>

                      <span className="text-sm font-semibold text-foreground">
                        {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              );
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
            radius={[10, 10, 0, 0]}
            maxBarSize={28}
          />

          <Bar
            dataKey="active"
            name="Active Users"
            fill="#8B5CF6"
            radius={[10, 10, 0, 0]}
            maxBarSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
