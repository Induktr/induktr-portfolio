"use client";

import { useTranslation } from "react-i18next";
import { Fragment } from "react";
import { Phone, Send } from "lucide-react";
import Link from "next/link";
import { LINKS } from "@/shared/config/links";

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-primary/5 mt-8 py-8 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-sm">
            <h3 className="text-lg font-medium mb-4">{t("", "Induktr")}</h3>
            <p className="text-muted-foreground">
              {t('footer.description')}
            </p>
          </div>
          
          <div className="flex flex-row gap-12 md:gap-24">
            <div>
              <h3 className="text-lg font-medium mb-4">{t('footer.navigation.title')}</h3>
              <ul className="space-y-2">
                {Object.entries(LINKS).map(([source, link], index) => (
                <li key={index}>
                  <a href={link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition">
                    {t(`common.${source}`)}
                  </a>
                </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">{t('footer.contacts.title')}</h3>
              <ul className="space-y-2">
                <li className="text-muted-foreground">
                  <a href="tel:+380689621643" className="hover:text-primary transition flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {t('footer.contacts.phone')}
                  </a>
                </li>
                <li>
                  <a 
                    href="https://t.me/induktrs" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {t('footer.contacts.telegram')}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            {t('footer.copyright')}
          </p>
          
          <div className="flex space-x-4">
            {Object.entries(LINKS).map(([source, link], index) => (
              <Fragment key={index}>
                <a 
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition"
                >
                  {t(`footer.social.${source}`)}
                </a>
              </Fragment>
            ))}
          </div>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary transition">
              {t("footer.privacy", "Privacy Policy")}
            </Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary transition">
              {t("footer.terms", "Terms of Service")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
