import { useState } from "react";
import { useExperience } from "@/shared/hooks/useExperience";
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
import { Briefcase, Settings } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/shared/lib/store/store";
import { closeModal } from "@/shared/lib/store/slices/uiSlice";
import { useLocalizedForm } from "@/shared/hooks/useLocalizedForm";

export const ExperienceForm = () => {
  const dispatch = useAppDispatch();
  const { modals } = useAppSelector((state) => state.ui);
  const { isOpen, editingItem: item } = modals.experienceForm;

  const { createExperienceMutation, updateExperienceMutation } = useExperience();
  
  const { 
      slug, setSlug, 
      localizedData, updateLangField, getPayload 
  } = useLocalizedForm(isOpen, item, { role: "", period: "", description: "", catalog: "" });

  const [order, setOrder] = useState(0);

  // Sync order manually from item
  useState(() => { if (item) setOrder(item.order || 0); });

  const handleClose = () => dispatch(closeModal("experienceForm"));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...getPayload(), order };

    if (item?.isFromDb) {
      updateExperienceMutation.mutate({ id: parseInt(item.id.toString().replace("db-", "")), item: payload }, {
        onSuccess: () => handleClose()
      });
    } else {
      createExperienceMutation.mutate(payload, {
        onSuccess: () => handleClose()
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-background/95 backdrop-blur-xl border-white/10">
        <DialogHeader className="p-6 border-b border-white/10">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary" />
            {item ? "Edit Experience Entry" : "Add Career Milestone"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-72 border-r border-white/10 p-6 space-y-6 overflow-y-auto bg-white/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Timeline Control
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Timeline Slug</Label>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. senior-dev" className="h-9" />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Display Order (Higher = First)</Label>
                <Input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value))} className="h-9" />
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
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm">Role Title</Label>
                          <Input 
                            value={localizedData[lang]?.role || ""} 
                            onChange={(e) => updateLangField(lang, "role", e.target.value)}
                            className="font-semibold"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Period</Label>
                          <Input 
                            value={localizedData[lang]?.period || ""} 
                            onChange={(e) => updateLangField(lang, "period", e.target.value)}
                            placeholder="e.g. 2023 - Present"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Main Description</Label>
                        <Textarea 
                          value={localizedData[lang]?.description || ""} 
                          onChange={(e) => updateLangField(lang, "description", e.target.value)}
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Catalog Highlights (Optional)</Label>
                        <Textarea 
                          value={localizedData[lang]?.catalog || ""} 
                          onChange={(e) => updateLangField(lang, "catalog", e.target.value)}
                          rows={3}
                          placeholder="Key achievements or catalog text..."
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
                disabled={createExperienceMutation.isPending || updateExperienceMutation.isPending}
              >
                {item ? "Update Milestone" : "Publish Career Move"}
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
