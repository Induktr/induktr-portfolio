"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Link from "next/link";
import { SiGithub, SiTelegram } from "react-icons/si";
import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "@/features/toggle-theme/ThemeToggle";
import { LanguageSwitcher } from "@/features/language-switch/LanguageSwitcher";
import { PATHS } from "@/shared/config/paths";
import { LINKS } from "@/shared/config/links";

export const Header = () => {
  const { t } = useTranslation();

  return (
    <motion.header 
      className="border-b"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <MobileNav />
          <Link href="/">
            <motion.span
              className="text-2xl font-bold cursor-pointer"
              whileHover="hover"
              whileTap="tap"
            >
              {t("", "Induktr")}
            </motion.span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          {PATHS.filter(p => p !== "/").map((path, index) => (
            <Link href={path} key={index}>
              <motion.span
                className="cursor-pointer"
                whileHover="hover"
                whileTap="tap"
              >
                {t(`common.${path.slice(1)}`)}
              </motion.span>
            </Link>
          ))}

          <div className="flex items-center space-x-4">
            {Object.entries(LINKS).map(([source, link], index) => (
              <motion.a
                href={link}
                key={index}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {source === "telegram" ? (
                  <SiTelegram className="h-5 w-5" />
                ) : (
                  <SiGithub className="h-5 w-5" />
                )}
                <span className="sr-only">{t("", "Telegram")}</span>
              </motion.a>
            ))}
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </motion.header>
  );
}
