import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Check, ShoppingCart, Rocket, Code2, Layers, FileText, ArrowLeft, MonitorPlay, Play, HelpCircle } from "lucide-react";
import { MarkdownViewer } from "@/shared/ui/MarkdownViewer";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import type { DocPage, ProjectMarketplaceData } from "@/shared/types/marketplace";
import { ProductDetailsDialogProps, StateView } from "@/shared/types/product";
import { getYouTubeId, getThumbnail } from "@/shared/utils/services/youtube";

export const ProductDetailsDialog = ({
  template,
  isOpen,
  onClose,
  onBuy
}: ProductDetailsDialogProps) => {
  const { t } = useTranslation();
  const [view, setView] = useState<StateView>("overview");
  const [currentDoc, setCurrentDoc] = useState<DocPage | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setView("overview");
      setCurrentDoc(null);
      setPlayingVideo(null);
    }
  }, [isOpen, template]);

  if (!template) return null;

  const marketplaceData = t('marketplaceData', { returnObjects: true }) as Record<string, ProjectMarketplaceData>;
  const productData: ProjectMarketplaceData = marketplaceData[template.id] || { docs: [], roadmap: [], videos: [] };
  
  const docs = productData.docs || [];
  const roadmap = productData.roadmap || [];
  const videos = productData.videos || [];

  const handleOpenDoc = (doc: DocPage) => {
    setCurrentDoc(doc);
    setView("docs_reading");
  };

  const handleBackToDocs = () => {
    setCurrentDoc(null);
    setView("docs_list");
  };

  const renderContent = () => {
    if (view === "overview") {
      return (
        <ScrollArea className="h-full">
           <div className="p-6 space-y-6">
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-primary mb-2">
                  <Rocket className="w-4 h-4" />
                  About Product
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {template.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-primary mb-3">
                    <Code2 className="w-4 h-4" />
                    Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {template.stack.map((tech) => (
                      <Badge key={tech} variant="secondary" className="font-mono text-xs px-2 py-1">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                   <h4 className="flex items-center gap-2 text-sm font-semibold text-primary mb-3">
                    <Check className="w-4 h-4" />
                    Key Features
                  </h4>
                  <div className="rounded-md border p-3 bg-secondary/10">
                    <ul className="space-y-2">
                      {template.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <div className="mt-1 bg-green-500/20 p-0.5 rounded-full">
                             <Check className="w-3 h-3 text-green-500" />
                          </div>
                          <span className="text-foreground/90">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="secondary" className="justify-between group h-auto py-3 px-4" onClick={() => setView("docs_list")}>
                   <div className="flex flex-col items-start gap-1">
                      <span className="flex items-center gap-2 font-semibold">
                          <FileText className="w-4 h-4 text-primary" />
                          Docs
                      </span>
                      <span className="text-xs text-muted-foreground">{docs.length} chapters</span>
                   </div>
                   <ArrowLeft className="w-4 h-4 rotate-180 text-muted-foreground group-hover:text-primary transition-colors" />
                </Button>

                <Button variant="secondary" className="justify-between group h-auto py-3 px-4" onClick={() => setView("roadmap")}>
                   <div className="flex flex-col items-start gap-1">
                      <span className="flex items-center gap-2 font-semibold">
                          <Layers className="w-4 h-4 text-orange-500" />
                          Roadmap
                      </span>
                      <span className="text-xs text-muted-foreground">{roadmap.length > 0 ? "Track progress" : "N/A"}</span>
                   </div>
                   <ArrowLeft className="w-4 h-4 rotate-180 text-muted-foreground group-hover:text-orange-500 transition-colors" />
                </Button>

                <Button variant="secondary" className="justify-between group h-auto py-3 px-4" onClick={() => setView("videos")}>
                   <div className="flex flex-col items-start gap-1">
                      <span className="flex items-center gap-2 font-semibold">
                          <MonitorPlay className="w-4 h-4 text-blue-500" />
                          Showcase
                      </span>
                      <span className="text-xs text-muted-foreground">{videos.length} videos</span>
                   </div>
                   <ArrowLeft className="w-4 h-4 rotate-180 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                </Button>
              </div>
           </div>
        </ScrollArea>
      );
    }

    if (view === "videos") {
      return (
         <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MonitorPlay className="w-5 h-5 text-blue-500" />
                  Video Showcase
                </h3>

                {videos.length > 0 ? (
                    <div className="grid gap-4">
                        {videos.map((vid) => {
                           const thumb = getThumbnail(vid.url);
                           return (
                             <div key={vid.id} className="bg-card border border-border/50 rounded-lg overflow-hidden group hover:border-blue-500/50 transition-colors flex flex-col md:flex-row shadow-sm hover:shadow-md">
                                 <div 
                                    className="relative w-full md:w-48 shrink-0 flex items-center justify-center h-32 md:h-auto bg-cover bg-center bg-no-repeat"
                                    style={{ backgroundImage: thumb ? `url(${thumb})` : undefined, backgroundColor: !thumb ? 'rgba(0,0,0,0.1)' : undefined }}
                                 >
                                      {!thumb && <MonitorPlay className="text-muted-foreground w-8 h-8 opacity-20" />}
                                     <div 
                                        className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center cursor-pointer"
                                        onClick={() => setPlayingVideo(vid.url)}
                                     >
                                         <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                             <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                                         </div>
                                     </div>
                                 </div>
                                 <div className="p-4 flex flex-col justify-between flex-grow">
                                     <div className="space-y-1">
                                        <div className="flex items-start justify-between">
                                           <h4 className="font-semibold text-base line-clamp-1 group-hover:text-blue-500 transition-colors">{vid.title}</h4>
                                           <Badge variant="outline" className="text-[10px] font-mono shrink-0 ml-2">{vid.duration}</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                          {vid.description}
                                        </p>
                                     </div>
                                     <div className="mt-4 flex items-center justify-between">
                                        <Badge variant="secondary" className="uppercase text-[10px] tracking-wider opacity-70">{vid.type}</Badge>
                                        <Button variant="link" className="p-0 h-auto text-blue-500 text-xs gap-1" onClick={() => window.open(vid.url, '_blank')}>
                                            YouTube <ArrowLeft className="w-3 h-3 rotate-[135deg]" />
                                        </Button>
                                     </div>
                                 </div>
                             </div>
                           )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-10 text-muted-foreground">
                        No videos available for this product yet.
                    </div>
                )}
            </div>
         </ScrollArea>
      )
    }

    if (view === "roadmap") {
       return (
         <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-orange-500" />
                  Development Roadmap
                </h3>
                
                {roadmap.length > 0 ? (
                    <div className="space-y-6 relative border-l-2 border-muted ml-3 pl-6">
                        {roadmap.map((stage) => (
                            <div key={stage.id} className="relative">
                                {/* Timeline Dot */}
                                <div className={`absolute -left-[33px] top-1 w-4 h-4 rounded-full border-2 
                                    ${stage.status === 'completed' ? 'bg-green-500 border-green-500' : 
                                      stage.status === 'in-progress' ? 'bg-orange-500 border-orange-500 animate-pulse' : 
                                      'bg-background border-muted-foreground'}`} 
                                />
                                
                                <div className="mb-2 flex items-center gap-2">
                                    <h4 className="font-bold text-lg">{stage.title}</h4>
                                    <Badge variant={stage.status === 'completed' ? 'default' : stage.status === 'in-progress' ? 'secondary' : 'outline'} 
                                           className={stage.status === 'completed' ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' : 
                                                      stage.status === 'in-progress' ? 'bg-orange-500/20 text-orange-500 hover:bg-orange-500/30' : ''}>
                                        {stage.status === 'completed' ? 'COMPLETED' : stage.status === 'in-progress' ? 'IN PROGRESS' : 'TO DO'}
                                    </Badge>
                                </div>

                                <div className="bg-card/50 rounded-lg p-4 border border-border/50 space-y-3">
                                    {stage.tasks.map((task, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex items-start gap-3">
                                                <div className={`mt-1 w-4 h-4 rounded border flex items-center justify-center 
                                                    ${task.completed ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                                                    {task.completed && <Check className="w-3 h-3 text-primary-foreground" />}
                                                </div>
                                                <span className={`text-sm ${task.completed ? 'text-muted-foreground line-through decoration-muted-foreground/50' : 'text-foreground'}`}>
                                                    {task.label}
                                                </span>
                                            </div>
                                            {task.subtasks && (
                                                <div className="pl-7 space-y-2 pt-1">
                                                    {task.subtasks.map((sub, j) => (
                                                        <div key={j} className="flex items-start gap-2">
                                                            <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${sub.completed ? 'bg-primary/50' : 'bg-muted-foreground/50'}`} />
                                                            <span className="text-xs text-muted-foreground">{sub.label}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-muted-foreground">
                        No roadmap data available for this product.
                    </div>
                )}
            </div>
         </ScrollArea>
       )
    }

    if (view === "docs_list") {
      return (
        <ScrollArea className="h-full">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Documentation Library
            </h3>
            {docs.length > 0 ? (
              <div className="grid gap-3">
                {docs.map((doc) => (
                  <Button 
                    key={doc.id} 
                    variant="outline" 
                    className="h-auto py-4 px-4 justify-start text-left bg-card hover:bg-secondary/50 border-primary/10"
                    onClick={() => handleOpenDoc(doc)}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-base">{doc.title}</span>
                      <span className="text-xs text-muted-foreground font-normal line-clamp-1 opacity-70">
                         Click to read full chapter...
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
               <div className="text-center py-10 text-muted-foreground">
                 No documentation available for this product yet.
               </div>
            )}
          </div>
        </ScrollArea>
      );
    }

    if (view === "docs_reading" && currentDoc) {
      return (
        <MarkdownViewer content={currentDoc.content} className="h-full" />
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-card border-primary/20 max-h-[90vh]">
        {/* Internal Wrapper to maintain centering while allowing absolute children */}
        <div className="relative flex flex-col h-full w-full max-h-[90vh]">
            <DialogHeader className="sr-only">
              <DialogTitle>{template.title}</DialogTitle>
              <div className="sr-only">Product details, documentation, roadmap and videos for {template.title}</div>
            </DialogHeader>

            {/* Custom Video Player Overlay */}
            {playingVideo && (
               <div className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
                   <div className="w-full max-w-3xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10 relative group">
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src={`https://www.youtube.com/embed/${getYouTubeId(playingVideo)}?autoplay=1&rel=0&modestbranding=1`} 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowFullScreen 
                        className="absolute inset-0"
                      />
                      {/* Close Play Button */}
                      <Button 
                        variant="ghost" 
                        className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full w-10 h-10 p-0 z-10"
                        onClick={() => setPlayingVideo(null)}
                      >
                         <ArrowLeft className="w-6 h-6 rotate-45" />
                      </Button>
                   </div>
                   <Button 
                      variant="outline" 
                       className="mt-6 text-white border-white/20 hover:bg-white/10 gap-2"
                       onClick={() => setPlayingVideo(null)}
                    >
                       Close Player
                   </Button>
               </div>
            )}

            {/* Header Section */}
            <div className={`shrink-0 h-32 bg-gradient-to-r ${template.gradient} p-6 flex items-center justify-between relative`}>
               <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-2">
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm">
                      {template.stack[0]}
                    </Badge>
                    
                    {view !== "overview" && (
                       <Badge variant="outline" className="text-white border-white/50 cursor-pointer hover:bg-white/10" onClick={() => view === "docs_reading" ? handleBackToDocs() : setView("overview")}>
                        <ArrowLeft className="w-3 h-3 mr-1" /> {view === "docs_reading" ? "Back to List" : "Back to Overview"}
                       </Badge>
                    )}
                 </div>
                 <h2 className="text-2xl font-bold text-white drop-shadow-md">
                   {template.title}
                 </h2>
               </div>
               <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 transform scale-150 text-white">
                 {view === "overview" && <Layers size={80} />}
                 {(view === "docs_list" || view === "docs_reading") && <FileText size={80} />}
                 {view === "roadmap" && <Rocket size={80} />}
                 {view === "videos" && <MonitorPlay size={80} />}
               </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="h-[60vh] w-full bg-background/50">
               {renderContent()}
            </div>

            {/* Footer */}
            <DialogFooter className="shrink-0 p-6 pt-2 bg-secondary/5 flex flex-row items-center justify-between border-t border-border/50 gap-4">
              <div className="flex items-center gap-6">
                {/* FAQ / Help Section */}
                <div className="hidden sm:flex items-center gap-3 max-w-[280px] group cursor-help">
                    <div className="bg-primary/10 p-2.5 rounded-full group-hover:bg-primary/20 transition-colors shrink-0">
                        <HelpCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                            {t('marketplace.questions_title', 'Any Questions?')}
                        </span>
                        <p className="text-[11px] leading-tight text-muted-foreground/80 group-hover:text-foreground transition-colors">
                            {t('marketplace.faq_hint_before', 'Check our')} <Link href="/faq" onClick={onClose}><span className="text-primary font-semibold hover:underline cursor-pointer">{t('marketplace.faq_link', 'FAQ page')}</span></Link> {t('marketplace.faq_hint_after', 'for all technical details and template usage.')}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col">
                   <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Price</span>
                   <span className="text-3xl font-bold text-primary">${template.price}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  {t('common.close', 'Close')}
                </Button>
                <Button 
                  className="gap-2 px-8" 
                  onClick={() => {
                    onBuy(template);
                    onClose();
                  }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {t('marketplace.buy_component', 'Buy Component')}
                </Button>
              </div>
            </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
