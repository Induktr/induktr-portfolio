"use client";
import { useTranslation } from "react-i18next";

const TermsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          {t("terms.title")}
        </h1>
        <p className="text-gray-400 mb-8">{t("terms.lastUpdated")}</p>

        <section className="space-y-8 text-gray-300">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Service Scope</h2>
            <p>
              {t("terms.serviceScopeDesc")}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Digital Products</h2>
            <p>
              {t("terms.digitalProductsDesc")}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Third-Party Integrations</h2>
            <p>
              {t("terms.thirdPartyIntegrationsDesc")}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">4. No Financial Advice</h2>
            <p>
              {t("terms.noFinancialAdviceDesc")}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default TermsPage;
