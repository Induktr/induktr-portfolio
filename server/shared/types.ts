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

export interface Task {
  label: string;
  completed: boolean;
}

export interface RoadmapStage {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'todo';
  tasks: Task[];
}

export interface ProjectMarketplaceData {
  videos: VideoResource[];
  roadmap: RoadmapStage[];
  docs: DocPage[];
}

export interface Project {
  id: number;
  title: string;
  shortDescription: string;
  description: string;
  image: string;
  categories: string[];
  techStack: string[];
  status: string;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  price: number;
  stack: string[];
  features: string[];
}
