import { useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import {
  Check,
  ShoppingCart,
  ExternalLink,
  Info,
  Plus,
  Pencil,
  Trash2
} from "lucide-react";
import { PurchaseDialog } from "@/features/purchase/PurchaseDialog";
import { ProductDetailsDialog } from "@/features/marketplace/ProductDetailsDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { useAuth } from "@/shared/hooks/useAuth";
import { useMarketplace } from "@/shared/hooks/useMarketplace";
import { MarketplaceForm } from "@/entities/Marketplace/ui/MarketplaceForm";
import { useAppDispatch, useAppSelector } from "@/shared/lib/store/store";
import { openModal, closeModal } from "@/shared/lib/store/slices/uiSlice";

// Nuqs for advanced/encrypted URL params
import { useQueryState } from 'nuqs';
import { parseAsBase64Json } from '@/shared/lib/parsers';

export const Marketplace = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { ALL_TEMPLATES, deleteItemMutation } = useMarketplace();
  
  const dispatch = useAppDispatch();
  const { modals } = useAppSelector((state) => state.ui);
  
  const [activeItemToken, setActiveItemToken] = useQueryState(
    'mxt', 
    parseAsBase64Json<{slug: string, id: string, idx: number}>()
  );

  const viewTemplate = useMemo(() => {
    if (!activeItemToken?.slug) return null;
    return ALL_TEMPLATES.find(p => p.slug === activeItemToken.slug);
  }, [activeItemToken, ALL_TEMPLATES]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this template from database?")) {
      deleteItemMutation.mutate(id);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
        <div className="text-center md:text-left">
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

        {user && (
          <Button 
            className="gap-2 shrink-0 h-12 px-6 shadow-glow hover:shadow-glow-lg transition-all" 
            onClick={() => dispatch(openModal({ modalName: "marketplaceForm" }))}
          >
            <Plus className="w-5 h-5" />
            Add Template
          </Button>
        )}
      </div>

      <MarketplaceForm />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ALL_TEMPLATES.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 2) }}
            layout
            onClick={() => setActiveItemToken({ slug: item.slug, id: item.id, idx: index })}
          >
            <Card 
              className="h-full flex flex-col overflow-hidden border-primary/10 hover:border-primary/50 transition-all group cursor-pointer hover:shadow-lg hover:shadow-primary/5 relative"
            >
              {user && item.isFromDb && (
                <div className="absolute top-2 right-2 z-20 flex gap-2">
                   <Button 
                    size="icon" 
                    variant="secondary" 
                    className="h-8 w-8 bg-background/80 hover:bg-background backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(openModal({ modalName: "marketplaceForm", editingItem: item }));
                    }}
                   >
                     <Pencil className="w-4 h-4" />
                   </Button>
                   <Button 
                    size="icon" 
                    variant="destructive" 
                    className="h-8 w-8 bg-destructive/80 hover:bg-destructive backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                   >
                     <Trash2 className="w-4 h-4" />
                   </Button>
                </div>
              )}

              <div className={`h-48 bg-gradient-to-br ${item.gradient} p-6 flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                <h3 className="text-3xl font-bold text-white drop-shadow-md z-10 text-center uppercase tracking-tighter">{item.title?.split(':')[0]}</h3>
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="font-mono text-xs">{item.stack?.[0]}</Badge>
                  <span className="text-2xl font-bold text-primary">${item.price}</span>
                </div>
                <CardTitle className="line-clamp-1">{item.title}</CardTitle>
                <CardDescription className="line-clamp-2">{item.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-grow">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {item.features?.slice(0, 3).map((feat: string, i: number) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" /> {feat}
                    </li>
                  ))}
                  {item.features?.length > 3 && (
                    <li className="text-xs text-primary pt-1 font-medium flex items-center gap-1">
                      {t("pages.marketplace.fueatersInside", "More features inside...")}
                    </li>
                  )}
                </ul>
              </CardContent>

              <CardFooter className="gap-2 mt-auto">
                <Button 
                  className="w-full gap-2 font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300" 
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(openModal({ modalName: "purchaseDialog", editingItem: item }));
                  }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {t('pages.marketplace.buy', 'Buy Now')}
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
        template={modals.purchaseDialog.editingItem} 
        isOpen={modals.purchaseDialog.isOpen}
        onClose={() => dispatch(closeModal("purchaseDialog"))}
        onSuccess={(id, code) => {
          dispatch(closeModal("purchaseDialog"));
          dispatch(openModal({ 
            modalName: "orderSuccessDialog", 
            editingItem: { orderId: id, accessCode: code } 
          }));
        }}
      />

      <ProductDetailsDialog 
        template={viewTemplate}
        isOpen={!!viewTemplate}
        onClose={() => setActiveItemToken(null)}
        onBuy={(template) => dispatch(openModal({ modalName: "purchaseDialog", editingItem: template }))}
      />

      <Dialog 
        open={modals.orderSuccessDialog.isOpen} 
        onOpenChange={(open) => !open && dispatch(closeModal("orderSuccessDialog"))}
      >
        <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-primary/20 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary font-bold">{t("pages.marketplace.pay.success", "🎉 Payment Confirmed!")}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {t("pages.marketplace.pay.desc", "Your order has been registered. I will verify the payment and send your files.")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-4">
            <div className="bg-background/50 p-6 rounded-2xl border border-primary/10 shadow-inner">
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest font-bold">{t("pages.marketplace.order.id", "Order ID:")}</p>
              <p className="text-3xl font-black font-mono text-foreground mb-4">#{modals.orderSuccessDialog.editingItem?.orderId}</p>
              
              <div className="my-4 border-t border-primary/5" />
              
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest font-bold">{t("pages.marketplace.order.id", "Access Code:")}</p>
              <p className="text-xl font-mono text-primary bg-primary/10 inline-block px-4 py-2 rounded-xl border border-primary/20">
                {modals.orderSuccessDialog.editingItem?.accessCode}
              </p>
            </div>

            <div className="text-sm text-muted-foreground text-center">
              {t("pages.marketplace.pay.order.getFiles.desc", "Get your files instantly in Telegram once payment is verified:")}
            </div>
            
            <Button 
                className="w-full h-12 gap-2 text-lg font-bold shadow-glow" 
                onClick={() => window.open(`https://t.me/induktr_portfolio_bot?start=${modals.orderSuccessDialog.editingItem?.accessCode}`, '_blank')}
            >
              <Info className="w-5 h-5" />
              {t("pages.marketplace.pay.order.getFiles.step", "Get Files in Telegram")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
