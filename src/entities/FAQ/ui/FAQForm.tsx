import { useState } from "react";
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

export const FAQForm = () => {
  const dispatch = useAppDispatch();
  const { modals } = useAppSelector((state) => state.ui);
  const { isOpen, editingItem: item } = modals.faqForm;

  const { createFAQMutation, updateFAQMutation } = useFAQ();
  
  const { 
      slug, setSlug, 
      localizedData, updateLangField, getPayload 
  } = useLocalizedForm(isOpen, item, { q: "", a: "" });

  const [category, setCategory] = useState("general");

  // Sync category manually as it's a top-level schema field (or shared)
  useState(() => { if (item) setCategory(item.category || "general"); });

  const handleClose = () => dispatch(closeModal("faqForm"));

  const handleSubmit = (e: React.FormEvent) => {
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
            {item ? "Edit FAQ Item" : "Add New FAQ Item"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-72 border-r border-white/10 p-6 space-y-6 overflow-y-auto bg-white/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Categorization
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Access Slug</Label>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. refund-policy" className="h-9" />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Category Slug</Label>
                <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. payments" className="h-9" />
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
                        <Label className="text-sm">Question</Label>
                        <Input 
                          value={localizedData[lang]?.q || ""} 
                          onChange={(e) => updateLangField(lang, "q", e.target.value)}
                          className="font-semibold"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Answer</Label>
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
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button 
                onClick={handleSubmit} 
                disabled={createFAQMutation.isPending || updateFAQMutation.isPending}
              >
                {item ? "Update Item" : "Publish Item"}
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
