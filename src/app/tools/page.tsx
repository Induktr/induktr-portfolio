"use client";

import { ToolGrid } from "@/widgets/ToolGrid";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function ToolsPage() {
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

        <section>
          <h2 className="text-2xl font-semibold mb-6">{t('pages.tools.ourTechStack')}</h2>
          <ToolGrid />
        </section>
      </motion.div>
    </div>
  );
}
