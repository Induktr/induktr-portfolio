import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/shared/lib/queryClient";
import { useToast } from "@/shared/hooks/use-toast";
import { ExperienceRow, NewExperienceRow } from "@shared/api/database/schemas/schema";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import i18n from "i18next";

export function useExperience() {
  const { toast } = useToast();
  const { t } = useTranslation();

  const { data: dbExperience, isLoading } = useQuery<ExperienceRow[]>({
    queryKey: ["/api/experience"],
  });

  // Data Orchestration: Merging static timeline with DB entries
  const MERGED_EXPERIENCE = useMemo(() => {
    const itemsMap = new Map<string, any>();
    const staticExp = t('about.experience.items', { returnObjects: true }) as any[];

    if (Array.isArray(staticExp)) {
      staticExp.forEach((item, idx) => {
        itemsMap.set(`static-${idx}`, { ...item, id: `static-${idx}`, order: -idx });
      });
    }

    if (dbExperience) {
      const currentLang = i18n.language || 'en';
      dbExperience.forEach(row => {
        try {
          const parsed = JSON.parse(row.data);
          const langData = parsed[currentLang] || parsed['en'] || Object.values(parsed)[0];
          if (langData) {
            itemsMap.set(`db-${row.id}`, {
              ...langData,
              id: `db-${row.id}`,
              order: row.order || 0,
              isFromDb: true,
              rawDbData: parsed,
              slug: row.slug
            });
          }
        } catch (e) {
          console.error("Failed to parse exp", e);
        }
      });
    }

    return Array.from(itemsMap.values()).sort((a, b) => b.order - a.order);
  }, [dbExperience, t]);

  const createExperienceMutation = useMutation({
    mutationFn: async (item: NewExperienceRow) => {
      const res = await fetch("/api/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error("Failed to create experience entry");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/experience"] });
      toast({ title: "Success", description: "Experience entry added." });
    },
  });

  const updateExperienceMutation = useMutation({
    mutationFn: async ({ id, item }: { id: number; item: Partial<NewExperienceRow> }) => {
      const res = await fetch(`/api/experience/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error("Failed to update experience entry");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/experience"] });
      toast({ title: "Updated", description: "Experience details saved." });
    },
  });

  const deleteExperienceMutation = useMutation({
    mutationFn: async (id: string | number) => {
      const cleanId = id.toString().replace("db-", "");
      if (id.toString().startsWith("static-")) {
        throw new Error("Static entries cannot be deleted.");
      }
      const res = await fetch(`/api/experience/${cleanId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete entry");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/experience"] });
      toast({ title: "Deleted", description: "Entry removed from timeline." });
    },
  });

  return {
    MERGED_EXPERIENCE,
    isLoading,
    createExperienceMutation,
    updateExperienceMutation,
    deleteExperienceMutation,
  };
}
