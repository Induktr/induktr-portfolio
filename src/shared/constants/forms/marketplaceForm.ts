export interface InitialMarketplaceFormData {
  title: string;
  description: string;
  features: string[];
}

export const INITIAL_MARKETPLACE_FORM_DATA: InitialMarketplaceFormData = {
  title: "",
  description: "",
  features: [],
};

export const DEFAULT_MARKETPLACE_GRADIENT = "from-blue-600 to-cyan-500";
export const DEFAULT_MARKETPLACE_STACK: readonly string[] = ["React", "TypeScript"] as const;
