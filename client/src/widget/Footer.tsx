import { Link } from "wouter";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-primary/5 mt-8 py-8 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4">inDuktr</h3>
            <p className="text-muted-foreground">
              {t('footer.description')}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">{t('footer.navigation.title')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition">
                  {t('footer.navigation.home')}
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-muted-foreground hover:text-primary transition">
                  {t('footer.navigation.tools')}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition">
                  {t('footer.navigation.blog')}
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-muted-foreground hover:text-primary transition">
                  {t('footer.navigation.projects')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            {t('footer.copyright')}
          </p>
          
          <div className="flex space-x-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition"
            >
              {t('footer.social.github')}
            </a>
            <a 
              href="https://twitter.com" 
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