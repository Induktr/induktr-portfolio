export interface VideoResource {
  id: string;
  title: string;
  description: string;
  url: string;
  duration: string;
  type: 'walkthrough' | 'showcase' | 'tutorial';
}

export interface DocPage {
  id: string;
  title: string;
  content: string;
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
