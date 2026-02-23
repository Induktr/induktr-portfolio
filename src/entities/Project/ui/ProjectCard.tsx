import { useProjectData } from "@/shared/hooks/useProjectData";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { ExternalLink, LucideGitFork } from "lucide-react";

import { useProjectStatus, useStringColor } from "@/shared/hooks/useProjectStatus";
import { motion } from "framer-motion";
import { useAuth } from "@/shared/hooks/useAuth";
import { useProjects } from "@/shared/hooks/useProjects";
import { Settings, Trash2 } from "lucide-react";

import type { ProjectCardProps, Project } from "@/shared/types/project";

interface ExtendedProjectCardProps extends ProjectCardProps {
  onEdit?: (project: Project) => void;
}

export const ProjectCard = ({ project, onEdit }: ExtendedProjectCardProps) => {
  const { t } = useTranslation();
  const { entries } = useProjectData(project.links, []);
  const { arrays: tags } = useProjectData({}, project.tags);
  const { getStatusColor, getStatusLabel } = useProjectStatus();
  const { getColorFromString } = useStringColor();
  const { user } = useAuth();
  const { deleteProjectMutation } = useProjects();

  return (
    <Card className="overflow-hidden h-full flex flex-col group border-primary/10 hover:border-primary/30 transition-all bg-card/40 backdrop-blur-sm shadow-xl hover:shadow-primary/5">
      <div className="relative overflow-hidden aspect-video">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${project.image})` }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        <div className="absolute top-2 right-2">
           <Badge
            variant="outline"
            className={`${getStatusColor(
              project.status
            )} text-white border-none shadow-glow-sm`}
          >
            {getStatusLabel(project.status)}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold tracking-tight">{project.title}</CardTitle>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {project.isFromDb 
            ? project.shortDescription 
            : t(`projectsData.${project.id.toString().replace('static-', '')}.shortDescription`, project.shortDescription)}
        </p>

         <div className="flex flex-wrap gap-1 mb-4">
          {tags.map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className={`text-[10px] border-none px-2 py-0 ${getColorFromString(tag)}`}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <div className="p-4 pt-0 mt-auto flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 font-semibold group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
          // Interaction is now managed by the parent via URL state/Redux orchestration
        >
          {t('projects.card.moreDetails')}
        </Button>
        
        <div className="flex gap-2">
          {entries.map(([source, link]) => (
            <Button
              key={source}
              variant="outline"
              size="icon"
              asChild
              className="h-9 w-9 hover:border-primary/50 transition-colors"
            >
              <a
                href={link as string}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                {source === "github" ? (
                  <LucideGitFork className="h-4 w-4" />
                ) : (
                  <ExternalLink className="h-4 w-4"/>
                )}
                <span className="sr-only">{source}</span>
              </a>
            </Button>
          ))}
        </div>

        {user && (
          <div className="flex gap-2 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-blue-500 hover:text-blue-400 hover:bg-blue-500/10"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(project);
              }}
            >
              <Settings className="h-4 w-4" />
            </Button>
            
            {project.isFromDb && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Are you sure you want to delete this project?")) {
                    deleteProjectMutation.mutate(project.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
