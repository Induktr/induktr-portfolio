import { FC } from 'react';

export const PrivacyPage: FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        <p className="text-gray-400 mb-8">Last updated: January 16, 2026</p>

        <section className="space-y-8 text-gray-300">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Scope of Service</h2>
            <p>
              Induktr ("we", "our") provides digital services including UI/UX design, web development, 
              custom automation tools, and trading assistants (A.S.T.R.A.). This policy applies to all 
              products and services offered under the Induktr brand.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Data and Third-Party Integrations</h2>
            <p>
              When using our automation tools integrated with platforms like TikTok, YouTube, or Google, 
              we only access the data absolutely necessary for the service to function (e.g., media upload permissions). 
              We do not store your personal credentials or sensitive data on our remote servers.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Client & User Data</h2>
            <p>
              For our design and development clients: any data shared during the project (briefs, assets, 
              proprietary information) is kept strictly confidential and used solely for project fulfillment.
            </p>
          </div>

          <div className="pt-10 border-t border-white/10">
            <p>Inquiries: <span className="text-blue-400">nikitavoitenko2020@gmail.com</span></p>
          </div>
        </section>
      </div>
    </div>
  );
};

