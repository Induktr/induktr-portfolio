"use client";

import { useMemo, useState } from "react";
import { useProjects } from "@/shared/hooks/useProjects";
import { ProjectCard } from "@/entities/Project/ui/ProjectCard";
import { ProjectCategories } from "@/entities/Project/ui/ProjectCategories";
import { ProjectDialog } from "@/entities/Project/ui/ProjectDialog";
import { PageTransition } from "@/shared/ui/PageTransition";
import { Skeleton } from "@/shared/ui/skeleton";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/shared/hooks/useAuth";
import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";
import { ProjectForm } from "@/entities/Project/ui/ProjectForm";
import { useAppDispatch } from "@/shared/lib/store/store";
import { openModal } from "@/shared/lib/store/slices/uiSlice";

// Nuqs for advanced/encrypted URL params
import { useQueryState } from 'nuqs';
import { parseAsBase64Json } from '@/shared/lib/parsers';

export default function ProjectsPage() {
  const { PROJECTS, isLoading } = useProjects();
  const [activeCategory, setActiveCategory] = useState("all");
  const { t } = useTranslation();
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  const [activeProjectToken, setActiveProjectToken] = useQueryState(
    'pax', 
    parseAsBase64Json<{slug: string, id: string, idx: number}>()
  );

  const filteredProjects = useMemo(() => {
    if (activeCategory === "all") return PROJECTS;
    return PROJECTS.filter((p) => p.categories.includes(activeCategory));
  }, [activeCategory, PROJECTS]);

  const viewProject = useMemo(() => {
    if (!activeProjectToken?.slug) return null;
    return PROJECTS.find(p => p.slug === activeProjectToken.slug);
  }, [activeProjectToken, PROJECTS]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold"
          >
            {t('projects.title')}
          </motion.h1>

          {user && (
            <Button className="gap-2" onClick={() => dispatch(openModal({ modalName: "projectForm" }))}>
              <Plus className="w-5 h-5" /> Add Project
            </Button>
          )}
        </div>

        <ProjectForm />

        <ProjectCategories
          categories={[
            { id: "browser", name: "Web Sites", icon: "browser", description: "" },
            { id: "trading", name: "Trading Bots", icon: "trading", description: "" },
            { id: "ai", name: "AI Agents", icon: "ai", description: "" },
            { id: "mobile", name: "Mobile Apps", icon: "mobile", description: "" }
          ]}
          selectedCategories={activeCategory === "all" ? [] : [activeCategory]}
          onSelectCategory={(id) => setActiveCategory(activeCategory === id ? "all" : id)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  setActiveProjectToken({ 
                    slug: project.slug || "", 
                    id: String(project.id), 
                    idx: index 
                  });
                }}
                className="cursor-pointer"
              >
                <ProjectCard 
                  project={project} 
                  onEdit={(p) => dispatch(openModal({ modalName: "projectForm", editingItem: p }))}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {viewProject && (
          <ProjectDialog
            project={viewProject}
            isOpen={!!viewProject}
            onClose={() => setActiveProjectToken(null)}
          />
        )}
      </div>
    </PageTransition>
  );
}
