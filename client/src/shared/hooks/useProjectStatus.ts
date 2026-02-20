import { useTranslation } from "react-i18next";
import { useCallback } from "react";

/**
 * Status colors mapping for consistency across the application.
 */
const statusColors = {
  completed: "bg-green-500",
  active: "bg-blue-500",
  upcoming: "bg-amber-500",
  "in-development": "bg-cyan-500",
} as const;

export type ProjectStatus = keyof typeof statusColors;

/**
 * Custom hook to manage project status themes and labels.
 * Provides a centralized way to get colors and localized labels for project statuses.
 */
export const useProjectStatus = () => {
  const { t } = useTranslation();

  const getStatusColor = useCallback((status: string): string => {
    return statusColors[status as ProjectStatus] || "bg-gray-500";
  }, []);

  const getStatusLabel = useCallback((status: string): string => {
    if (status === "in-development") {
      return t('projects.dialog.status.inDevelopment', 'In Development');
    }
    return t(`projects.dialog.status.${status}`, status);
  }, [t]);

  return {
    getStatusColor,
    getStatusLabel,
    statusColors
  };
};

/**
 * A simple hook for generating deterministic but varied colors based on a string.
 * This can be used for tags, categories, etc.
 */
export const useStringColor = () => {
  const colors = [
    "bg-red-500/10 text-red-500 border-red-500/20",
    "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "bg-green-500/10 text-green-500 border-green-500/20",
    "bg-purple-500/10 text-purple-500 border-purple-500/20",
    "bg-amber-500/10 text-amber-500 border-amber-500/20",
    "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    "bg-pink-500/10 text-pink-500 border-pink-500/20",
    "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  ];

  const getColorFromString = useCallback((str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }, [colors]);

  return { getColorFromString };
};
