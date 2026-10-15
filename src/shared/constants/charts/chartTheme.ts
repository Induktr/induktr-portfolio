import { CSSProperties } from "react";

export function getChartThemeConfig(theme?: string) {
  const isDark = theme === "dark";

  return {
    gridStroke: isDark ? "#333" : "#eee",
    axisStroke: isDark ? "#888" : "#333",
    tooltipStyle: {
      backgroundColor: isDark ? "#1a1a1a" : "#fff",
      border: "none",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    } as CSSProperties,
  };
}
