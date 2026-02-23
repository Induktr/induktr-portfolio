import { VideoResource, DocPage, RoadmapStage } from "./content";

export interface Template {
  id: string;
  title: string;
  description: string;
  price: number;
  stack: string[];
  features: string[];
  gradient: string;
}

export interface ProjectMarketplaceData {
  videos: VideoResource[];
  roadmap: RoadmapStage[];
  docs: DocPage[];
}
