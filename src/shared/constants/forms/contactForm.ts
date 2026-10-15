import { Lead } from "@shared/api/database/schemas/lead.schema";

export const DEFAULT_LEAD_FORM_VALUES: Lead = {
  name: "",
  contact: "",
  projectType: "Other",
  budget: "",
  deadline: "",
  paymentMethod: "",
  description: "",
  orderType: "custom",
  templateId: "",
  status: "pending",
  telegramChatId: "",
  accessCode: "",
  materialsUrl: "",
};

export interface ProjectTypeOption {
  value: string;
  translationKey: string;
}

export const PROJECT_TYPE_OPTIONS: readonly ProjectTypeOption[] = [
  { value: "Landing Page", translationKey: "contactForm.types.landing" },
  { value: "E-commerce", translationKey: "contactForm.types.ecommerce" },
  { value: "SaaS", translationKey: "contactForm.types.saas" },
  { value: "Bot Development", translationKey: "contactForm.types.bot" },
  { value: "Other", translationKey: "contactForm.types.other" },
] as const;

export interface PaymentMethodOption {
  valueKey: string;
  defaultValue: string;
  translationKey: string;
}

export const PAYMENT_METHOD_OPTIONS: readonly PaymentMethodOption[] = [
  { valueKey: "common.crypto", defaultValue: "Crypto", translationKey: "contactForm.paymentMethods.crypto" },
  { valueKey: "common.card", defaultValue: "Card", translationKey: "contactForm.paymentMethods.card" },
  { valueKey: "common.other", defaultValue: "Other", translationKey: "contactForm.paymentMethods.other" },
] as const;
