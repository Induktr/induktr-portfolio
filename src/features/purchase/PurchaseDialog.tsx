import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useToast } from "@/shared/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Info, Copy, CheckCircle2 } from "lucide-react";
import { LeadSchema, type Lead } from "@shared/api/database/schemas/lead.schema";
import { apiRequest } from "@/shared/lib/queryClient";
import { PurchaseDialogProps } from "@/shared/types/project";
import { useClipboard } from "@/shared/hooks/useClipboard";

export const PurchaseDialog = ({
  template,
  isOpen,
  onClose,
  onSuccess
}: PurchaseDialogProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { copied, copyToClipboard } = useClipboard();

  const form = useForm<Lead>({
    resolver: zodResolver(LeadSchema),
    defaultValues: {
      name: "",
      contact: "",
      projectType: "Other",
      budget: template?.price.toString() || "0",
      orderType: "template",
      templateId: template?.id || "",
      description: `Purchase of template: ${template?.title}`,
      paymentMethod: "",
      deadline: "",
      status: "pending",
      telegramChatId: "",
      accessCode: "",
      materialsUrl: "",
    },
  });

  const onSubmit = async (data: Lead) => {
    try {
      const res = await apiRequest("POST", "/api/send-lead", {
        ...data,
        budget: template?.price.toString(),
        templateId: template?.id,
        orderType: "template"
      });
      const responseData = await res.json();
      
      onSuccess(responseData.orderId, responseData.accessCode);
      form.reset();
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to process your order. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-card border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            Purchase {template.title}
          </DialogTitle>
          <DialogDescription>
            Follow the instructions below to complete your purchase.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Requisites Block */}
          <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg space-y-4">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <Info className="w-5 h-5" />
              <span>Payment Details</span>
              <span className="ml-auto text-xl font-bold">${template.price}</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-background/50 rounded border border-border/50 group">
                <span className="text-muted-foreground block mb-1 uppercase tracking-tighter text-[10px]">USDT (TRC20)</span>
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate select-all">{t('contactForm.paymentInfo.cryptoValue')}</span>
                  <Button 
                    variant="ghost" size="icon" className="h-6 w-6" 
                    onClick={() => copyToClipboard(t('contactForm.paymentInfo.cryptoValue'), 'crypto')}
                  >
                    {copied === 'crypto' ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-background/50 rounded border border-border/50 group">
                <span className="text-muted-foreground block mb-1 uppercase tracking-tighter text-[10px]">Bank Card</span>
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate select-all">{t('contactForm.paymentInfo.cardValue')}</span>
                  <Button 
                    variant="ghost" size="icon" className="h-6 w-6" 
                    onClick={() => copyToClipboard(t('contactForm.paymentInfo.cardValue'), 'card')}
                  >
                    {copied === 'card' ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground italic">
              Send the exact amount and fill the form below to notify me.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telegram / Email</FormLabel>
                    <FormControl>
                      <Input placeholder="@username or email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-medium mt-4"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Confirming..." : "I have paid"}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
