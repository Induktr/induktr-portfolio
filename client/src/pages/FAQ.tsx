import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/shared/ui/accordion";
import { Card, CardContent } from "@/shared/ui/card";
import { HelpCircle, MessageCircle, Wallet, Code2, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Link } from "wouter";

export default function FAQ() {
  const { t } = useTranslation();

  const faqCategories = [
    {
      id: "general",
      title: t('faq.categories.general', 'General Questions'),
      icon: <HelpCircle className="w-5 h-5 text-primary" />,
      items: [
        {
          q: t('faq.items.what_is_induktr.q', 'What is Induktr Portfolio?'),
          a: t('faq.items.what_is_induktr.a', 'Induktr Portfolio is a boutique digital ecosystem created by @Induktr. It serves as both a showcase of high-end engineering and a marketplace for premium, production-ready templates and AI-powered tools.')
        },
        {
          q: t('faq.items.how_it_works.q', 'How does the ordering process work?'),
          a: t('faq.items.how_it_works.a', 'Once you select a template in the Marketplace and click "Buy", you will receive payment instructions. After payment, you get an access code. Enter this code in our official Telegram Bot to instantly download the source files and documentation.')
        },
        {
          q: t('faq.items.custom_projects.q', 'Can I hire you for a custom project?'),
          a: t('faq.items.custom_projects.a', 'Yes! I specialize in building MVPs, high-performance landings, and AI automations. Fill out the form on the "Start Project" page, and I will get back to you with a proposal.')
        }
      ]
    },
    {
      id: "technical",
      title: t('faq.categories.tech', 'Technical Details'),
      icon: <Code2 className="w-5 h-5 text-blue-500" />,
      items: [
        {
          q: t('faq.items.stack.q', 'What technologies do you use?'),
          a: t('faq.items.stack.a', 'I primarily use Next.js, React, and TypeScript for the frontend, combined with Python (Flask/FastAPI) or Node.js for heavy logic and AI integrations. For styling, Tailwind CSS and Framer Motion are my standards.')
        },
        {
          q: t('faq.items.ai_safety.q', 'Are the AI trading tools safe?'),
          a: t('faq.items.ai_safety.a', 'The A.S.T.R.A. and Hunter Bot tools are designed with "Safety First" principles. They include risk management modules and use official APIs. However, they are provided as frameworks for your own strategies; always test in testnets/sandbox.')
        }
      ]
    },
    {
      id: "payments",
      title: t('faq.categories.payments', 'Payments & Delivery'),
      icon: <Wallet className="w-5 h-5 text-green-500" />,
      items: [
        {
          q: t('faq.items.payment_methods.q', 'Which payment methods are accepted?'),
          a: t('faq.items.payment_methods.a', 'I currently accept USDT (TRC20/ERC20/TON) and direct Bank Card transfers (USD/EUR). Details are provided during the checkout process.')
        },
        {
          q: t('faq.items.refunds.q', 'Do you offer refunds?'),
          a: t('faq.items.refunds.a', 'Due to the digital nature of the products (source code access), I generally do not offer refunds once the files are downloaded. However, I provide full support to ensure the template works as advertised.')
        }
      ]
    }
  ] as const;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-primary shadow-glow" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400 mb-4">
            {t('faq.title', 'Frequently Asked Questions')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('faq.subtitle', 'Everything you need to know about Induktr templates and services')}
          </p>
        </motion.div>

        <div className="space-y-12">
          {faqCategories.map((cat, catIdx) => (
            <motion.section
              key={cat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * catIdx }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-background border border-border shadow-sm rounded-lg">
                  {cat.icon}
                </div>
                <h2 className="text-2xl font-bold">{cat.title}</h2>
              </div>

              <Card className="bg-card/30 backdrop-blur-sm border-primary/10 overflow-hidden">
                <CardContent className="p-0">
                  <Accordion type="single" collapsible className="w-full">
                    {cat.items.map((item, itemIdx) => (
                      <AccordionItem 
                        key={itemIdx} 
                        value={`${cat.id}-${itemIdx}`}
                        className="border-b border-white/5 last:border-none px-6"
                      >
                        <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors py-5 text-left font-medium text-base">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed pb-5 text-sm md:text-base">
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

        {/* Contact CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-background to-secondary/10 border border-primary/20 text-center relative overflow-hidden group"
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
