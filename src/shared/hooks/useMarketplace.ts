import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/shared/lib/queryClient";
import { useToast } from "@/shared/ui";
import { MarketplaceRow, NewMarketplaceRow } from "@shared/api/database/schemas/schema";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import type { Template } from "@/shared/types/template";
import i18n from "i18next";

export function useMarketplace() {
  const { toast } = useToast();
  const { t } = useTranslation();

  const { data: dbItems, isLoading } = useQuery<MarketplaceRow[]>({
    queryKey: ["/api/marketplace"],
  });

  // Data Orchestration logic: Merging static i18n data with DB rows
  // Centralizes transformation so UI components stay presentational
  const ALL_TEMPLATES = useMemo(() => {
    const itemMap = new Map<string, Template | any>();
    const staticTemplates = t('marketplaceTemplates', { returnObjects: true }) as Template[];

    if (Array.isArray(staticTemplates)) {
      staticTemplates.forEach(item => {
        itemMap.set(item.id, { ...item, id: `static-${item.id}`, slug: item.slug || item.id });
      });
    }

    if (dbItems) {
      const currentLang = i18n.language || 'en';
      dbItems.forEach(row => {
        try {
          const parsed = JSON.parse(row.data);
          const langData = parsed[currentLang] || parsed['en'] || Object.values(parsed)[0];
          
          if (langData) {
            itemMap.set(row.slug, {
              ...langData,
              id: `db-${row.id}`,
              slug: row.slug,
              isFromDb: true,
              rawDbData: parsed
            });
          }
        } catch (e) {
          console.error("Failed to parse marketplace item", e);
        }
      });
    }

    return Array.from(itemMap.values());
  }, [dbItems, t]);

  const createItemMutation = useMutation({
    mutationFn: async (item: NewMarketplaceRow) => {
      const res = await fetch("/api/marketplace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error("Failed to create marketplace item");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/marketplace"] });
      toast({ title: "Success", description: "Template added to marketplace." });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, item }: { id: number; item: Partial<NewMarketplaceRow> }) => {
      const res = await fetch(`/api/marketplace/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error("Failed to update marketplace item");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/marketplace"] });
      toast({ title: "Updated", description: "Template changes saved." });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string | number) => {
      const cleanId = id.toString().replace("db-", "");
      if (id.toString().startsWith("static-")) {
        throw new Error("Static templates cannot be deleted via the UI.");
      }
      
      const res = await fetch(`/api/marketplace/${cleanId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete marketplace item");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/marketplace"] });
      toast({ title: "Deleted", description: "Template removed from database." });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return {
    ALL_TEMPLATES,
    isLoading,
    createItemMutation,
    updateItemMutation,
    deleteItemMutation,
  };
}
