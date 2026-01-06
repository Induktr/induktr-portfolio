import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Check, ShoppingCart, ExternalLink, Info } from "lucide-react";
import { PurchaseDialog } from "@/features/purchase/PurchaseDialog";
import { ProductDetailsDialog } from "@/features/marketplace/ProductDetailsDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

interface Template {
  id: string;
  title: string;
  description: string;
  price: number;
  stack: string[];
  features: string[];
  gradient: string;
}

export default function Marketplace() {
  const { t } = useTranslation();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [viewTemplate, setViewTemplate] = useState<Template | null>(null);
  const [submittedOrder, setSubmittedOrder] = useState<{orderId: number, accessCode: string} | null>(null);

  const templates = t('marketplaceTemplates', { returnObjects: true }) as Template[];

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400 mb-4"
        >
          {t('marketplace.title', 'Marketplace')}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-muted-foreground"
        >
          {t('marketplace.subtitle', 'Premium templates and ready-to-use solutions')}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 2) }}
          >
            <Card 
              className="h-full flex flex-col overflow-hidden border-primary/20 hover:border-primary/50 transition-all group cursor-pointer hover:shadow-lg hover:shadow-primary/5"
              onClick={() => setViewTemplate(item)}
            >
              <div className={`h-48 bg-gradient-to-br ${item.gradient} p-6 flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                <h3 className="text-3xl font-bold text-white drop-shadow-md z-10 text-center">{item.title.split(':')[0]}</h3>
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="font-mono text-xs">{item.stack[0]}</Badge>
                  <span className="text-2xl font-bold text-primary">${item.price}</span>
                </div>
                <CardTitle className="line-clamp-1">{item.title}</CardTitle>
                <CardDescription className="line-clamp-2">{item.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-grow">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {item.features.slice(0, 3).map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" /> {feat}
                    </li>
                  ))}
                  {item.features.length > 3 && (
                    <li className="text-xs text-primary pt-1 font-medium flex items-center gap-1">
                       More features inside...
                    </li>
                  )}
                </ul>
              </CardContent>

              <CardFooter className="gap-2 mt-auto">
                <Button 
                  className="w-full gap-2" 
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTemplate(item);
                  }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {t('marketplace.buy', 'Buy Now')}
                </Button>
                 <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open('https://github.com/induktr', '_blank');
                    }}
                  >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      <PurchaseDialog 
        template={selectedTemplate} 
        onClose={() => setSelectedTemplate(null)}
        onSuccess={(id, code) => {
          setSelectedTemplate(null);
          setSubmittedOrder({ orderId: id, accessCode: code });
        }}
      />

      <ProductDetailsDialog 
        template={viewTemplate}
        isOpen={!!viewTemplate}
        onClose={() => setViewTemplate(null)}
        onBuy={(template) => setSelectedTemplate(template)}
      />

      <Dialog open={!!submittedOrder} onOpenChange={(open) => !open && setSubmittedOrder(null)}>
        <DialogContent className="sm:max-w-md bg-card border-primary/20">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary">🎉 Payment Confirmed!</DialogTitle>
            <DialogDescription>
              Your order has been registered. I will verify the payment and send your files.
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
              Get your files instantly in Telegram once payment is verified:
            </div>
            
            <Button className="w-full gap-2" variant="outline" onClick={() => window.open(`https://t.me/induktr_portfolio_bot?start=${submittedOrder?.accessCode}`, '_blank')}>
              <Info className="w-4 h-4" />
              Get Files in Telegram
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
