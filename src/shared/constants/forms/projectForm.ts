export interface InitialProjectFormData {
  title: string;
  shortDescription: string;
  description: string;
  features: string[];
  tags: string[];
  techStack: string[];
  roadmap: any[];
  docs: any[];
  usage: any[];
}

export const INITIAL_PROJECT_FORM_DATA: InitialProjectFormData = {
  title: "",
  shortDescription: "",
  description: "",
  features: [],
  tags: [],
  techStack: [],
  roadmap: [],
  docs: [],
  usage: [],
};

export const PROJECT_STATUS_OPTIONS = [
  { value: "completed", label: "Completed" },
  { value: "active", label: "Active" },
  { value: "upcoming", label: "Upcoming" },
  { value: "in-development", label: "In Development" },
] as const;
