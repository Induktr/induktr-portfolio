import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Phone, Send } from "lucide-react";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-primary/5 mt-8 py-8 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-sm">
            <h3 className="text-lg font-medium mb-4">inDuktr</h3>
            <p className="text-muted-foreground">
              {t('footer.description')}
            </p>
          </div>
          
          <div className="flex flex-row gap-12 md:gap-24">
            <div>
              <h3 className="text-lg font-medium mb-4">{t('footer.navigation.title')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-primary transition">
                    {t('common.about')}
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-primary transition">
                    {t('footer.navigation.home')}
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="text-muted-foreground hover:text-primary transition">
                    {t('footer.navigation.projects')}
                  </Link>
                </li>
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
            <a 
              href="https://github.com/Induktr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition"
            >
              {t('footer.social.github')}
            </a>
            <a 
              href="https://x.com/induktr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition"
            >
              {t('footer.social.twitter')}
            </a>
            <a 
              href="https://www.linkedin.com/in/nikita-voitenko-416686399/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition"
            >
              {t('footer.social.linkedin')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 