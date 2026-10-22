import type React from 'react';
import { useState } from 'react';
import { Provider } from 'urql';
import { graphqlClient } from '@/shared/api/graphql-client';
import '@/shared/styles/tokens.css';

const TABS = ['terminal', 'telemetry', 'catalog'] as const;
type TabType = (typeof TABS)[number];

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
};

const headerStyle: React.CSSProperties = {
  padding: '1.25rem 2rem',
  borderBottom: '1px solid var(--border-subtle)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'var(--bg-glass)',
  backdropFilter: 'blur(12px)',
  position: 'sticky',
  top: 0,
  zIndex: 50,
};

const brandStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
};

const titleStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 800,
  letterSpacing: '-0.03em',
};

const badgeStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  padding: '0.15rem 0.5rem',
  borderRadius: '9999px',
  border: '1px solid var(--accent-cyan)',
  color: 'var(--accent-cyan)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const mainStyle: React.CSSProperties = {
  flex: 1,
  padding: '3rem 2rem',
  maxWidth: '1200px',
  margin: '0 auto',
  width: '100%',
};

const heroSectionStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '3rem',
};

const heroHeadingStyle: React.CSSProperties = {
  fontSize: 'var(--font-hero)',
  fontWeight: 900,
  letterSpacing: '-0.04em',
  lineHeight: 1.1,
  margin: '0 0 1rem 0',
};

const heroSubtitleStyle: React.CSSProperties = {
  fontSize: 'var(--font-body)',
  color: 'var(--text-secondary)',
  maxWidth: '680px',
  margin: '0 auto',
  lineHeight: 1.6,
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '1.5rem',
};

const cardStyle: React.CSSProperties = {
  background: 'var(--bg-surface)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '12px',
  padding: '1.75rem',
};

const cardHeadingStyle: React.CSSProperties = {
  margin: '0 0 0.5rem 0',
  fontSize: '1.25rem',
};

const cardDescStyle: React.CSSProperties = {
  color: 'var(--text-secondary)',
  fontSize: '0.9rem',
  lineHeight: 1.5,
};

const footerStyle: React.CSSProperties = {
  padding: '2rem',
  borderTop: '1px solid var(--border-subtle)',
  textAlign: 'center',
  color: 'var(--text-tertiary)',
  fontSize: '0.85rem',
};

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('terminal');

  return (
    <Provider value={graphqlClient}>
      <div style={containerStyle}>
        {/* Navigation Bar */}
        <header style={headerStyle}>
          <div style={brandStyle}>
            <span style={titleStyle}>
              INDUKTR<span style={{ color: 'var(--accent-cyan)' }}>.STUDIO</span>
            </span>
            <span style={badgeStyle}>v2.0 Decoupled</span>
          </div>

          <nav style={{ display: 'flex', gap: '1rem' }}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab;
              const buttonStyle: React.CSSProperties = {
                background: isActive ? 'var(--bg-surface)' : 'transparent',
                border: isActive ? '1px solid var(--border-subtle)' : 'none',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.875rem',
                transition: 'color 0.15s ease',
              };
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  style={buttonStyle}
                >
                  {tab.toUpperCase()}
                </button>
              );
            })}
          </nav>
        </header>

        {/* Hero & Content Viewport */}
        <main style={mainStyle}>
          <section style={heroSectionStyle}>
            <h1 style={heroHeadingStyle}>
              Engineering Autonomous Systems <br />
              <span style={{ color: 'var(--accent-cyan)' }}>With Sub-16.6ms Velocity</span>
            </h1>
            <p style={heroSubtitleStyle}>
              Decoupled High-Performance Architecture: NestJS Bun Engine, GraphQL Code-First Arteries,
              and React 19 Client with OKLCH Mathematical Ergonomics.
            </p>
          </section>

          {/* Core Feature Matrix */}
          <div style={gridStyle}>
            <div style={cardStyle}>
              <div style={{ color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '0.5rem' }}>
                ⚡ 01. NATIVE RUNTIME
              </div>
              <h3 style={cardHeadingStyle}>Bun 1.4 + NestJS 11</h3>
              <p style={cardDescStyle}>
                Sub-10ms cold boot, microsecond request routing, and zero overhead transpilation.
              </p>
            </div>

            <div style={cardStyle}>
              <div style={{ color: 'var(--accent-neon)', fontWeight: 700, marginBottom: '0.5rem' }}>
                🛡️ 02. CRYPTO OMNICHANNEL
              </div>
              <h3 style={cardHeadingStyle}>Telegram HMAC-SHA256</h3>
              <p style={cardDescStyle}>
                Zero-password authentication and real-time state synchronization across Web and Mini Apps.
              </p>
            </div>

            <div style={cardStyle}>
              <div style={{ color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '0.5rem' }}>
                🎯 03. 60 FPS RENDER BUDGET
              </div>
              <h3 style={cardHeadingStyle}>React Scan & OKLCH</h3>
              <p style={cardDescStyle}>
                Continuous render profiling ensures sub-16.6ms frames with APCA mathematically calibrated tokens.
              </p>
            </div>
          </div>
        </main>

        {/* Global Footer */}
        <footer style={footerStyle}>
          Induktr Studio v2.0 • Canon System Architecture • Developed by Induktr
        </footer>
      </div>
    </Provider>
  );
}

export default App;
