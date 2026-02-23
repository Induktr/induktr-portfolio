export interface Project {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  image: string;
  categories: string[];
  techStack: string[];
  status: string;
}
