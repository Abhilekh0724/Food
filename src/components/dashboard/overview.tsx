import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { useSelector } from "@/store/store";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export function Overview() {
  const stats = useSelector((state) => state.dashboard.stats);

  return (
    <ChartContainer
      config={{
        total: {
          label: "Revenue",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[350px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={stats?.fullYearRevenue}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <ChartTooltip />
          <Line
            type="monotone"
            dataKey="total"
            strokeWidth={2}
            activeDot={{
              r: 6,
              style: { fill: "var(--chart-1)", opacity: 0.8 },
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
