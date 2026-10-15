import { Lead } from "@shared/api/database/schemas/lead.schema";

interface TemplateLike {
  price?: number;
  id?: string;
  title?: string;
}

export function getPurchaseDefaultValues(template?: TemplateLike | null): Lead {
  return {
    name: "",
    contact: "",
    projectType: "Other",
    budget: template?.price ? template.price.toString() : "0",
    orderType: "template",
    templateId: template?.id ?? "",
    description: template?.title ? `Purchase of template: ${template.title}` : "",
    paymentMethod: "",
    deadline: "",
    status: "pending",
    telegramChatId: "",
    accessCode: "",
    materialsUrl: "",
  };
}
