import { useState, useMemo, useEffect } from "react";
import { Project } from "@/shared/types/project";
import { useFetchDocContent } from "./useFetchDocContent";

/**
 * Custom hook to manage project documentation state.
 * Handles chapter selection, path resolution, and content fetching.
 */
export const useProjectDocs = (project: Project, isOpen: boolean, activeTab: string) => {
  const [currentChapter, setCurrentChapter] = useState<number | null>(null);

  const activeDocPath = useMemo(() => {
    // If a chapter is selected and has a file path, use it
    if (currentChapter !== null && project.docs?.[currentChapter]?.file) {
      return project.docs[currentChapter].file;
    }
    // Otherwise fallback to the main project documentation file
    return project.docFile;
  }, [currentChapter, project.docs, project.docFile]);

  // Use the previously created fetch hook for the actual data fetching
  const { content: docContent, setContent: setDocContent, isLoading } = useFetchDocContent(activeDocPath, isOpen);

  // Sync state: Reset documentation state when tab changes or dialog closes
  useEffect(() => {
    if (activeTab !== "docs" || !isOpen) {
      setCurrentChapter(null);
      // Only clear content if we don't have a default docFile to show
      if (!project.docFile) {
        setDocContent(null);
      }
    }
  }, [activeTab, isOpen, project.docFile, setDocContent]);

  return {
    currentChapter,
    setCurrentChapter,
    activeDocPath,
    docContent,
    setDocContent,
    isLoading
  };
};
