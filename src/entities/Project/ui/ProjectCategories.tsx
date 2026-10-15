import { useTranslation } from "react-i18next";

import { Button } from "@/shared/ui/button";
import { motion } from "framer-motion";
import type { ProjectCategoriesProps } from "@/shared/types/project";
import { getCategoryIcon } from "@/shared/lib/icons/categoryIcons";

export const ProjectCategories = ({
  categories,
  selectedCategories,
  onSelectCategory,
}: ProjectCategoriesProps) => {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{t('projects.categories.title')}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant={selectedCategories.includes(category.id) ? "default" : "outline"}
              className="w-full h-full min-h-[100px] flex flex-col items-center justify-center gap-2 p-4"
              onClick={() => onSelectCategory(category.id)}
            >
              {getCategoryIcon(category.icon)}
              <span className="text-sm font-medium text-center">{t(`projects.categories.names.${category.id}`)}</span>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
