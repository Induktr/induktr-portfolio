import { ToolGrid } from "@/widget/ToolGrid";
import { ToolComparison } from "@/features/comparisons-tools/ToolComparison";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Tools() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4">{t('pages.tools.title')}</h1>
        <p className="text-muted-foreground text-lg mb-8">
          {t('pages.tools.description')}
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{t('pages.tools.performanceComparison')}</h2>
          <div className="bg-card rounded-lg p-6 shadow-lg">
            <ToolComparison />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">{t('pages.tools.ourTechStack')}</h2>
          <ToolGrid />
        </section>
      </motion.div>
    </div>
  );
}