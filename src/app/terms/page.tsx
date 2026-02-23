"use client";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Terms of Service
        </h1>
        <p className="text-gray-400 mb-8">Last updated: January 16, 2026</p>

        <section className="space-y-8 text-gray-300">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Service Scope</h2>
            <p>
              Induktr offers digital services including UI Kits, Landing Pages, Web Development, 
              and Automation Software. By purchasing or using our services, you agree to these terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Digital Products</h2>
            <p>
              UI Kits and digital templates are provided with a license for use. Redistribution 
              or resale of raw assets is strictly prohibited unless specified otherwise.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Third-Party Integrations</h2>
            <p>
              Our automation tools (like A.S.T.R.A.) rely on third-party APIs (TikTok, Google, etc.). 
              We are not responsible for changes, downtime, or policy updates from these external platforms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">4. No Financial Advice</h2>
            <p>
              Any trading-related tools or content are for educational and automation purposes only. 
              We do not provide financial advice and are not liable for any trading losses.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
