import { useEffect, useState } from "react";

import { Dialog } from "@radix-ui/react-dialog";

import type { ModalProps } from "../types/modal";

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    const [open, setOpen] = useState(isOpen);

    const handleClose = () => {
        setOpen(false);
        onClose();
    };

    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            {children}
        </Dialog>
    )
}
