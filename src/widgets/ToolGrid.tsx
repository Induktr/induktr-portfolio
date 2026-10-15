import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/shared/ui/button";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/shared/hooks/useAuth";
import { useTools } from "@/shared/hooks/useTools";
import { useToolFilter } from "@/shared/hooks/useToolFilter";
import { renderToolIcon } from "@/shared/lib/icons/toolIcons";
import { ToolForm } from "@/entities/Tool/ui/ToolForm";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useAppDispatch } from "@/shared/lib/store/store";
import { openModal } from "@/shared/lib/store/slices/uiSlice";
import type { ToolItem } from "@/shared/types/tools";

const ToolGrid = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { MERGED_CATEGORIES, deleteWithConfirmation } = useTools();
  const { selectedCategory, setSelectedCategory, filteredTools } = useToolFilter(MERGED_CATEGORIES);

  const dispatch = useAppDispatch();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className="transition-all"
          >
            {t('tools.allCategories')}
          </Button>
          {MERGED_CATEGORIES.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.category)}
              className="transition-all"
            >
              {category.category}
            </Button>
          ))}
        </div>

        {user && (
          <Button 
            className="gap-2" 
            onClick={() => dispatch(openModal({ modalName: "toolForm" }))}
          >
            <Plus className="w-4 h-4" /> Add Tool
          </Button>
        )}
      </div>

      <ToolForm />

      <div className="grid gap-12">
        <AnimatePresence mode="popLayout">
          {filteredTools.map((category, index) => (
            <motion.section
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              <h2 className="text-2xl font-bold mb-6 border-l-4 border-primary pl-4">{category.category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((tool: ToolItem) => (
                  <motion.div
                    key={tool.slug}
                    layout
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="relative group"
                  >
                    {user && tool.isFromDb && (
                      <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          size="icon" 
                          variant="secondary" 
                          className="h-7 w-7 bg-background/80 backdrop-blur-sm"
                          onClick={() => dispatch(openModal({ modalName: "toolForm", editingItem: tool }))}
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="destructive" 
                          className="h-7 w-7 bg-destructive/80 backdrop-blur-sm"
                          onClick={() => tool.id && deleteWithConfirmation(tool.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}

                    <Card className="h-full border-white/5 hover:border-primary/20 bg-card/50 backdrop-blur-sm overflow-hidden transition-all">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-3 text-lg">
                          <div className="p-2 rounded-lg bg-primary/5 text-primary">
                            {renderToolIcon(tool.icon)}
                          </div>
                          {tool.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ToolGrid;