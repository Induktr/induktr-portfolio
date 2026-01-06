import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/ui/dialog";
import { ProjectGallery } from "./ProjectGallery";
// import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; // Not found
import { useState } from "react";
import { Badge } from "@/shared/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";
import { Button } from "@/shared/ui/button";
import { Github, ExternalLink, List, CheckSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Project } from "@/shared/types/project";

interface ProjectDialogProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDialog({ project, isOpen, onClose }: ProjectDialogProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const { t, i18n } = useTranslation();

  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "active":
        return "bg-blue-500";
      case "upcoming":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
      // Map status from JSON to i18n keys
      if (status === "in-development") return t('projects.dialog.status.inDevelopment');
      return t(`projects.dialog.status.${status}`) || status;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">{project.title}</DialogTitle>
            <Badge
              variant="outline"
              className={`${getStatusColor(project.status)} text-white border-none`}
            >
              {getStatusLabel(project.status)}
            </Badge>
          </div>
          <DialogDescription className="text-lg">
            {t(`projectsData.${project.id}.description`, project.description)}
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mt-6 flex-1 overflow-hidden flex flex-col"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="overview">{t('projects.dialog.tabs.overview')}</TabsTrigger>
            <TabsTrigger value="timeline">{t('projects.dialog.tabs.timeline')}</TabsTrigger>
            <TabsTrigger value="tech">{t('projects.dialog.tabs.tech')}</TabsTrigger>
            {project.roadmap && (
              <TabsTrigger value="roadmap">{t('projects.dialog.roadmap.tab')}</TabsTrigger>
            )}
          </TabsList>

          <div className="flex-1 overflow-y-auto pr-2">
            <TabsContent
              value="overview"
              className="mt-0 data-[state=active]:h-full"
            >
              <div className="aspect-video relative overflow-hidden rounded-lg mb-6">
                {project.video ? (
                  <video
                    src={project.video}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${project.image})` }}
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-3">{t('projects.dialog.keyFeatures')}</h3>
                  <ul className="space-y-2">
                    {project.features?.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        <span>{t(`projectsData.${project.id}.features.${index}`, feature)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">{t('projects.dialog.tags')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">{t('projects.dialog.projectStart')}</h3>
                  <p>
                    {project.timeline?.start ? new Date(project.timeline.start).toLocaleDateString(i18n.language, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }) : t('common.notAvailable', 'Not available')}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">{t('projects.dialog.projectPhases')}</h3>
                  <div className="space-y-4">
                    {project.timeline?.phases?.map((phase, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 relative overflow-hidden"
                      >
                        <div
                          className={`absolute left-0 top-0 bottom-0 w-1 ${getStatusColor(
                            phase.status
                          )}`}
                        />
                        <h4 className="font-medium">{t(`projectsData.${project.id}.timeline.${index}.name`, phase.name)}</h4>
                        <p className="text-muted-foreground text-sm">
                          {phase.duration}
                        </p>
                        <Badge
                          variant="outline"
                          className={`mt-2 ${getStatusColor(
                            phase.status
                          )} text-white border-none`}
                        >
                          {getStatusLabel(phase.status)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tech" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-3">{t('projects.dialog.mainStack')}</h3>
                  <ul className="space-y-2">
                    {project.techStack.map((tech, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        <span>{tech}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {project.additionalTech && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">{t('projects.dialog.additionalTech')}</h3>
                    <div className="space-y-4">
                      {project.additionalTech.mediaTools && (
                        <div>
                          <h4 className="font-medium text-primary">{project.additionalTech.mediaTools.title}</h4>
                          <ul className="mt-1 space-y-1">
                            {project.additionalTech.mediaTools.items.map((item: string, idx: number) => (
                              <li key={idx} className="text-sm flex items-start">
                                <span className="mr-2 text-primary">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {project.additionalTech.formTools && (
                        <div>
                          <h4 className="font-medium text-primary">{project.additionalTech.formTools.title}</h4>
                          <ul className="mt-1 space-y-1">
                            {project.additionalTech.formTools.items.map((item: string, idx: number) => (
                              <li key={idx} className="text-sm flex items-start">
                                <span className="mr-2 text-primary">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {project.additionalTech.cmsTools && (
                        <div>
                          <h4 className="font-medium text-primary">{project.additionalTech.cmsTools.title}</h4>
                          <ul className="mt-1 space-y-1">
                            {project.additionalTech.cmsTools.items.map((item: string, idx: number) => (
                              <li key={idx} className="text-sm flex items-start">
                                <span className="mr-2 text-primary">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {project.additionalTech.performanceTools && (
                        <div>
                          <h4 className="font-medium text-primary">{project.additionalTech.performanceTools.title}</h4>
                          <ul className="mt-1 space-y-1">
                            {project.additionalTech.performanceTools.items.map((item: string, idx: number) => (
                              <li key={idx} className="text-sm flex items-start">
                                <span className="mr-2 text-primary">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {project.additionalTech.testingTools && (
                        <div>
                          <h4 className="font-medium text-primary">{project.additionalTech.testingTools.title}</h4>
                          <ul className="mt-1 space-y-1">
                            {project.additionalTech.testingTools.items.map((item: string, idx: number) => (
                              <li key={idx} className="text-sm flex items-start">
                                <span className="mr-2 text-primary">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {project.additionalTech.devopsTools && (
                        <div>
                          <h4 className="font-medium text-primary">{project.additionalTech.devopsTools.title}</h4>
                          <ul className="mt-1 space-y-1">
                            {project.additionalTech.devopsTools.items.map((item: string, idx: number) => (
                              <li key={idx} className="text-sm flex items-start">
                                <span className="mr-2 text-primary">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {project.additionalTech.developmentTools && (
                        <div>
                          <h4 className="font-medium text-primary">{project.additionalTech.developmentTools.title}</h4>
                          <ul className="mt-1 space-y-1">
                            {project.additionalTech.developmentTools.items.map((item: string, idx: number) => (
                              <li key={idx} className="text-sm flex items-start">
                                <span className="mr-2 text-primary">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {project.roadmap && (
              <TabsContent value="roadmap" className="mt-0">
                <div className="space-y-6">
                  {project.roadmap.map((stage) => (
                    <div key={stage.stage} className="border rounded-lg p-5 bg-card/30 hover:bg-card/50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2 border-b pb-3 border-border/50">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-primary">
                          <span>🔻</span>
                          {t('projects.dialog.roadmap.stage')} {stage.stage}: «{t(`projectsData.${project.id}.roadmap.${stage.stage - 1}.title`, stage.title)}»
                        </h3>
                        <Badge variant="outline" className="w-fit">
                          {t('projects.dialog.roadmap.duration')}: {stage.duration}
                        </Badge>
                      </div>
                      
                      <p className="mb-6 pl-2 text-lg">
                        <span className="font-semibold text-primary">{t('projects.dialog.roadmap.goal')}:</span> {t(`projectsData.${project.id}.roadmap.${stage.stage - 1}.goal`, stage.goal)}
                      </p>

                      <div className="space-y-6 pl-2 md:pl-6 border-l-2 border-primary/20 ml-2">
                        {stage.tasks.map((task, taskIndex) => (
                          <div key={taskIndex} className="space-y-3">
                            <h4 className="font-semibold text-base flex items-center gap-2">
                              <div className="bg-primary/10 p-1 rounded">
                                <List className="h-4 w-4 text-primary" />
                              </div>
                              {t('projects.dialog.roadmap.task')} {taskIndex + 1}: {t(`projectsData.${project.id}.roadmap.${stage.stage - 1}.tasks.${taskIndex}.title`, task.title)}
                            </h4>
                            
                            <div className="space-y-4 pl-2 md:pl-4">
                              {task.checklists.map((checklist, checkIndex) => (
                                <div key={checkIndex} className="bg-muted/40 p-4 rounded-lg border border-border/50">
                                  <h5 className="font-medium text-sm mb-3 flex items-center gap-2 text-muted-foreground uppercase tracking-wide">
                                    <CheckSquare className="h-4 w-4" />
                                    {t('projects.dialog.roadmap.checklist')} {taskIndex + 1}.{checkIndex + 1}: {t(`projectsData.${project.id}.roadmap.${stage.stage - 1}.tasks.${taskIndex}.checklists.${checkIndex}.title`, checklist.title)}
                                  </h5>
                                  <ul className="space-y-2">
                                    {checklist.items.map((item, itemIndex) => (
                                      <li key={itemIndex} className="flex items-start text-sm group cursor-default">
                                        <div className="mr-3 mt-0.5 h-4 w-4 min-w-[16px] border rounded border-primary/40 flex items-center justify-center group-hover:border-primary transition-colors">
                                          {/* Empty box simulating unchecked item */}
                                        </div>
                                        <span className="text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
                                          {t(`projectsData.${project.id}.roadmap.${stage.stage - 1}.tasks.${taskIndex}.checklists.${checkIndex}.items.${itemIndex}`, item)}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}
          </div>
        </Tabs>

        <DialogFooter className="mt-4">
          <div className="flex gap-2">
            {project.links.github && (
              <Button variant="outline" asChild>
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
            )}
            {project.links.live && (
              <Button asChild>
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Live Demo
                </a>
              </Button>
            )}
            {project.links.srcbook && (
              <Button variant="outline" asChild>
                <a
                  href={project.links.srcbook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 4v16h16V4H4zm2 14V6h12v12H6z" />
                    <path d="M8 8h8v2H8zM8 11h8v2H8zM8 14h5v2H8z" />
                  </svg>
                  Srcbook
                </a>
              </Button>
            )}
            {project.links.cursor && (
              <Button variant="outline" asChild>
                <a
                  href={project.links.cursor}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.92 9.5L9.5 4.5V9.5h4.42zm-5.42 1v10l10-5-10-5z" />
                  </svg>
                  Cursor
                </a>
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}