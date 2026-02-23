export interface DocPage {
  id: string;
  title: string;
  content: string;
}

export interface VideoResource {
  id: string;
  title: string;
  description: string;
  url: string;
  duration: string;
  type: 'walkthrough' | 'showcase' | 'tutorial';
}

export interface SubTask {
  label: string;
  completed: boolean;
}

export interface MarketplaceTask {
  label: string;
  completed: boolean;
  subtasks?: SubTask[];
}

export interface MarketplaceStage {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'todo';
  tasks: MarketplaceTask[];
}

export interface ProjectMarketplaceData {
  videos: VideoResource[];
  roadmap: MarketplaceStage[];
  docs: DocPage[];
}
