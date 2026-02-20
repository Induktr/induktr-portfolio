import { useState } from "react";
import { useTools } from "@/shared/hooks/useTools";
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
import { Wrench, Plus, Settings } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/shared/lib/store/store";
import { closeModal } from "@/shared/lib/store/slices/uiSlice";
import { useLocalizedForm } from "@/shared/hooks/useLocalizedForm";

export const ToolForm = () => {
  const dispatch = useAppDispatch();
  const { modals } = useAppSelector((state) => state.ui);
  const { isOpen, editingItem: tool } = modals.toolForm;

  const { createToolMutation, updateToolMutation } = useTools();
  
  const { 
    slug, setSlug, 
    localizedData, updateLangField, getPayload 
  } = useLocalizedForm(isOpen, tool, { name: "", description: "" });

  const [icon, setIcon] = useState("");
  const [category, setCategory] = useState("");
  
  // Sync non-localized fields
  useState(() => {
    if (tool) {
      setIcon(tool.icon || "");
      setCategory(tool.category || "");
    }
  });

  const handleClose = () => dispatch(closeModal("toolForm"));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Inject shared fields into localized data as per backend pattern
    const finalLocalized = { ...localizedData } as any;
    Object.keys(finalLocalized).forEach(lang => {
        finalLocalized[lang] = {
            ...finalLocalized[lang],
            icon,
            category,
            slug
        };
    });

    const payload = getPayload();
    payload.data = JSON.stringify(finalLocalized);

    if (tool?.isFromDb) {
      updateToolMutation.mutate({ id: parseInt(tool.id.toString().replace("db-", "")), tool: payload }, {
        onSuccess: () => handleClose()
      });
    } else {
      createToolMutation.mutate(payload, {
        onSuccess: () => handleClose()
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-background/95 backdrop-blur-xl border-white/10">
        <DialogHeader className="p-6 border-b border-white/10">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Wrench className="w-6 h-6 text-primary" />
            {tool ? "Edit Tool" : "Add New Technology"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-72 border-r border-white/10 p-6 space-y-6 overflow-y-auto bg-white/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Metadata
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Unique Slug</Label>
                <input 
                  value={slug} 
                  onChange={(e) => setSlug(e.target.value)} 
                  placeholder="e.g. react-native" 
                  className="w-full h-9 bg-background border border-border rounded-md px-3 text-sm" 
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">React Icon (SimpleIcons name)</Label>
                <input 
                  value={icon} 
                  onChange={(e) => setIcon(e.target.value)} 
                  placeholder="e.g. SiReact" 
                  className="w-full h-9 bg-background border border-border rounded-md px-3 text-sm" 
                />
                <p className="text-[10px] text-muted-foreground">Lookup icon names at react-icons.github.io</p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Category</Label>
                <input 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  placeholder="e.g. Development & Programming" 
                  className="w-full h-9 bg-background border border-border rounded-md px-3 text-sm" 
                />
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-w-0">
            <ScrollArea className="flex-1 p-6">
              <Tabs defaultValue="en" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 sticky top-0 z-10 bg-background/50 backdrop-blur pb-1">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="ru">Русский</TabsTrigger>
                  <TabsTrigger value="ua">Українська</TabsTrigger>
                </TabsList>

                {["en", "ru", "ua"].map((lang) => (
                  <TabsContent key={lang} value={lang} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm">Tool Name ({lang.toUpperCase()})</Label>
                        <Input 
                          value={localizedData[lang]?.name || ""} 
                          onChange={(e) => updateLangField(lang, "name", e.target.value)}
                          placeholder="e.g. Next.js"
                          className="text-base font-semibold"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Description</Label>
                        <Textarea 
                          value={localizedData[lang]?.description || ""} 
                          onChange={(e) => updateLangField(lang, "description", e.target.value)}
                          placeholder="Short description of the tool..."
                          rows={4}
                        />
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
                disabled={createToolMutation.isPending || updateToolMutation.isPending}
              >
                {tool ? "Update Tool" : "Publish Tool"}
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
