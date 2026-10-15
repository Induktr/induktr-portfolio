import { useTheme } from "@/shared/providers/theme-provider";
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { toolComparisonData } from "@/shared/constants/data/tools";
import { getChartThemeConfig } from "@/shared/constants/charts/chartTheme";

export const ToolComparison = () => {
  const { theme } = useTheme();
  const chartTheme = getChartThemeConfig(theme);

  return (
    <div className="space-y-6">
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={toolComparisonData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={chartTheme.gridStroke}
            />
            <XAxis
              dataKey="name"
              stroke={chartTheme.axisStroke}
            />
            <YAxis
              stroke={chartTheme.axisStroke}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={chartTheme.tooltipStyle}
            />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
