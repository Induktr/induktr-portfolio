import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useToast } from "@/shared/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Button } from "@/shared/ui/button";
import { LeadSchema, type Lead } from "@shared/api/database/schemas/lead.schema";
import { apiRequest } from "@/shared/lib/queryClient";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Info, Copy, CheckCheck } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Calendar } from "@/shared/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { use3DTilt } from "@/shared/hooks/use3DTilt";
import { useClipboard } from "@/shared/hooks/useClipboard";
import { Order } from "@/shared/types/template";

export function ContactForm() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { handleMouseMove, handleMouseLeave, style } = use3DTilt();
  const { copied, copyToClipboard } = useClipboard();
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);
  
  const form = useForm<Lead>({
    resolver: zodResolver(LeadSchema),
    defaultValues: {
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
    },
  });

  const onSubmit = async (data: Lead) => {
    try {
      const res = await apiRequest("POST", "/api/send-lead", data);
      const responseData = await res.json();
      
      toast({
        title: t('contactForm.successTitle'),
        description: t('contactForm.successDesc'),
        className: "bg-green-500 text-white border-none",
      });
      
      if (responseData.orderId && responseData.accessCode) {
        setSubmittedOrder({
          orderId: responseData.orderId,
          accessCode: responseData.accessCode
        });
      }
      
      form.reset();
    } catch (error) {
      if(error instanceof Error) {
        console.error(error);
        toast({
          title: t('contactForm.errorTitle'),
          description: t('contactForm.errorDesc'),
          variant: "destructive",
        });
      }
    }
  };

  return (
    <motion.div
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="perspective-1000 w-full max-w-xl mx-auto"
    >
      <div className="bg-card border rounded-xl p-8 shadow-2xl backdrop-blur-sm transform-gpu transition-shadow hover:shadow-primary/20">
        <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
          {t('contactForm.title')}
        </h2>

        {/* Payment Info Block */}
        <div className="mb-8 p-4 bg-primary/5 border border-primary/10 rounded-lg backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div className="text-sm text-foreground/90 space-y-2 w-full">
              <h4 className="font-semibold text-foreground text-base mb-1">{t('contactForm.paymentInfo.title')}</h4>
              <p className="text-muted-foreground">{t('contactForm.paymentInfo.desc')}</p>
              
              <div className="mt-3 p-3 bg-secondary/30 rounded border border-border/50 font-mono text-xs space-y-3 font-medium">
                <div className="group relative">
                  <span className="text-primary/80 font-bold block mb-1 text-[10px] uppercase tracking-wider">{t('contactForm.paymentInfo.cryptoLabel')}</span>
                  <div className="flex items-center gap-2">
                    <span className="select-all block break-all text-foreground bg-background/50 p-2 rounded flex-grow border border-border/30">
                      {t('contactForm.paymentInfo.cryptoValue')}
                    </span>
                    <Button 
                      type="button"
                      variant="outline" 
                      size="icon" 
                      className="h-9 w-9 shrink-0 hover:bg-primary/10 hover:text-primary transition-colors"
                      onClick={() => copyToClipboard(t('contactForm.paymentInfo.cryptoValue'), 'crypto')}
                    >
                      {copied === 'crypto' ? (
                        <CheckCheck className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="border-t border-border/30 pt-3 group relative">
                  <span className="text-primary/80 font-bold block mb-1 text-[10px] uppercase tracking-wider">{t('contactForm.paymentInfo.cardLabel')}</span>
                  <div className="flex items-center gap-2">
                    <span className="select-all block text-foreground bg-background/50 p-2 rounded flex-grow border border-border/30">
                      {t('contactForm.paymentInfo.cardValue')}
                    </span>
                    <Button 
                      type="button"
                      variant="outline" 
                      size="icon" 
                      className="h-9 w-9 shrink-0 hover:bg-primary/10 hover:text-primary transition-colors"
                      onClick={() => copyToClipboard(t('contactForm.paymentInfo.cardValue'), 'card')}
                    >
                      {copied === 'card' ? (
                        <CheckCheck className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground/70 italic mt-2">{t('contactForm.paymentInfo.note')}</p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contactForm.name')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('contactForm.placeholders.name')} {...field} />
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
                  <FormLabel>{t('contactForm.contact')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('contactForm.placeholders.contact')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="projectType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('contactForm.projectType')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('contactForm.placeholders.type')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Landing Page">{t('contactForm.types.landing')}</SelectItem>
                        <SelectItem value="E-commerce">{t('contactForm.types.ecommerce')}</SelectItem>
                        <SelectItem value="SaaS">{t('contactForm.types.saas')}</SelectItem>
                        <SelectItem value="Bot Development">{t('contactForm.types.bot')}</SelectItem>
                        <SelectItem value="Other">{t('contactForm.types.other')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('contactForm.budget')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('contactForm.placeholders.budget')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t('contactForm.deadline')}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal border-input bg-background hover:text-accent-foreground",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              field.value
                            ) : (
                              <span>{t('contactForm.placeholders.deadline')}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value.split('.').reverse().join('-')) : undefined}
                          onSelect={(date) => {
                             field.onChange(date ? format(date, "dd.MM.yyyy") : "");
                          }}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('contactForm.paymentMethod')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Crypto">{t('contactForm.paymentMethods.crypto')}</SelectItem>
                        <SelectItem value="Card">{t('contactForm.paymentMethods.card')}</SelectItem>
                        <SelectItem value="Other">{t('contactForm.paymentMethods.other')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contactForm.description')}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t('contactForm.placeholders.description')}
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? t('contactForm.sending') : t('contactForm.send')}
            </Button>
          </form>
        </Form>
      </div>

      <Dialog open={!!submittedOrder} onOpenChange={(open) => !open && setSubmittedOrder(null)}>
        <DialogContent className="sm:max-w-md bg-card border-primary/20">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary">🎉 Request Received!</DialogTitle>
            <DialogDescription>
              Your project request has been successfully registered.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-4">
            <div className="bg-background/50 p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Order ID:</p>
              <p className="text-xl font-bold font-mono">#{submittedOrder?.orderId}</p>
              
              <div className="my-2 border-t border-border/50" />
              
              <p className="text-sm text-muted-foreground mb-1">Access Code:</p>
              <p className="text-lg font-mono text-primary bg-primary/10 inline-block px-2 py-1 rounded">
                {submittedOrder?.accessCode}
              </p>
            </div>

            <div className="text-sm text-muted-foreground">
              To receive updates and files in Telegram, please start our bot:
            </div>
            
            <Button className="w-full gap-2" variant="outline" onClick={() => window.open(`https://t.me/induktr_portfolio_bot?start=${submittedOrder?.accessCode}`, '_blank')}>
              <Info className="w-4 h-4" />
              Subscribe to Updates
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
