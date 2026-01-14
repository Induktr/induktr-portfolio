import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
import { Loader, DeferredContent } from "@/shared/ui/Loader";
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
  BookOpen,
  ArrowLeft
} from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";
import { ScrollArea } from "@/shared/ui/scroll-area";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from "@/shared/lib/utils";
import { CLOUD_DOCS_BASE_URL } from "@/shared/lib/constants";

import type { ProjectGalleryItem } from "@/shared/types/project";
import type { ProjectDialogProps } from "@/shared/types/project";

const markdownComponents = {
  h1: ({node, ...props}: any) => <h1 className="text-3xl font-bold text-primary mb-6 pb-2 border-b border-white/10" {...props} />,
  h2: ({node, ...props}: any) => <h2 className="text-2xl font-bold text-foreground mt-8 mb-4 flex items-center gap-2" {...props} />,
  table: ({node, ...props}: any) => <div className="overflow-x-auto my-6 rounded-lg border border-white/10"><table className="w-full text-left bg-black/20" {...props} /></div>,
  th: ({node, ...props}: any) => <th className="bg-primary/10 p-3 font-bold text-primary border-b border-white/10" {...props} />,
  td: ({node, ...props}: any) => <td className="p-3 border-b border-white/5" {...props} />,
  blockquote: ({node, ...props}: any) => <blockquote className="border-l-4 border-primary pl-4 py-1 italic bg-primary/5 rounded-r my-4" {...props} />,
  code: ({node, className, children, ...props}: any) => {
    const match = /language-(\w+)/.exec(className || '')
    return !String(children).includes('\n') ? (
      <code className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    ) : (
      <div className="relative group">
        <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-black/50 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          {match?.[1] || 'text'}
        </div>
        <code className="block bg-black/40 p-4 rounded-lg my-4 overflow-x-auto text-sm font-mono border border-white/5" {...props}>
          {children}
        </code>
      </div>
    )
  }
};

export const ProjectDialog = ({ project, isOpen, onClose }: ProjectDialogProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [docContent, setDocContent] = useState<string | null>(null);
  const [currentChapter, setCurrentChapter] = useState<number | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (project.docFile && isOpen) {
      fetch(project.docFile)
        .then(res => {
          if (!res.ok) throw new Error('Local doc not found');
          return res.text();
        })
        .then(text => setDocContent(text))
        .catch(() => {
          // Fallback to cloud
          const cloudUrl = `${CLOUD_DOCS_BASE_URL}${project.docFile}`;
          fetch(cloudUrl)
            .then(res => res.text())
            .then(text => setDocContent(text))
            .catch(err => console.error("Cloud fallback failed", err));
        });
    } else {
      setDocContent(null);
    }
  }, [project.docFile, isOpen]);

  useEffect(() => {
    if (currentChapter !== null && project.docs?.[currentChapter]?.file && isOpen) {
      setDocContent(null); // Reset content while loading
      const localPath = project.docs[currentChapter].file!;
      fetch(localPath)
        .then(res => {
          if (!res.ok) throw new Error('Local chapter not found');
          return res.text();
        })
        .then(text => setDocContent(text))
        .catch(() => {
          // Fallback to cloud
          const cloudUrl = `${CLOUD_DOCS_BASE_URL}${localPath}`;
          fetch(cloudUrl)
            .then(res => res.text())
            .then(text => setDocContent(text))
            .catch(err => console.error("Cloud chapter fallback failed", err));
        });
    }
  }, [currentChapter, project.docs, isOpen]);

  // Reset documentation state when tab changes or dialog closes
  useEffect(() => {
    if (activeTab !== "docs" || !isOpen) {
      setCurrentChapter(null);
      if (!project.docFile) setDocContent(null);
    }
  }, [activeTab, isOpen, project.docFile]);

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
                <DeferredContent 
                  fallback={<div className="h-[60vh] w-full flex items-center justify-center"><Loader size="lg" text="preparing overview..." /></div>}
                  delay={150}
                >
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
                </DeferredContent>
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
                {project.docFile && !project.docs ? (
                   <ScrollArea className="h-[60vh] pr-4">
                    <div className="prose prose-invert max-w-none p-6 bg-card/30 rounded-xl border border-white/5">
                      {docContent ? (
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={markdownComponents}
                        >
                          {docContent}
                        </ReactMarkdown>
                      ) : (
                        <div className="flex items-center justify-center py-20">
                          <Loader size="lg" text="fetching documentation..." />
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                ) : project.docs ? (
                  <div className="space-y-6">
                    {currentChapter === null ? (
                      <div className="grid gap-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold flex items-center gap-2">
                             <FileText className="w-5 h-5 text-primary" />
                             {t('projects.dialog.tabs.docs', 'Documentation')}
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {project.docs.map((chapter, idx) => (
                            <Card 
                              key={idx} 
                              className="bg-card/30 border-white/5 overflow-hidden group hover:border-primary/30 transition-all cursor-pointer"
                              onClick={() => {
                                if (chapter.file || chapter.content) {
                                  setCurrentChapter(idx);
                                }
                              }}
                            >
                              <div className="h-1 w-full bg-gradient-to-r from-primary/50 to-transparent" />
                              <CardContent className="p-6 space-y-3">
                                <div className="flex items-center justify-between">
                                  <h3 className="text-lg font-bold flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center text-sm font-mono">
                                      {idx + 1}
                                    </span>
                                    {chapter.title}
                                  </h3>
                                  {(chapter.file || chapter.content) && (
                                    <ArrowLeft className="w-4 h-4 rotate-180 text-muted-foreground group-hover:text-primary transition-colors" />
                                  )}
                                </div>
                                {chapter.goal && (
                                  <p className="text-xs text-muted-foreground line-clamp-2 italic">
                                    {chapter.goal}
                                  </p>
                                )}
                                {chapter.items && (
                                  <ul className="space-y-1.5 pt-2">
                                    {chapter.items.slice(0, 2).map((item, i) => (
                                      <li key={i} className="flex items-start gap-2 text-[11px] text-muted-foreground/70 line-clamp-1">
                                        <Circle className="w-1 h-1 mt-1.5 bg-primary/40 rounded-full shrink-0" />
                                        {item}
                                      </li>
                                    ))}
                                    {chapter.items.length > 2 && (
                                      <li className="text-[10px] text-primary font-medium pl-3">
                                        + {chapter.items.length - 2} {t('common.more', 'more')}...
                                      </li>
                                    )}
                                  </ul>
                                ) }
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                         <div className="flex items-center gap-4 mb-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="gap-2 text-muted-foreground hover:text-primary"
                              onClick={() => setCurrentChapter(null)}
                            >
                              <ArrowLeft className="w-4 h-4" />
                              {t('common.back', 'Back')}
                            </Button>
                            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                              {project.docs[currentChapter].title}
                            </h3>
                         </div>
                         <ScrollArea className="h-[55vh] pr-4">
                            <div className="prose prose-invert max-w-none p-8 bg-card/30 rounded-2xl border border-white/5 shadow-2xl">
                              {project.docs[currentChapter].file ? (
                                docContent ? (
                                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                    {docContent}
                                  </ReactMarkdown>
                                ) : (
                                  <div className="flex flex-col items-center justify-center py-20">
                                    <Loader size="lg" text="fetching chapter..." variant="accent" />
                                  </div>
                                )
                              ) : (
                                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                  {project.docs[currentChapter].content || ""}
                                </ReactMarkdown>
                              )}
                            </div>
                         </ScrollArea>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed border-white/10">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                    <p className="text-muted-foreground italic">
                      {t('projects.dialog.docs.empty', 'System documentation is being prepared for this project...')}
                    </p>
                  </div>
                )}
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