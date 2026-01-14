import { ComparisonData } from "../types/tools";

export const CLOUD_DOCS_BASE_URL = 'https://raw.githubusercontent.com/Induktr/induktr-portfolio/main/client/public';

export const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

export const navItemVariants = {
  hover: { scale: 1.05, color: "hsl(var(--primary))" },
  tap: { scale: 0.95 }
};

export const logoVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

export const toolComparisonData: ComparisonData[] = [
  {
    name: "BrainMessenger",
    performance: 95,
    reliability: 90,
    usability: 88
  },
  {
    name: "FinanceFlow",
    performance: 92,
    reliability: 94,
    usability: 85
  },
  {
    name: "BuildKo",
    performance: 88,
    reliability: 92,
    usability: 90
  },
  {
    name: "BueatyLove",
    performance: 86,
    reliability: 88,
    usability: 94
  }
];

export const statusColors = {
  completed: "bg-green-500",
  active: "bg-blue-500",
  upcoming: "bg-amber-500",
  "in-development": "bg-purple-500",
};

export const getStatusColor = (status: string) => {
  return statusColors[status as keyof typeof statusColors] || "bg-gray-500";
};