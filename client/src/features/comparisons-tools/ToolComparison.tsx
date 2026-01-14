import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { useTheme } from "@/shared/lib/theme-provider";
import { toolComparisonData } from "@/shared/lib/constants";

export function ToolComparison() {
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={toolComparisonData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme === "dark" ? "#333" : "#eee"}
            />
            <XAxis
              dataKey="name"
              stroke={theme === "dark" ? "#888" : "#333"}
            />
            <YAxis
              stroke={theme === "dark" ? "#888" : "#333"}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#1a1a1a" : "#fff",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
              }}
            />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
