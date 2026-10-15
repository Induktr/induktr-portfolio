import { useState, useMemo } from "react";
import type { Project } from "@/shared/types/project";

export function useProjectFilter(projects: Project[]) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProjects = useMemo(() => {
    if (activeCategory === "all") return projects;
    return projects.filter((p) => p.categories.includes(activeCategory));
  }, [activeCategory, projects]);

  const onSelectCategory = (id: string) => {
    setActiveCategory((prev) => (prev === id ? "all" : id));
  };

  return {
    activeCategory,
    setActiveCategory,
    filteredProjects,
    onSelectCategory,
  };
}
