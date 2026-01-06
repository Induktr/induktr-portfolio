export interface ToolItem {
  name: string;
  icon: string;
  description: string;
}

export interface ToolCategory {
  id: string;
  category: string;
  items: ToolItem[];
}
