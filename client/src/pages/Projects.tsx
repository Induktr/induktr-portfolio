import { ProjectCard } from "@/entities/Project/ui/ProjectCard";
import { ProjectCategories } from "@/entities/Project/ui/ProjectCategories";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Project } from "@/shared/types/project";

export default function Projects() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { t } = useTranslation();

  const projectsDataRaw = t('projectsData', { returnObjects: true });
  
  const PROJECTS = useMemo(() => {
    if (!projectsDataRaw || typeof projectsDataRaw !== 'object' || Array.isArray(projectsDataRaw)) {
      return [] as Project[];
    }
    return Object.values(projectsDataRaw) as Project[];
  }, [projectsDataRaw]);

  const categories = useMemo(() => [
    { id: "web", icon: "browser" },
    { id: "mobile", icon: "mobile" },
    { id: "fintech", icon: "finance" },
    { id: "communication", icon: "message" },
    { id: "ai", icon: "ai" },
    { id: "trading", icon: "trading" }
  ].map(cat => ({
    ...cat,
    name: t(`projects.categories.names.${cat.id}`),
    description: t(`projects.categories.descriptions.${cat.id}`, "")
  })), [t]);

  const filteredProjects = useMemo(() => PROJECTS.filter(project => {
    const matchesCategory = selectedCategories.length === 0 || 
      (project.categories && project.categories.some((cat: string) => selectedCategories.includes(cat)));
    return matchesCategory;
  }), [PROJECTS, selectedCategories]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      }
      return [...prev, categoryId];
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4">{t('pages.projects.title')}</h1>
        <p className="text-muted-foreground text-lg mb-8">
          {t('pages.projects.description')}
        </p>

        <ProjectCategories
          categories={categories}
          selectedCategories={selectedCategories}
          onSelectCategory={handleCategorySelect}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}