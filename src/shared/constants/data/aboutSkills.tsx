import React from "react";
import { 
  SiTypescript, 
  SiJavascript, 
  SiTailwindcss, 
  SiVite, 
  SiFigma, 
  SiGit,
  SiNextdotjs,
  SiNodedotjs,
  SiSolana,
  SiJest,
} from "react-icons/si";

export interface SkillItem {
  name: string;
  icon: React.ReactNode;
  years: string;
  level: number;
}

export interface AdditionalSkillItem {
  name: string;
  icon: React.ReactNode;
}

export const MAIN_SKILLS: readonly SkillItem[] = [
  { 
    name: "React 19 & Next.js", 
    icon: <SiNextdotjs className="w-5 h-5 text-white" />, 
    years: "2+", 
    level: 98 
  },
  { 
    name: "TypeScript & Systems", 
    icon: <SiTypescript className="w-5 h-5 text-blue-500" />, 
    years: "2+", 
    level: 95 
  },
  { 
    name: "Web3 / SVM & Solana", 
    icon: <SiSolana className="w-5 h-5 text-purple-400" />, 
    years: "1+", 
    level: 90 
  },
  { 
    name: "Tailwind v4 & High-Perf UI", 
    icon: <SiTailwindcss className="w-5 h-5 text-cyan-400" />, 
    years: "2+", 
    level: 95 
  },
  { 
    name: "Testing (Jest / Playwright / k6)", 
    icon: <SiJest className="w-5 h-5 text-red-400" />, 
    years: "2+", 
    level: 92 
  },
] as const;

export const ADDITIONAL_SKILLS: readonly AdditionalSkillItem[] = [
  { name: "V8 & Memory Profiling", icon: <SiJavascript /> },
  { name: "Vite / Turbopack", icon: <SiVite /> },
  { name: "Node.js & FSD", icon: <SiNodedotjs /> },
  { name: "Git / CI/CD", icon: <SiGit /> },
  { name: "Figma", icon: <SiFigma /> },
] as const;
