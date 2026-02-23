import { ReactNode } from "react";
import { Project } from "./project";

export type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export interface GalleryProps {
  project: Project;
  className?: string;
}
