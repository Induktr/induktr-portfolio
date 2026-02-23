import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { SiGithub, SiTelegram } from "react-icons/si";
import { ThemeToggle } from "@/features/toggle-theme/ThemeToggle";
import { LanguageSwitcher } from "@/features/language-switch/LanguageSwitcher";

import { PATHS } from "@/shared/config/paths";
import { LINKS } from "@/shared/config/links";
import { navItemVariants } from "@/shared/constants/animations/mobile";
import { useAppDispatch, useAppSelector } from "@/shared/lib/store/store";
import { setSidebar } from "@/shared/lib/store/slices/uiSlice";

export function MobileNav() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { sidebar } = useAppSelector((state) => state.ui);

  const handleOpenChange = (open: boolean) => {
    dispatch(setSidebar(open));
  };

  return (
    <Sheet open={sidebar} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">{t("", "Toggle menu")}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80vw] sm:w-[380px] bg-background/95 backdrop-blur-xl border-r border-white/10">
        <nav className="flex flex-col h-full justify-between py-6">
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={{
              animate: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="flex flex-col space-y-1"
          >
            {PATHS.filter(p => p !== "/").map((path, index) => (
            <motion.div variants={navItemVariants} key={index}>
              <Link href={path} onClick={() => dispatch(setSidebar(false))}>
                <div className="block px-4 py-3 text-lg font-medium hover:text-primary hover:bg-white/5 rounded-md cursor-pointer transition-all">
                  {t(`common.${path.slice(1)}`)}
                </div>
              </Link>
            </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={navItemVariants}
            className="flex items-center gap-4 px-4 pt-4 border-t border-white/10"
          >
            {Object.entries(LINKS).map(([source, link], index) => (
            <motion.a
              href={link}
              key={index}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-white/5"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {source === "telegram" ? (
                <SiTelegram className="h-5 w-5" />
              ) : (
                <SiGithub className="h-5 w-5" />
              )}
              <span className="sr-only">{t("", "Social")}</span>
             </motion.a>
            ))}
            <LanguageSwitcher />
            <ThemeToggle />
          </motion.div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
