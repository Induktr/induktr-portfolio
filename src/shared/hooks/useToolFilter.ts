import { useState, useMemo } from "react";
import type { ToolCategory } from "@/shared/types/tools";

export function useToolFilter(categories: ToolCategory[]) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTools = useMemo(() => {
    if (!selectedCategory) return categories;
    return categories.filter((category) => category.category === selectedCategory);
  }, [categories, selectedCategory]);

  return {
    selectedCategory,
    setSelectedCategory,
    filteredTools,
  };
}
