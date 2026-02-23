import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/shared/lib/queryClient";
import { useToast } from "@/shared/ui";
import { ToolRow, NewToolRow } from "@shared/api/database/schemas/schema";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import type { ToolCategory, ToolItem } from "@/shared/types/tools";
import i18n from "i18next";

export function useTools() {
  const { toast } = useToast();
  const { t } = useTranslation();

  const { data: dbTools, isLoading } = useQuery<ToolRow[]>({
    queryKey: ["/api/tools"],
  });

  // Data Orchestration: Merging static tools configuration with Database items
  // Components should not perform this calculation; the hook is the source of truth
  const MERGED_CATEGORIES = useMemo(() => {
    const categoriesMap = new Map<string, ToolItem[]>();
    const toolsMap = new Map<string, any>();
    const staticCategories = t('toolsData', { returnObjects: true }) as ToolCategory[];

    if (Array.isArray(staticCategories)) {
      staticCategories.forEach(cat => {
        cat.items.forEach(item => {
          const slug = item.name.toLowerCase().replace(/\s+/g, '-');
          toolsMap.set(slug, { ...item, category: cat.category, slug });
        });
      });
    }

    if (dbTools) {
      const currentLang = i18n.language || 'en';
      dbTools.forEach(row => {
        try {
          const parsed = JSON.parse(row.data);
          const langData = parsed[currentLang] || parsed['en'] || Object.values(parsed)[0];
          if (langData) {
            toolsMap.set(row.slug, {
              ...langData,
              id: `db-${row.id}`,
              slug: row.slug,
              isFromDb: true,
              rawDbData: parsed,
              icon: langData.icon,
              category: langData.category
            });
          }
        } catch (e) {
          console.error("Failed to parse tool", e);
        }
      });
    }

    toolsMap.forEach(tool => {
      const cat = tool.category || "Other";
      if (!categoriesMap.has(cat)) categoriesMap.set(cat, []);
      categoriesMap.get(cat)!.push(tool);
    });

    return Array.from(categoriesMap.entries()).map(([name, items]) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      category: name,
      items
    }));
  }, [dbTools, t]);

  const createToolMutation = useMutation({
    mutationFn: async (tool: NewToolRow) => {
      const res = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tool),
      });
      if (!res.ok) throw new Error("Failed to create tool");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tools"] });
      toast({ title: "Success", description: "Tool added to database." });
    },
  });

  const updateToolMutation = useMutation({
    mutationFn: async ({ id, tool }: { id: number; tool: Partial<NewToolRow> }) => {
      const res = await fetch(`/api/tools/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tool),
      });
      if (!res.ok) throw new Error("Failed to update tool");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tools"] });
      toast({ title: "Updated", description: "Tool changes saved." });
    },
  });

  const deleteToolMutation = useMutation({
    mutationFn: async (id: string | number) => {
      const cleanId = id.toString().replace("db-", "");
      if (id.toString().startsWith("static-")) {
        throw new Error("Static tools cannot be deleted via the UI.");
      }
      
      const res = await fetch(`/api/tools/${cleanId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete tool");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tools"] });
      toast({ title: "Deleted", description: "Tool removed from database." });
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
    MERGED_CATEGORIES,
    isLoading,
    createToolMutation,
    updateToolMutation,
    deleteToolMutation,
  };
}
