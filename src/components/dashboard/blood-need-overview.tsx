import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { useAuth } from "@/context/auth-context";
import { useSelector } from "@/store/store";
import { memo } from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const BloodNeedOverviewComponent = ({ date }: { date: Date }) => {
  const { user } = useAuth();
  const stats = useSelector((state) => state.dashboard.stats);

  // useEffect(() => {
  //   dispatch(
  //     getCommunityDashboardStatsNeedGraphs({
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

  const yTicks = getYTicks(stats?.monthlyRequests);

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
        <LineChart data={stats?.monthlyRequests}>
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
            tickFormatter={(value) => Math.floor(value).toString()}
            ticks={yTicks}
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
};

// Custom comparison function
const areEqual = (prevProps: { date: Date }, nextProps: { date: Date }) => {
  // Only re-render if the year actually changes
  return prevProps.date.getFullYear() === nextProps.date.getFullYear();
};

export const BloodNeedOverview = memo(BloodNeedOverviewComponent, areEqual);
