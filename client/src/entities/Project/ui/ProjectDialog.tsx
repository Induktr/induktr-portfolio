import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/ui/dialog";
import { ProjectSlider } from "./ProjectSlider";
import { ProjectUsage } from "./ProjectUsage";
import { useState } from "react";
import { Badge } from "@/shared/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";
import { Button } from "@/shared/ui/button";
import { 
  Github, 
  ExternalLink, 
  List, 
  CheckSquare, 
  Cpu, 
  Layout, 
  FileText, 
  Milestone,
  CheckCircle2,
  Circle,
  BookOpen
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Project, ProjectGalleryItem } from "@/shared/types/project";
import { Card, CardContent } from "@/shared/ui/card";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { cn } from "@/shared/lib/utils";

interface ProjectDialogProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDialog({ project, isOpen, onClose }: ProjectDialogProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const { t } = useTranslation();

  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "active":
        return "bg-blue-500";
      case "upcoming":
        return "bg-amber-500";
      case "in-development":
        return "bg-cyan-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
      if (status === "in-development") return t('projects.dialog.status.inDevelopment');
      return t(`projects.dialog.status.${status}`) || status;
  };

  // Construct gallery from legacy fields if gallery array is missing
  const galleryItems: ProjectGalleryItem[] = project.gallery || [
    ...(project.video ? [{ type: 'video' as const, url: project.video, title: project.title }] : []),
    { type: 'image' as const, url: project.image, title: project.title }
  ];

  const hasUsage = project.usage && project.usage.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] overflow-hidden flex flex-col bg-background/95 backdrop-blur-xl border-white/10 p-0 gap-0">
        <div className="p-6 pb-2 shrink-0">
          <DialogHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <DialogTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                  {project.title}
                </DialogTitle>
                <div className="flex flex-wrap gap-2 pt-1">
                  {project.categories?.map(cat => (
                    <Badge key={cat} variant="secondary" className="bg-primary/10 text-primary border-primary/20 capitalize">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
              <Badge
                className={`${getStatusColor(project.status)} text-white border-none px-4 py-1 text-sm font-medium shadow-lg`}
              >
                {getStatusLabel(project.status)}
              </Badge>
            </div>
            <DialogDescription className="text-lg text-muted-foreground/80 leading-relaxed italic">
              {t(`projectsData.${project.id}.description`, project.description)}
            </DialogDescription>
          </DialogHeader>
        </div>

        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col min-h-0 overflow-hidden px-6"
        >
          <TabsList className={cn(
            "grid w-full bg-muted/40 p-1 h-12 shrink-0",
            hasUsage ? "grid-cols-5" : "grid-cols-4"
          )}>
            <TabsTrigger value="overview" className="gap-2">
              <Layout className="w-4 h-4" />
              <span className="hidden sm:inline">{t('projects.dialog.tabs.overview')}</span>
              <span className="sm:hidden text-[10px]">Info</span>
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="gap-2">
              <Milestone className="w-4 h-4" />
              <span className="hidden sm:inline">{t('projects.dialog.tabs.roadmap', 'Roadmap')}</span>
              <span className="sm:hidden text-[10px]">Map</span>
            </TabsTrigger>
            <TabsTrigger value="tech" className="gap-2">
              <Cpu className="w-4 h-4" />
              <span className="hidden sm:inline">{t('projects.dialog.tabs.tech')}</span>
              <span className="sm:hidden text-[10px]">Tech</span>
            </TabsTrigger>
            <TabsTrigger value="docs" className="gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">{t('projects.dialog.tabs.docs', 'Docs')}</span>
              <span className="sm:hidden text-[10px]">Docs</span>
            </TabsTrigger>
            {hasUsage && (
              <TabsTrigger value="usage" className="gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">{t('projects.dialog.tabs.usage', 'Guide')}</span>
                <span className="sm:hidden text-[10px]">How-to</span>
              </TabsTrigger>
            )}
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4 pr-2 pb-8 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <TabsContent value="overview" className="mt-0 space-y-8">
                <ProjectSlider items={galleryItems} className="aspect-video shadow-2xl" />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        {t('projects.dialog.keyFeatures')}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {project.features?.map((feature, index) => (
                          <Card key={index} className="bg-card/50 border-white/5 hover:border-primary/20 transition-all group">
                            <CardContent className="p-4 flex gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                              <span className="text-sm font-medium">{feature}</span>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">
                        {t('projects.dialog.tags')}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project.tags?.map(tag => (
                          <Badge key={tag} variant="outline" className="text-[10px] px-2 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">
                        {t('projects.dialog.projectStart')}
                      </h4>
                      <div className="flex items-center gap-2 text-primary font-bold">
                        <Milestone className="w-4 h-4" />
                        {project.timeline.start}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="roadmap" className="mt-0">
                <div className="space-y-12">
                  {project.roadmap?.map((stage) => (
                    <div key={stage.stage} className="relative pl-8 border-l-2 border-primary/20 pb-12 last:pb-0">
                      <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-background border-4 border-primary flex items-center justify-center font-bold text-sm">
                        {stage.stage}
                      </div>
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <h3 className="text-2xl font-bold text-primary">{stage.title}</h3>
                          <Badge className="bg-primary/20 text-primary border-primary/30">
                            {stage.duration}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground italic bg-accent/30 p-4 rounded-xl border border-border/50">
                          <span className="font-bold text-primary mr-2 uppercase text-xs tracking-widest">Goal:</span>
                          {stage.goal}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                          {stage.tasks.map((task, taskIdx) => (
                            <div key={taskIdx} className="space-y-3">
                              <h4 className="font-bold flex items-center gap-2 text-foreground/90">
                                <List className="w-4 h-4 text-primary" />
                                {task.title}
                              </h4>
                              <ul className="space-y-2">
                                {task.checklists.map((checklist, checkIdx) => (
                                  <li key={checkIdx} className="space-y-1">
                                    <div className="text-sm font-semibold opacity-70 mb-1">{checklist.title}</div>
                                    <div className="space-y-1 ml-2">
                                      {checklist.items.map((item, itemIdx) => (
                                        <div key={itemIdx} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                                          <CheckSquare className="w-3 h-3 mt-0.5 text-primary shrink-0" />
                                          {item}
                                        </div>
                                      ))}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="tech" className="mt-0 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Основной стек */}
                  <div className="md:col-span-3">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-primary" />
                      {t('projects.dialog.mainStack')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack?.map(tech => (
                        <Badge key={tech} className="bg-primary/20 text-primary border-primary/30 px-4 py-1">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Дополнительные технологии */}
                  {project.additionalTech && Object.entries(project.additionalTech).map(([key, group]) => (
                    group && (
                      <Card key={key} className="bg-accent/20 border-white/5 border-dashed">
                        <CardContent className="p-4 space-y-3">
                          <h4 className="font-bold text-sm text-primary uppercase tracking-wider">
                            {group.title}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {group.items.map(item => (
                              <Badge key={item} variant="secondary" className="text-[10px] bg-background/50">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="docs" className="mt-0">
                <div className="space-y-6">
                  {project.docs ? (
                    project.docs.map((chapter, idx) => (
                      <Card key={idx} className="bg-card/30 border-white/5 overflow-hidden group hover:border-primary/30 transition-all">
                        <div className="h-1 w-full bg-gradient-to-r from-primary/50 to-transparent" />
                        <CardContent className="p-6 space-y-4">
                          <h3 className="text-xl font-bold flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center text-sm">
                              {idx + 1}
                            </span>
                            {chapter.title}
                          </h3>
                          {chapter.goal && (
                            <div className="text-sm font-medium text-primary/80 bg-primary/5 p-3 rounded-lg border border-primary/10">
                              {chapter.goal}
                            </div>
                          )}
                          <ul className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-x-8">
                            {chapter.items.map((item, i) => (
                              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                                <Circle className="w-1.5 h-1.5 mt-1.5 bg-primary rounded-full shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed border-white/10">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                      <p className="text-muted-foreground italic">
                        {t('projects.dialog.docs.empty', 'System documentation is being prepared for this project...')}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="usage" className="mt-0 outline-none">
                {project.usage && project.usage.length > 0 ? (
                  <ProjectUsage steps={project.usage} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-3xl border border-dashed border-white/10">
                    <BookOpen className="w-12 h-12 text-muted-foreground/20 mb-4" />
                    <p className="text-muted-foreground italic text-center max-w-xs">
                      {t('projects.dialog.usage.empty', 'A usage guide is being drafted for this solution...')}
                    </p>
                  </div>
                )}
              </TabsContent>
            </div>
          </div>
        </Tabs>

        <DialogFooter className="mt-0 p-6 pt-2 border-t border-white/5 shrink-0">
          <div className="flex flex-wrap gap-3 w-full justify-center md:justify-end">
            {project.links.github && (
              <Button variant="outline" className="rounded-full px-6 hover:bg-primary/10 hover:border-primary/50 transition-all font-semibold" asChild>
                <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
            )}
            {project.links.live && (
              <Button className="rounded-full px-8 shadow-lg shadow-primary/30 font-bold" asChild>
                <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Live Demo
                </a>
              </Button>
            )}
            {project.links.srcbook && (
              <Button variant="outline" className="rounded-full px-6 hover:bg-primary/10 hover:border-primary/50 transition-all font-semibold" asChild>
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
              <Button variant="outline" className="rounded-full px-6 hover:bg-primary/10 hover:border-primary/50 transition-all font-semibold" asChild>
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