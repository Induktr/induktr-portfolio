import { useMemo } from "react";
import { Project } from "@/shared/types/project";

/**
 * Custom hook to extract boolean flags about a project's available features.
 * Useful for conditional rendering of tabs, badges, or sections.
 */
export const useProjectFeatures = (project: Project) => {
  return useMemo(() => {
    return {
      hasUsage: !!(project.usage && project.usage.length > 0),
      hasDocs: !!(project.docFile || (project.docs && project.docs.length > 0)),
      hasRoadmap: !!(project.roadmap && project.roadmap.length > 0),
      hasFeatures: !!(project.features && project.features.length > 0),
      hasTechStack: !!(project.techStack && project.techStack.length > 0),
      hasLinks: !!(project.links && Object.keys(project.links).length > 0),
      hasGallery: !!(project.gallery && project.gallery.length > 0) || !!project.image || !!project.video,
    };
  }, [project]);
};
