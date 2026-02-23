import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/shared/lib/queryClient";
import { useToast } from "@/shared/ui";
import type { Project } from "@/shared/types/project";
import { NewProjectRow } from "@shared/api/database/schemas/schema";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import i18n from "i18next";

interface ProjectRow {
  id: number;
  slug: string;
  data: string; // JSON string
  isPublished: number;
}

export function useProjects() {
  const { toast } = useToast();
  const { t } = useTranslation();

  const { data: dbProjects, isLoading } = useQuery<ProjectRow[]>({
    queryKey: ["/api/projects"],
  });

  // Orchestration logic: Merging static i18n translations with Database rows
  // Goal: Centralize data preparation so components stay "lean"
  const PROJECTS = useMemo(() => {
    const projectMap = new Map<string, Project>();
    const projectsDataRaw = t('projectsData', { returnObjects: true });

    if (projectsDataRaw && typeof projectsDataRaw === 'object' && !Array.isArray(projectsDataRaw)) {
      Object.values(projectsDataRaw).forEach((p: any) => {
        const slug = p.slug || p.title.toLowerCase().replace(/ /g, "-");
        projectMap.set(slug, {
          ...p,
          id: `static-${p.id}`,
          slug: slug
        } as Project);
      });
    }
    
    if (dbProjects) {
      const currentLang = i18n.language || 'en';
      dbProjects.forEach(row => {
        try {
          const parsed = JSON.parse(row.data);
          const langData = parsed[currentLang] || parsed['en'] || Object.values(parsed)[0];
          
          if (!langData) return;

          const project = {
            title: "",
            shortDescription: "",
            description: "",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426",
            status: "active",
            categories: [],
            techStack: [],
            tags: [],
            features: [],
            links: {},
            timeline: { start: new Date().getFullYear().toString(), phases: [] },
            ...langData,
            id: `db-${row.id}`,
            slug: row.slug,
            isFromDb: true,
            rawDbData: parsed
          } as Project;

          projectMap.set(row.slug, project);
        } catch (e) {
          console.error("Failed to parse project data", e);
        }
      });
    }
    
    return Array.from(projectMap.values());
  }, [dbProjects, t]);

  const createProjectMutation = useMutation({
    mutationFn: async (project: NewProjectRow) => {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });
      if (!res.ok) throw new Error("Failed to create project");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Success", description: "Project added to portfolio." });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, project }: { id: number; project: Partial<NewProjectRow> }) => {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });
      if (!res.ok) throw new Error("Failed to update project");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Updated", description: "Project changes saved." });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string | number) => {
      const cleanId = id.toString().replace("db-", "");
      if (id.toString().startsWith("static-")) {
        throw new Error("Static projects cannot be deleted via the UI.");
      }
      
      const res = await fetch(`/api/projects/${cleanId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete project");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Deleted", description: "Project removed from database." });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return {
    PROJECTS,
    isLoading,
    createProjectMutation,
    updateProjectMutation,
    deleteProjectMutation,
  };
}
