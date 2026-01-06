export interface ProjectPhase {
  name: string;
  duration: string;
  status: 'completed' | 'active' | 'upcoming';
}

export interface ProjectTimeline {
  start: string;
  phases: ProjectPhase[];
}

export interface ProjectChecklistItem {
  title: string;
  items: string[];
}

export interface ProjectTask {
  title: string;
  checklists: ProjectChecklistItem[];
}

export interface ProjectRoadmapStage {
  stage: number;
  title: string;
  duration: string;
  goal: string;
  tasks: ProjectTask[];
}

export interface ProjectLinks {
  github?: string;
  live?: string;
  srcbook?: string;
  cursor?: string;
}

export interface AdditionalTechGroup {
  title: string;
  items: string[];
}

export interface Project {
  id: number;
  title: string;
  shortDescription: string;
  description: string;
  image: string;
  video?: string;
  status: 'completed' | 'active' | 'upcoming' | 'in-development';
  categories: string[];
  techStack: string[];
  tags: string[];
  links: ProjectLinks;
  features: string[];
  timeline: ProjectTimeline;
  roadmap?: ProjectRoadmapStage[];
  additionalTech?: {
    mediaTools?: AdditionalTechGroup;
    formTools?: AdditionalTechGroup;
    cmsTools?: AdditionalTechGroup;
    performanceTools?: AdditionalTechGroup;
    testingTools?: AdditionalTechGroup;
    devopsTools?: AdditionalTechGroup;
    developmentTools?: AdditionalTechGroup;
  };
}
