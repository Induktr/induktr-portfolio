import { useState } from "react";
import { useMarketplace } from "@/shared/hooks/useMarketplace";
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
import { ShoppingCart, Settings, Plus, X } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { useAppDispatch, useAppSelector } from "@/shared/lib/store/store";
import { closeModal } from "@/shared/lib/store/slices/uiSlice";
import { useLocalizedForm } from "@/shared/hooks/useLocalizedForm";

export const MarketplaceForm = () => {
  const dispatch = useAppDispatch();
  const { modals } = useAppSelector((state) => state.ui);
  const { isOpen, editingItem: item } = modals.marketplaceForm;

  const { createItemMutation, updateItemMutation } = useMarketplace();
  
  const { 
    slug, setSlug, 
    localizedData, setLocalizedData, 
    updateLangField, getPayload 
  } = useLocalizedForm(isOpen, item, { title: "", description: "", features: [] as string[] });

  const [price, setPrice] = useState("0");
  const [gradient, setGradient] = useState("from-blue-600 to-cyan-500");
  const [stack, setStack] = useState<string[]>(["React", "TypeScript"]);
  const [newStackItem, setNewStackItem] = useState("");

  useState(() => {
    if (item) {
      setPrice(item.price?.toString() || "0");
      setGradient(item.gradient || "from-blue-600 to-cyan-500");
      setStack(item.stack || []);
    }
  });

  const handleClose = () => dispatch(closeModal("marketplaceForm"));

  const addFeature = (lang: string) => {
    const currentFeatures = localizedData[lang]?.features || [];
    updateLangField(lang, "features", [...currentFeatures, ""]);
  };

  const removeFeature = (lang: string, index: number) => {
    const currentFeatures = [...(localizedData[lang]?.features || [])];
    currentFeatures.splice(index, 1);
    updateLangField(lang, "features", currentFeatures);
  };

  const updateFeature = (lang: string, index: number, value: string) => {
    const currentFeatures = [...(localizedData[lang]?.features || [])];
    currentFeatures[index] = value;
    updateLangField(lang, "features", currentFeatures);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Inject shared fields into the localized structure as per backend expectation
    const finalLocalized = { ...localizedData } as any;
    Object.keys(finalLocalized).forEach(lang => {
        finalLocalized[lang] = {
            ...finalLocalized[lang],
            price: parseFloat(price),
            gradient,
            stack
        };
    });

    const payload = getPayload(); // Base payload from hook
    payload.data = JSON.stringify(finalLocalized); // Re-injecting with merged fields

    if (item?.isFromDb) {
      updateItemMutation.mutate({ id: parseInt(item.id.toString().replace("db-", "")), item: payload }, {
        onSuccess: () => handleClose()
      });
    } else {
      createItemMutation.mutate(payload, {
        onSuccess: () => handleClose()
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-background/95 backdrop-blur-xl border-white/10">
        <DialogHeader className="p-6 border-b border-white/10">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-primary" />
            {item ? "Edit Marketplace Template" : "Add New Premium Solution"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-80 border-r border-white/10 p-6 space-y-6 overflow-y-auto bg-white/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Settings className="w-4 h-4" />
              General Configuration
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Unique Slug</Label>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. nextjs-saas-starter" className="h-9 font-mono text-xs" />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Price ($)</Label>
                <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="h-9 text-lg font-bold text-primary" />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Gradient (Tailwind classes)</Label>
                <Input value={gradient} onChange={(e) => setGradient(e.target.value)} placeholder="from-blue-600 to-cyan-500" className="h-9 text-xs" />
                <div className={`h-8 rounded w-full bg-gradient-to-br ${gradient}`} />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Tech Stack</Label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {stack.map((s, i) => (
                    <Badge key={i} variant="secondary" className="gap-1 pr-1 text-[10px]">
                      {s} <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => setStack(stack.filter((_, idx) => idx !== i))} />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-1">
                  <Input value={newStackItem} onChange={(e) => setNewStackItem(e.target.value)} placeholder="Add tech..." className="h-8 text-xs" onKeyDown={(e) => e.key === 'Enter' && (setStack([...stack, newStackItem]), setNewStackItem(""))} />
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => (setStack([...stack, newStackItem]), setNewStackItem(""))}><Plus className="w-3 h-3" /></Button>
                </div>
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
                        <Label className="text-sm">Product Title</Label>
                        <Input 
                          value={localizedData[lang]?.title || ""} 
                          onChange={(e) => updateLangField(lang, "title", e.target.value)}
                          className="text-lg font-bold"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Full Description</Label>
                        <Textarea 
                          value={localizedData[lang]?.description || ""} 
                          onChange={(e) => updateLangField(lang, "description", e.target.value)}
                          rows={4}
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Key Features</Label>
                            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => addFeature(lang)}>
                                <Plus className="w-3 h-3" /> Add Feature
                            </Button>
                        </div>
                        <div className="grid gap-2">
                            {localizedData[lang]?.features?.map((feat: string, i: number) => (
                                <div key={i} className="flex gap-2">
                                    <Input 
                                        value={feat} 
                                        onChange={(e) => updateFeature(lang, i, e.target.value)}
                                        className="h-9 text-sm"
                                        placeholder={`Feature ${i+1}`}
                                    />
                                    <Button size="icon" variant="ghost" className="h-9 w-9 text-destructive" onClick={() => removeFeature(lang, i)}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
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
                disabled={createItemMutation.isPending || updateItemMutation.isPending}
                className="gap-2"
              >
                {item ? "Update Template" : "Publish to Marketplace"}
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
