export interface ToolItem {
  id?: string | number;
  name: string;
  icon: string;
  description: string;
  category?: string;
  slug?: string;
  isFromDb?: boolean;
  rawDbData?: any;
}

export interface ToolCategory {
  id: string;
  category: string;
  items: ToolItem[];
}

export interface ComparisonData {
  name: string;
  performance: number;
  reliability: number;
  usability: number;
}

