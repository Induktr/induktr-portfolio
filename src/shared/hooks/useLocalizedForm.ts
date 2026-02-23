import { useState, useEffect, useCallback } from "react";

/**
 * useLocalizedForm Hook
 * Purpose: Centralizes the management of multi-language form data (EN, RU, UA).
 * Handles state synchronization between modal open states, initial item data, and language tabs.
 */
export function useLocalizedForm<T extends Record<string, any>>(
  isOpen: boolean,
  item: any | null,
  defaultLocalizedFields: T
) {
  const [slug, setSlug] = useState("");
  // Localized data state: { en: { ...fields }, ru: { ...fields }, ua: { ...fields } }
  const [localizedData, setLocalizedData] = useState<Record<string, T>>({
    en: { ...defaultLocalizedFields },
    ru: { ...defaultLocalizedFields },
    ua: { ...defaultLocalizedFields }
  });

  // Sync state when modal opens or editing item changes
  useEffect(() => {
    if (isOpen) {
      if (item) {
        setSlug(item.slug || "");
        
        if (item.rawDbData) {
          setLocalizedData(item.rawDbData);
        } else {
          // If editing a static item (unlikely for DB mutations but good for fallback)
          // or converting partial data
          const entry: Record<string, T> = {
             en: { ...defaultLocalizedFields },
             ru: { ...defaultLocalizedFields },
             ua: { ...defaultLocalizedFields }
          };
          
          Object.keys(entry).forEach(lang => {
             const langEntry = entry[lang];
             Object.keys(defaultLocalizedFields).forEach(field => {
                (langEntry as any)[field] = item[field] || "";
             });
          });
          
          setLocalizedData(entry);
        }
      } else {
        // Reset to defaults for new item
        setSlug("");
        setLocalizedData({
          en: { ...defaultLocalizedFields },
          ru: { ...defaultLocalizedFields },
          ua: { ...defaultLocalizedFields }
        });
      }
    }
  }, [isOpen, item, JSON.stringify(defaultLocalizedFields)]);

  const updateLangField = useCallback((lang: string, field: keyof T, value: any) => {
    setLocalizedData((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value }
    }));
  }, []);

  const getPayload = useCallback((additionalSharedFields: Record<string, any> = {}) => {
      // Merge shared fields into all localized objects if needed, 
      // or just keep them for top-level database schema
      return {
          slug: slug || `item-${Date.now()}`,
          data: JSON.stringify(localizedData),
          isPublished: 1,
          ...additionalSharedFields
      };
  }, [slug, localizedData]);

  return {
    slug,
    setSlug,
    localizedData,
    setLocalizedData,
    updateLangField,
    getPayload
  };
}
