import { Template } from "./template";

export interface ProductDetailsDialogProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
  onBuy: (template: Template) => void;
}

export type StateView = "overview" | "docs_list" | "docs_reading" | "roadmap" | "videos";
