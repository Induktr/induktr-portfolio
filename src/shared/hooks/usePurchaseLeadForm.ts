import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LeadSchema, type Lead } from "@shared/api/database/schemas/lead.schema";
import { apiRequest } from "@/shared/lib/queryClient";
import { useToast } from "@/shared/ui/use-toast";
import { getPurchaseDefaultValues } from "@/shared/constants/forms/purchaseForm";
import type { PurchaseDialogProps } from "@/shared/types/project";

interface UsePurchaseLeadFormProps {
  template: PurchaseDialogProps["template"];
  onSuccess: PurchaseDialogProps["onSuccess"];
}

export function usePurchaseLeadForm({ template, onSuccess }: UsePurchaseLeadFormProps) {
  const { toast } = useToast();

  const form = useForm<Lead>({
    resolver: zodResolver(LeadSchema),
    defaultValues: getPurchaseDefaultValues(template),
  });

  useEffect(() => {
    if (template) {
      form.reset(getPurchaseDefaultValues(template));
    }
  }, [template, form]);

  const onSubmit = async (data: Lead) => {
    try {
      const res = await apiRequest("POST", "/api/send-lead", {
        ...data,
        budget: template?.price.toString(),
        templateId: template?.id,
        orderType: "template",
      });
      const responseData = await res.json();

      onSuccess(responseData.orderId, responseData.accessCode);
      form.reset();
    } catch {
      toast({
        title: "Error",
        description: "Failed to process your order. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    form,
    onSubmit,
  };
}
