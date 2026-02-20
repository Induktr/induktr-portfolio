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
}

export interface AdditionalTechGroup {
  title: string;
  items: string[];
}

export interface ProjectDocChapter {
  title: string;
  items?: string[];
  goal?: string;
  content?: string;
  file?: string;
}

export interface ProjectGalleryItem {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  title?: string;
}

export interface ProjectUsageStep {
  title: string;
  description: string;
  actionType: 'navigation' | 'interaction' | 'search' | 'form' | 'result';
}

export interface Project {
  id: string | number;
  isFromDb?: boolean;
  rawDbData?: any; // Full multi-language object from DB
  slug?: string;
  title: string;
  shortDescription: string;
  description: string;
  image: string;
  video?: string;
  gallery?: ProjectGalleryItem[];
  status: 'completed' | 'active' | 'upcoming' | 'in-development';
  categories: string[];
  techStack: string[];
  tags: string[];
  links: ProjectLinks;
  features: string[];
  timeline: ProjectTimeline;
  roadmap?: ProjectRoadmapStage[];
  docs?: ProjectDocChapter[];
  docFile?: string;
  usage?: ProjectUsageStep[];
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

export interface PurchaseDialogProps {
  template: {
    id: string;
    title: string;
    price: number;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (orderId: number, accessCode: string) => void;
}

export interface ProjectCardProps {
  project: Project;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface ProjectCategoriesProps {
  categories: Category[];
  selectedCategories: string[];
  onSelectCategory: (categoryId: string) => void;
}

export interface ProjectDialogProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export interface ProjectGalleryProps {
  project: {
    title: string;
    description: string;
    image: string;
    video?: string;
    features: string[];
    techStack: string[];
    additionalTech?: {
      mediaTools?: {
        title: string;
        items: string[];
      };
      formTools?: {
        title: string;
        items: string[];
      };
      cmsTools?: {
        title: string;
        items: string[];
      };
      performanceTools?: {
        title: string;
        items: string[];
      };
      testingTools?: {
        title: string;
        items: string[];
      };
      devopsTools?: {
        title: string;
        items: string[];
      };
      developmentTools?: {
        title: string;
        items: string[];
      };
    };
  };
}

export interface ProjectSliderProps {
  items: ProjectGalleryItem[];
  className?: string;
}

export interface ProjectUsageProps {
  steps: ProjectUsageStep[];
}
