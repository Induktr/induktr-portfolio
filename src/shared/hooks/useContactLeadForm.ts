import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/shared/ui/use-toast";
import { LeadSchema, type Lead } from "@shared/api/database/schemas/lead.schema";
import { apiRequest } from "@/shared/lib/queryClient";
import { useTranslation } from "react-i18next";
import { Order } from "@/shared/types/template";
import { DEFAULT_LEAD_FORM_VALUES } from "@/shared/constants/forms/contactForm";

export function useContactLeadForm() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);

  const form = useForm<Lead>({
    resolver: zodResolver(LeadSchema),
    defaultValues: DEFAULT_LEAD_FORM_VALUES,
  });

  const onSubmit = async (data: Lead) => {
    try {
      const res = await apiRequest("POST", "/api/send-lead", data);
      const responseData = await res.json();

      toast({
        title: t("contactForm.successTitle"),
        description: t("contactForm.successDesc"),
        className: "bg-green-500 text-white border-none",
      });

      if (responseData.orderId && responseData.accessCode) {
        setSubmittedOrder({
          orderId: responseData.orderId,
          accessCode: responseData.accessCode,
        });
      }

      form.reset();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        toast({
          title: t("contactForm.errorTitle"),
          description: t("contactForm.errorDesc"),
          variant: "destructive",
        });
      }
    }
  };

  return {
    form,
    onSubmit,
    submittedOrder,
    setSubmittedOrder,
  };
}
