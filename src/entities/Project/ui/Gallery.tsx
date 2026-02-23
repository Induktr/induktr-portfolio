import { useMemo } from "react";
import { ProjectSlider } from "./ProjectSlider";

import { ProjectGalleryItem } from "@/shared/types/project";
import { GalleryProps } from "@/shared/types/modal";

export const Gallery = ({ project, className }: GalleryProps) => {
  const galleryItems = useMemo<ProjectGalleryItem[]>(() => {
    if (project.gallery && project.gallery.length > 0) {
      return project.gallery;
    }
    
    const items: ProjectGalleryItem[] = [];

    if (project.video) {
      items.push({ 
        type: 'video' as const, 
        url: project.video, 
        title: project.title 
      });
    }

    if (project.image) {
      items.push({ 
        type: 'image' as const, 
        url: project.image, 
        title: project.title 
      });
    }

    return items;
  }, [project.gallery, project.video, project.image, project.title]);

  return <ProjectSlider items={galleryItems} className={className} />;
};
