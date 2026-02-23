"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/shared/ui/accordion";
import { Card, CardContent } from "@/shared/ui/card";
import { HelpCircle, Plus, Pencil, Trash2, Zap, MessageCircle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { useAuth } from "@/shared/hooks/useAuth";
import { useFAQ } from "@/shared/hooks/useFAQ";
import { FAQForm } from "@/entities/FAQ/ui/FAQForm";
import { useAppDispatch } from "@/shared/lib/store/store";
import { openModal } from "@/shared/lib/store/slices/uiSlice";
import { Loader } from "@/shared/ui/Loader";

export default function FAQPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { MERGED_FAQ: faqCategories, isLoading, deleteFAQMutation } = useFAQ();
  const dispatch = useAppDispatch();

  const handleDelete = (id: string | number) => {
    if (confirm("Delete this FAQ item?")) {
      deleteFAQMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
        {isLoading && <Loader className="min-h-screen flex items-center justify-center" text="Loading FAQ..." variant="primary" />}
        
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
          <HelpCircle className="w-8 h-8 text-primary shadow-glow" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-purple-400 mb-4">
          {t('faq.title', 'Frequently Asked Questions')}
        </h1>
        <p className="text-xl text-muted-foreground">
          {t('faq.subtitle', 'Everything you need to know about Induktr templates and services')}
        </p>

          
          {user && (
            <Button 
              className="mt-6 gap-2" 
              onClick={() => dispatch(openModal({ modalName: "faqForm" }))}
            >
              <Plus className="w-4 h-4" /> Add FAQ Item
            </Button>
          )}
        </motion.div>

        <FAQForm />

        <div className="space-y-12">
          {faqCategories.map((cat, catIdx) => (
            <motion.section
              key={cat.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * catIdx }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-background border border-border shadow-sm rounded-lg">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold capitalize">{cat.category}</h2>
              </div>

              <Card className="bg-card/30 backdrop-blur-sm border-primary/10 overflow-hidden">
                <CardContent className="p-0">
                  <Accordion type="single" collapsible className="w-full">
                    {cat.items.map((item: any, itemIdx: number) => (
                      <AccordionItem 
                        key={item.id} 
                        value={`${cat.category}-${itemIdx}`}
                        className="border-b border-white/5 last:border-none px-6 relative group"
                      >
                        <div className="flex items-center justify-between">
                          <AccordionTrigger className="flex-1 hover:no-underline hover:text-primary transition-colors py-5 text-left font-medium text-base">
                            {item.q}
                          </AccordionTrigger>
                          
                          {user && item.isFromDb && (
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute right-12 top-1/2 -translate-y-1/2 z-10">
                               <Button 
                                size="icon" 
                                variant="secondary" 
                                className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dispatch(openModal({ modalName: "faqForm", editingItem: item }));
                                }}
                               >
                                 <Pencil className="w-4 h-4" />
                               </Button>
                               <Button 
                                size="icon" 
                                variant="destructive" 
                                className="h-8 w-8 bg-destructive/80 backdrop-blur-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(item.id);
                                }}
                               >
                                 <Trash2 className="w-4 h-4" />
                               </Button>
                            </div>
                          )}
                        </div>
                        <AccordionContent className="text-muted-foreground leading-relaxed pb-5 text-sm md:text-base pr-12">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </motion.section>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 p-8 rounded-2xl bg-linear-to-br from-primary/10 via-background to-secondary/10 border border-primary/20 text-center relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Zap size={120} />
          </div>
          
          <h3 className="text-2xl font-bold mb-4">{t('faq.cta.title', 'Still have questions?')}</h3>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            {t('faq.cta.desc', "If you couldn't find the answer you were looking for, feel free to reach out to me directly on Telegram.")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="gap-2" onClick={() => window.open('https://t.me/induktr', '_blank')}>
              <MessageCircle className="w-5 h-5" />
              {t('faq.cta.telegram', 'Chat on Telegram')}
            </Button>
            <Link href="/#contact">
              <Button size="lg" variant="outline">
                {t('faq.cta.form', 'Contact Form')}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
