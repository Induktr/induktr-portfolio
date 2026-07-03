"use client";
import { useTranslation } from "react-i18next";

const PrivacyPage = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          {t("privacy.title")}
        </h1>
        <p className="text-gray-400 mb-8">{t("privacy.lastUpdated")}</p>

        <section className="space-y-8 text-gray-300">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Scope of Service</h2>
            <p>
              {t("privacy.serviceScopeDesc")}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Data and Third-Party Integrations</h2>
            <p>
              {t("privacy.thirdPartyIntegrationsDesc")}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Client & User Data</h2>
            <p>
              {t("privacy.clientUserDataDesc")}
            </p>
          </div>

          <div className="pt-10 border-t border-white/10">
            <p>{t("privacy.inquiries")} <span className="text-blue-400">{t("contact.email")}</span></p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default PrivacyPage;