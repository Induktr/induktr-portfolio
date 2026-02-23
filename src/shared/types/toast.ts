import type {
  ToastActionElement,
  ToastProps,
} from "@/shared/ui/toast";
import { ReactNode } from "react";
import { actionTypes } from "../constants/lib/state";

export type ToasterToast = ToastProps & {
  id: string
  title?: ReactNode
  description?: ReactNode
  action?: ToastActionElement
}

export type ActionType = typeof actionTypes

export type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

export interface State {
  toasts: ToasterToast[]
}

export type Toast = Omit<ToasterToast, "id">
