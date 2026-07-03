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
import { useTranslation } from "react-i18next";

const ExperienceForm = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { modals } = useAppSelector((state) => state.ui);
  const { isOpen, editingItem: item } = modals.experienceForm;

  const { createExperienceMutation, updateExperienceMutation } = useExperience();
  
  const {
      slug, setSlug, 
      localizedData, updateLangField, getPayload 
  } = useLocalizedForm(isOpen, item, { role: "", period: "", description: "", catalog: "" });

  const [order, setOrder] = useState(0);

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
            {item ? t("experience.editExperienceEntry", "Edit Experience Entry") : t("experience.addCareerMilestone", "Add Career Milestone")}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-72 border-r border-white/10 p-6 space-y-6 overflow-y-auto bg-white/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Settings className="w-4 h-4" />
              {t("experience.timelineControl", "Timeline Control")}
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">{t("experience.timelineSlug", "Timeline Slug")}</Label>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. senior-dev" className="h-9" />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">{t("experience.displayOrder", "Display Order (Higher = First)")}</Label>
                <Input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value))} className="h-9" />
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-w-0">
            <ScrollArea className="flex-1 p-6">
              <Tabs defaultValue="en" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 sticky top-0 z-10 bg-background/50 backdrop-blur pb-1">
                  <TabsTrigger value="en">{t("common.english", "English")}</TabsTrigger>
                  <TabsTrigger value="ru">{t("common.russian", "Русский")}</TabsTrigger>
                  <TabsTrigger value="ua">{t("common.ukrainian", "Українська")}</TabsTrigger>
                </TabsList>

                {["en", "ru", "ua"].map((lang) => (
                  <TabsContent key={lang} value={lang} className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm">{t("experience.roleTitle", "Role Title")}</Label>
                          <Input 
                            value={localizedData[lang]?.role || ""} 
                            onChange={(e) => updateLangField(lang, "role", e.target.value)}
                            className="font-semibold"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">{t("experience.period", "Period")}</Label>
                          <Input 
                            value={localizedData[lang]?.period || ""} 
                            onChange={(e) => updateLangField(lang, "period", e.target.value)}
                            placeholder="e.g. 2023 - Present"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">{t("experience.mainDescription", "Main Description")}</Label>
                        <Textarea 
                          value={localizedData[lang]?.description || ""} 
                          onChange={(e) => updateLangField(lang, "description", e.target.value)}
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">{t("experience.catalogHighlights", "Catalog Highlights (Optional)")}</Label>
                        <Textarea 
                          value={localizedData[lang]?.catalog || ""} 
                          onChange={(e) => updateLangField(lang, "catalog", e.target.value)}
                          rows={3}
                          placeholder={t("experience.catalogHighlightsPlaceholder", "Key achievements or catalog text...")}
                        />
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </ScrollArea>
            
            <DialogFooter className="p-6 border-t border-white/10 bg-white/5">
              <Button variant="outline" onClick={handleClose}>{t("common.cancel", "Cancel")}</Button>
              <Button 
                onClick={handleSubmit} 
                disabled={createExperienceMutation.isPending || updateExperienceMutation.isPending}
              >
                {item ? t("experience.updateMilestone", "Update Milestone") : t("experience.publishCareerMove", "Publish Career Move")}
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExperienceForm;
