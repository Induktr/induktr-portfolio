import { useState, useEffect } from "react";
import { CLOUD_DOCS_BASE_URL } from "@/shared/constants/cloude/docs";

/**
 * Custom hook to fetch document content with a cloud fallback.
 * Uses async/await for cleaner logic.
 */
export const useFetchDocContent = (path: string | undefined, isOpen: boolean) => {
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If no path is provided or dialog is closed, clear content and exit
    if (!path || !isOpen) {
      setContent(null);
      return;
    }

    const fetchContent = async () => {
      setIsLoading(true);
      setContent(null); // Clear previous content before fetching new
      
      try {
        // 1. Try local fetch
        const response = await fetch(path);
        if (!response.ok) throw new Error("Local document not found");
        const text = await response.text();
        setContent(text);
      } catch (localError) {
        // 2. Fallback to Cloud URL if local fails
        try {
          const cloudUrl = `${CLOUD_DOCS_BASE_URL}${path}`;
          const cloudResponse = await fetch(cloudUrl);
          if (!cloudResponse.ok) throw new Error("Cloud document not found");
          const cloudText = await cloudResponse.text();
          setContent(cloudText);
        } catch (cloudError) {
          if (cloudError instanceof Error) {
            console.error(`Failed to fetch content for ${path}:`, cloudError.message);
          }
          setContent(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [path, isOpen]);

  return { content, isLoading, setContent };
};
