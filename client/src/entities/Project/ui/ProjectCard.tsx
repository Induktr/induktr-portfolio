import { useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Github, ExternalLink } from "lucide-react";
import { ProjectDialog } from "./ProjectDialog";

import { motion } from "framer-motion";

import type { ProjectCardProps } from "@/shared/types/project";
import { getStatusColor } from "@/shared/lib/constants";

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Card className="overflow-hidden h-full flex flex-col group">
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
              )} text-white border-none`}
            >
              {project.status === "in-development"
                ? t('projects.card.inDevelopment')
                : t(`projects.dialog.status.${project.status}`, project.status)}
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="text-xl">{project.title}</CardTitle>
        </CardHeader>

        <CardContent className="flex-1">
          <p className="text-muted-foreground text-sm mb-4">
            {t(`projectsData.${project.id}.shortDescription`, project.shortDescription)}
          </p>

          <div className="flex flex-wrap gap-1 mb-4">
            {project.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>

        <div className="p-4 pt-0 mt-auto flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => setIsDialogOpen(true)}
          >
            {t('projects.card.moreDetails')}
          </Button>
          
          <div className="flex gap-2">
            {project.links.github && (
              <Button
                variant="outline"
                size="icon"
                asChild
                className="h-9 w-9"
              >
                <Link
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
            )}
            
            {project.links.live && (
              <Button
                variant="outline"
                size="icon"
                asChild
                className="h-9 w-9"
              >
                <Link
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">{t('projects.card.liveDemo')}</span>
                </Link>
              </Button>
            )}
            
            {project.links.srcbook && (
              <Button
                variant="outline"
                size="icon"
                asChild
                className="h-9 w-9"
              >
                <Link
                  href={project.links.srcbook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 4v16h16V4H4zm2 14V6h12v12H6z" />
                    <path d="M8 8h8v2H8zM8 11h8v2H8zM8 14h5v2H8z" />
                  </svg>
                  <span className="sr-only">Srcbook</span>
                </Link>
              </Button>
            )}
            
            {project.links.cursor && (
              <Button
                variant="outline"
                size="icon"
                asChild
                className="h-9 w-9"
              >
                <Link
                  href={project.links.cursor}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.92 9.5L9.5 4.5V9.5h4.42zm-5.42 1v10l10-5-10-5z" />
                  </svg>
                  <span className="sr-only">Cursor</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </Card>

      <ProjectDialog
        project={project}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}