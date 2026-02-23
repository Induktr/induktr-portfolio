"use client"

import { toast as sonnerToast } from "sonner"

export function useToast() {
  return {
    toast: ({ title, description, variant, ...props }: any) => {
      const options = {
        description,
        ...props,
      }

      if (variant === "destructive") {
        return sonnerToast.error(title, options)
      }

      return sonnerToast(title, options)
    },
  }
}

export { sonnerToast as toast }
