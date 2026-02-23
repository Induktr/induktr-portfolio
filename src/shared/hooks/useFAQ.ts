import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/shared/lib/queryClient";
import { useToast } from "@/shared/hooks/use-toast";
import { FAQRow, NewFAQRow } from "@shared/api/database/schemas/schema";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import i18n from "i18next";

export function useFAQ() {
  const { toast } = useToast();
  const { t } = useTranslation();

  const { data: dbFAQ, isLoading } = useQuery<FAQRow[]>({
    queryKey: ["/api/faq"],
  });

  // Data Orchestration: Merging static i18n FAQ with DB entries
  const MERGED_FAQ = useMemo(() => {
    const faqMap = new Map<string, any[]>();
    const staticData = t('faq.faqData', { returnObjects: true }) as any[];

    if (Array.isArray(staticData)) {
      staticData.forEach(cat => {
        if (!faqMap.has(cat.category)) faqMap.set(cat.category, []);
        cat.items.forEach((item: any) => {
          faqMap.get(cat.category)!.push({
            ...item,
            id: `static-${item.q.slice(0, 10)}`,
            category: cat.category
          });
        });
      });
    }

    if (dbFAQ) {
      const currentLang = i18n.language || 'en';
      dbFAQ.forEach(row => {
        try {
          const parsed = JSON.parse(row.data);
          const langData = parsed[currentLang] || parsed['en'] || Object.values(parsed)[0];
          if (langData) {
            const cat = row.category || "General";
            if (!faqMap.has(cat)) faqMap.set(cat, []);
            faqMap.get(cat)!.push({
              ...langData,
              id: `db-${row.id}`,
              isFromDb: true,
              rawDbData: parsed,
              slug: row.slug,
              category: cat
            });
          }
        } catch (e) {
          console.error("Failed to parse FAQ", e);
        }
      });
    }

    return Array.from(faqMap.entries()).map(([name, items]) => ({
        category: name,
        items
    }));
  }, [dbFAQ, t]);

  const createFAQMutation = useMutation({
    mutationFn: async (item: NewFAQRow) => {
      const res = await fetch("/api/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error("Failed to create FAQ item");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faq"] });
      toast({ title: "Success", description: "FAQ item added." });
    },
  });

  const updateFAQMutation = useMutation({
    mutationFn: async ({ id, item }: { id: number; item: Partial<NewFAQRow> }) => {
      const res = await fetch(`/api/faq/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error("Failed to update FAQ item");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faq"] });
      toast({ title: "Updated", description: "Changes saved." });
    },
  });

  const deleteFAQMutation = useMutation({
    mutationFn: async (id: string | number) => {
      const cleanId = id.toString().replace("db-", "");
      if (id.toString().startsWith("static-")) {
        throw new Error("Static items cannot be deleted.");
      }
      const res = await fetch(`/api/faq/${cleanId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete FAQ item");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faq"] });
      toast({ title: "Deleted", description: "Item removed from database." });
    },
  });

  return {
    MERGED_FAQ,
    isLoading,
    createFAQMutation,
    updateFAQMutation,
    deleteFAQMutation,
  };
}
