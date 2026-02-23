import { useState, useEffect } from "react";
import { useProjects } from "@/shared/hooks/useProjects";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Label } from "@/shared/ui/label";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Badge } from "@/shared/ui/badge";
import { X, Plus, Video, Copy, Globe } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/shared/lib/store/store";
import { closeModal } from "@/shared/lib/store/slices/uiSlice";
import { useLocalizedForm } from "@/shared/hooks/useLocalizedForm";

export const ProjectForm = () => {
  const dispatch = useAppDispatch();
  const { modals } = useAppSelector((state) => state.ui);
  const { isOpen, editingItem: project } = modals.projectForm;

  const { createProjectMutation, updateProjectMutation } = useProjects();
  
  const { 
    slug, setSlug, 
    localizedData, updateLangField, getPayload 
  } = useLocalizedForm(isOpen, project, { 
    title: "", 
    shortDescription: "", 
    description: "", 
    features: [] as string[], 
    tags: [] as string[], 
    techStack: [] as string[], 
    roadmap: [] as any[], 
    docs: [] as any[], 
    usage: [] as any[] 
  });

  const [status, setStatus] = useState<"completed" | "active" | "upcoming" | "in-development">("active");
  const [mainImage, setMainImage] = useState("");
  const [gallery, setGallery] = useState<{url: string, type: 'image' | 'video', title?: string}[]>([]);
  const [bulkUrls, setBulkUrls] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  
  const [github, setGithub] = useState("");
  const [live, setLive] = useState("");

  useEffect(() => {
    if (isOpen && project) {
      const raw = project.rawDbData || {};
      const firstLangKey = Object.keys(raw)[0];
      const firstLangData = firstLangKey ? raw[firstLangKey] : {};

      setStatus(project.status || firstLangData.status || "active");
      setMainImage(project.image || firstLangData.image || "");
      setGallery(project.gallery || firstLangData.gallery || []);
      setCategories(project.categories || firstLangData.categories || []);
      
      const links = project.links || firstLangData.links || {};
      setGithub(links.github || "");
      setLive(links.live || "");
    } else if (isOpen) {
      setStatus("active");
      setMainImage("");
      setGallery([]);
      setCategories([]);
      setGithub("");
      setLive("");
    }
  }, [isOpen, project]);

  const handleClose = () => dispatch(closeModal("projectForm"));

  const handleBulkAdd = () => {
    const urls = bulkUrls.split("\n").map(u => u.trim()).filter(u => u.length > 0);
    const newItems = urls.map(url => ({
      url,
      type: (url.includes('youtube') || url.includes('vimeo') || url.endsWith('.mp4')) ? 'video' as const : 'image' as const
    }));
    setGallery(prev => [...prev, ...newItems]);
    setBulkUrls("");
  };

  const removeGalleryItem = (index: number) => {
    setGallery(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Inject shared fields into localized data as per backend pattern
    const finalLocalized = { ...localizedData } as any;
    ["en", "ru", "ua"].forEach(lang => {
      finalLocalized[lang] = {
        ...finalLocalized[lang],
        image: mainImage,
        gallery,
        categories,
        status,
        links: { github, live },
        timeline: { start: new Date().getFullYear().toString(), phases: [] },
      };
    });

    const payload = getPayload();
    payload.data = JSON.stringify(finalLocalized);

    if (project?.isFromDb) {
      updateProjectMutation.mutate({ id: parseInt(project.id.toString().replace("db-", "")), project: payload }, {
        onSuccess: () => handleClose()
      });
    } else {
      createProjectMutation.mutate(payload, {
        onSuccess: () => handleClose()
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-background/95 backdrop-blur-xl border-white/10">
        <DialogHeader className="p-6 border-b border-white/10">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary" />
            {project ? "Edit Project" : "Create New Multilingual Project"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-80 border-r border-white/10 p-6 space-y-6 overflow-y-auto bg-white/5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Base Configuration
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>System Slug</Label>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. westbud-legacy" />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <select 
                  value={status} 
                  onChange={(e: any) => setStatus(e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-md h-10 px-3 text-sm"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="in-development">In Development</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Main Project Cover (URL)</Label>
                <div className="relative">
                  <Input value={mainImage} onChange={(e) => setMainImage(e.target.value)} placeholder="Preview Image URL" />
                  {mainImage && (
                    <div className="mt-2 relative aspect-video rounded-lg overflow-hidden border border-white/10">
                      <img src={mainImage} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-4">
                <h4 className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                  <Globe className="w-3 h-3" /> External Links
                </h4>
                <div className="space-y-2">
                  <Label className="text-[10px]">Github Repository</Label>
                  <Input 
                    value={github} 
                    onChange={(e) => setGithub(e.target.value)} 
                    placeholder="https://github.com/..."
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px]">Live Demo URL</Label>
                  <Input 
                    value={live} 
                    onChange={(e) => setLive(e.target.value)} 
                    placeholder="https://demo.com/..."
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-w-0">
            <ScrollArea className="flex-1 p-6">
              <Tabs defaultValue="media" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 sticky top-0 z-10 bg-background/50 backdrop-blur pb-1">
                  <TabsTrigger value="media" className="gap-2">Media</TabsTrigger>
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="ru">Русский</TabsTrigger>
                  <TabsTrigger value="ua">Українська</TabsTrigger>
                </TabsList>

                <TabsContent value="media" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-bold">Project Gallery</Label>
                      <Badge variant="outline">{gallery.length} items</Badge>
                    </div>

                    <div className="p-4 border-2 border-dashed border-white/10 rounded-xl space-y-4">
                      <Label className="text-sm text-muted-foreground">Bulk Import Image/Video URLs (One per line)</Label>
                      <Textarea 
                        placeholder="https://...&#10;https://..." 
                        rows={4} 
                        value={bulkUrls}
                        onChange={(e) => setBulkUrls(e.target.value)}
                        className="font-mono text-xs"
                      />
                      <Button onClick={handleBulkAdd} className="w-full gap-2" variant="secondary">
                        <Plus className="w-4 h-4" /> Add Bulk Assets
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {gallery.map((item, idx) => (
                        <div key={idx} className="group relative aspect-square rounded-lg overflow-hidden border border-white/10 bg-black/20">
                          {item.type === 'image' ? (
                            <img src={item.url} className="w-full h-full object-cover" alt={`Gallery item ${idx}`} />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                              <Video className="w-8 h-8 text-primary" />
                              <span className="text-[10px] text-muted-foreground px-2 text-center truncate w-full">{item.url}</span>
                            </div>
                          )}
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeGalleryItem(idx)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {["en", "ru", "ua"].map((lang) => (
                  <TabsContent key={lang} value={lang} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <Label>Project Title ({lang.toUpperCase()})</Label>
                        <Input 
                          value={localizedData[lang]?.title || ""} 
                          onChange={(e) => updateLangField(lang, "title", e.target.value)}
                          placeholder="Project Name"
                          className="text-lg font-bold"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Short Hook / Card Description</Label>
                        <Input 
                          value={localizedData[lang]?.shortDescription || ""} 
                          onChange={(e) => updateLangField(lang, "shortDescription", e.target.value)}
                          placeholder="Visible on the main grid"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Detailed Description</Label>
                        <Textarea 
                          value={localizedData[lang]?.description || ""} 
                          onChange={(e) => updateLangField(lang, "description", e.target.value)}
                          rows={4}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Tech Stack (Comma separated)</Label>
                          <Input 
                            value={localizedData[lang]?.techStack?.join(", ") || ""} 
                            onChange={(e) => {
                              const tech = e.target.value.split(",").map(t => t.trim()).filter(t => t !== "");
                              updateLangField(lang, "techStack", tech);
                            }}
                            placeholder="React, Next.js, Node.js"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Tags (Comma separated)</Label>
                          <Input 
                            value={localizedData[lang]?.tags?.join(", ") || ""} 
                            onChange={(e) => {
                              const tags = e.target.value.split(",").map(t => t.trim()).filter(t => t !== "");
                              updateLangField(lang, "tags", tags);
                            }}
                            placeholder="E-commerce, SaaS"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Key Features (One per line)</Label>
                        <Textarea 
                          value={localizedData[lang]?.features?.join("\n") || ""} 
                          onChange={(e) => {
                            const features = e.target.value.split("\n").map(f => f.trim()).filter(f => f !== "");
                            updateLangField(lang, "features", features);
                          }}
                          placeholder="Real-time chat&#10;Stripe integration"
                          rows={3}
                        />
                      </div>

                      <div className="pt-6 border-t border-white/10 space-y-6">
                        <h4 className="text-sm font-bold flex items-center gap-2 text-primary">
                          <Plus className="w-4 h-4" /> Technical Structures (JSON Format)
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs">Roadmap Stages</Label>
                            <Textarea 
                              className="font-mono text-[10px] h-32"
                              value={JSON.stringify(localizedData[lang]?.roadmap || [], null, 2)}
                              onChange={(e) => {
                                try {
                                  const val = JSON.parse(e.target.value);
                                  updateLangField(lang, "roadmap", val);
                                } catch(e) {}
                              }}
                            />
                            <p className="text-[10px] text-muted-foreground italic">Paste array of Roadmap objects</p>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs">Documentation Chapters</Label>
                            <Textarea 
                              className="font-mono text-[10px] h-32"
                              value={JSON.stringify(localizedData[lang]?.docs || [], null, 2)}
                              onChange={(e) => {
                                try {
                                  const val = JSON.parse(e.target.value);
                                  updateLangField(lang, "docs", val);
                                } catch(e) {}
                              }}
                            />
                            <p className="text-[10px] text-muted-foreground italic">Paste array of Docs objects</p>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs">User Guide Steps</Label>
                            <Textarea 
                              className="font-mono text-[10px] h-32"
                              value={JSON.stringify(localizedData[lang]?.usage || [], null, 2)}
                              onChange={(e) => {
                                try {
                                  const val = JSON.parse(e.target.value);
                                  updateLangField(lang, "usage", val);
                                } catch(e) {}
                              }}
                            />
                            <p className="text-[10px] text-muted-foreground italic">Paste array of Usage steps</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </ScrollArea>
            
            <DialogFooter className="p-6 border-t border-white/10 bg-white/5">
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button 
                onClick={handleSubmit} 
                disabled={createProjectMutation.isPending || updateProjectMutation.isPending}
              >
                {project ? "Update Project" : "Publish Project"}
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
