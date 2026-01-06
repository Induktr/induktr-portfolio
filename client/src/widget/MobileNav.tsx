import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { SiGithub, SiTelegram } from "react-icons/si";
import { ThemeToggle } from "@/features/toggle-theme/ThemeToggle";
import { LanguageSwitcher } from "@/features/language-switch/LanguageSwitcher";
import { useTranslation } from "react-i18next";

const navItemVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

export function MobileNav() {
  const { t } = useTranslation();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80vw] sm:w-[380px] bg-background border-r">
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
            <motion.div variants={navItemVariants}>
              <Link href="/projects">
                <div className="block px-4 py-3 text-lg hover:text-primary hover:bg-muted rounded-md cursor-pointer transition-colors">
                  {t('common.projects')}
                </div>
              </Link>
            </motion.div>
            <motion.div variants={navItemVariants}>
              <Link href="/tools">
                <div className="block px-4 py-3 text-lg hover:text-primary hover:bg-muted rounded-md cursor-pointer transition-colors">
                  {t('common.tools')}
                </div>
              </Link>
            </motion.div>
            <motion.div variants={navItemVariants}>
              <Link href="/marketplace">
                <div className="block px-4 py-3 text-lg hover:text-primary hover:bg-muted rounded-md cursor-pointer transition-colors">
                  {t('common.marketplace')}
                </div>
              </Link>
            </motion.div>
            <motion.div variants={navItemVariants}>
              <Link href="/blog">
                <div className="block px-4 py-3 text-lg hover:text-primary hover:bg-muted rounded-md cursor-pointer transition-colors">
                  {t('common.blog')}
                </div>
              </Link>
            </motion.div>
            <motion.div variants={navItemVariants}>
              <Link href="/faq">
                <div className="block px-4 py-3 text-lg hover:text-primary hover:bg-muted rounded-md cursor-pointer transition-colors">
                  {t('common.faq', 'FAQ')}
                </div>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={navItemVariants}
            className="flex items-center gap-4 px-4 pt-4 border-t"
          >
            <motion.a
              href="https://t.me/induktr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-muted"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <SiTelegram className="h-5 w-5" />
              <span className="sr-only">Telegram</span>
            </motion.a>
            <motion.a
              href="https://github.com/induktr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-muted"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <SiGithub className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </motion.a>
            <LanguageSwitcher />
            <ThemeToggle />
          </motion.div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}