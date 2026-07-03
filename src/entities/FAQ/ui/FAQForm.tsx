import { FormEvent, useState } from "react";
import { useFAQ } from "@/shared/hooks/useFAQ";
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
import { HelpCircle, Settings } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/shared/lib/store/store";
import { closeModal } from "@/shared/lib/store/slices/uiSlice";
import { useLocalizedForm } from "@/shared/hooks/useLocalizedForm";
import { useTranslation } from "react-i18next";

export const FAQForm = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { modals } = useAppSelector((state) => state.ui);
  const { isOpen, editingItem: item } = modals.faqForm;

  const { createFAQMutation, updateFAQMutation } = useFAQ();
  
  const { 
      slug,
      setSlug, 
      localizedData,
      updateLangField,
      getPayload 
  } = useLocalizedForm(isOpen, item, { q: "", a: "" });

  const [category, setCategory] = useState("general");

  useState(() => { if (item) setCategory(item.category || "general"); });

  const handleClose = () => dispatch(closeModal("faqForm"));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload = { ...getPayload(), category };

    if (item?.isFromDb) {
      updateFAQMutation.mutate({ id: parseInt(item.id.toString().replace("db-", "")), item: payload }, {
        onSuccess: () => handleClose()
      });
    } else {
      createFAQMutation.mutate(payload, {
        onSuccess: () => handleClose()
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-background/95 backdrop-blur-xl border-white/10">
        <DialogHeader className="p-6 border-b border-white/10">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-primary" />
            {item ? t("faq.editFAQItem", "Edit FAQ Item") : t("faq.addNewFAQItem", "Add New FAQ Item")}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-72 border-r border-white/10 p-6 space-y-6 overflow-y-auto bg-white/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Settings className="w-4 h-4" />
              {t("faq.categorization", "Categorization")}
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">{t("faq.accessSlug", "Access Slug")}</Label>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. refund-policy" className="h-9" />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">{t("faq.categorySlug", "Category Slug")}</Label>
                <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. payments" className="h-9" />
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
                      <div className="space-y-2">
                        <Label className="text-sm">{t("faq.question", "Question")}</Label>
                        <Input 
                          value={localizedData[lang]?.q || ""} 
                          onChange={(e) => updateLangField(lang, "q", e.target.value)}
                          className="font-semibold"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">{t("faq.answer", "Answer")}</Label>
                        <Textarea 
                          value={localizedData[lang]?.a || ""} 
                          onChange={(e) => updateLangField(lang, "a", e.target.value)}
                          rows={6}
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
                disabled={createFAQMutation.isPending || updateFAQMutation.isPending}
              >
                {item ? t("common.update", "Update") : t("common.publish", "Publish")}
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
