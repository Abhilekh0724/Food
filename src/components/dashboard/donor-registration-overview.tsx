import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { useAuth } from "@/context/auth-context";
import { useSelector } from "@/store/store";
import { devLog } from "@/util/logger";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export function DonorRegistrationOverview({ date }: { date: Date }) {
  const { user } = useAuth();
  const stats = useSelector((state) => state.dashboard.stats);

  // useEffect(() => {
  //   dispatch(
  //     getCommunityDashboardStatsDonorsGraphs({
  //       user,
  //       year: date.getFullYear(),
  //     })
  //   );
  // }, [user, date]);

  // Calculate unique Y-axis ticks based on data to avoid repetition
  const getYTicks = (data: any) => {
    if (!data || !data.length) return [];
    const values = data.map((item: any) => item.total);
    const min = Math.floor(Math.min(...values));
    const max = Math.ceil(Math.max(...values));
    const step = Math.ceil((max - min) / 5); // Adjust step for ~5 ticks
    const ticks = [];
    for (let i = min; i <= max; i += step) {
      ticks.push(i);
    }
    return ticks;
  };

  const yTicks = getYTicks(stats?.monthlyDonors);

  devLog(yTicks, "yTickes, donor");

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
        <LineChart data={stats?.monthlyDonors}>
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
            tickFormatter={(value) => Math.floor(value).toString()} // Convert to string
            ticks={yTicks} // Use calculated ticks to avoid repetition
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
