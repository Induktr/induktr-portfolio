import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Provider } from 'urql';
import { graphqlClient } from '@/shared/api/graphql-client';
import '@/shared/styles/tokens.css';
const TABS = ['terminal', 'telemetry', 'catalog'];
const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
};
const headerStyle = {
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
const brandStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
};
const titleStyle = {
    fontSize: '1.25rem',
    fontWeight: 800,
    letterSpacing: '-0.03em',
};
const badgeStyle = {
    fontSize: '0.7rem',
    padding: '0.15rem 0.5rem',
    borderRadius: '9999px',
    border: '1px solid var(--accent-cyan)',
    color: 'var(--accent-cyan)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
};
const mainStyle = {
    flex: 1,
    padding: '3rem 2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
};
const heroSectionStyle = {
    textAlign: 'center',
    marginBottom: '3rem',
};
const heroHeadingStyle = {
    fontSize: 'var(--font-hero)',
    fontWeight: 900,
    letterSpacing: '-0.04em',
    lineHeight: 1.1,
    margin: '0 0 1rem 0',
};
const heroSubtitleStyle = {
    fontSize: 'var(--font-body)',
    color: 'var(--text-secondary)',
    maxWidth: '680px',
    margin: '0 auto',
    lineHeight: 1.6,
};
const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.5rem',
};
const cardStyle = {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '12px',
    padding: '1.75rem',
};
const cardHeadingStyle = {
    margin: '0 0 0.5rem 0',
    fontSize: '1.25rem',
};
const cardDescStyle = {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    lineHeight: 1.5,
};
const footerStyle = {
    padding: '2rem',
    borderTop: '1px solid var(--border-subtle)',
    textAlign: 'center',
    color: 'var(--text-tertiary)',
    fontSize: '0.85rem',
};
export function App() {
    const [activeTab, setActiveTab] = useState('terminal');
    return (_jsx(Provider, { value: graphqlClient, children: _jsxs("div", { style: containerStyle, children: [_jsxs("header", { style: headerStyle, children: [_jsxs("div", { style: brandStyle, children: [_jsxs("span", { style: titleStyle, children: ["INDUKTR", _jsx("span", { style: { color: 'var(--accent-cyan)' }, children: ".STUDIO" })] }), _jsx("span", { style: badgeStyle, children: "v2.0 Decoupled" })] }), _jsx("nav", { style: { display: 'flex', gap: '1rem' }, children: TABS.map((tab) => {
                                const isActive = activeTab === tab;
                                const buttonStyle = {
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
                                return (_jsx("button", { type: "button", onClick: () => setActiveTab(tab), style: buttonStyle, children: tab.toUpperCase() }, tab));
                            }) })] }), _jsxs("main", { style: mainStyle, children: [_jsxs("section", { style: heroSectionStyle, children: [_jsxs("h1", { style: heroHeadingStyle, children: ["Engineering Autonomous Systems ", _jsx("br", {}), _jsx("span", { style: { color: 'var(--accent-cyan)' }, children: "With Sub-16.6ms Velocity" })] }), _jsx("p", { style: heroSubtitleStyle, children: "Decoupled High-Performance Architecture: NestJS Bun Engine, GraphQL Code-First Arteries, and React 19 Client with OKLCH Mathematical Ergonomics." })] }), _jsxs("div", { style: gridStyle, children: [_jsxs("div", { style: cardStyle, children: [_jsx("div", { style: { color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '0.5rem' }, children: "\u26A1 01. NATIVE RUNTIME" }), _jsx("h3", { style: cardHeadingStyle, children: "Bun 1.4 + NestJS 11" }), _jsx("p", { style: cardDescStyle, children: "Sub-10ms cold boot, microsecond request routing, and zero overhead transpilation." })] }), _jsxs("div", { style: cardStyle, children: [_jsx("div", { style: { color: 'var(--accent-neon)', fontWeight: 700, marginBottom: '0.5rem' }, children: "\uD83D\uDEE1\uFE0F 02. CRYPTO OMNICHANNEL" }), _jsx("h3", { style: cardHeadingStyle, children: "Telegram HMAC-SHA256" }), _jsx("p", { style: cardDescStyle, children: "Zero-password authentication and real-time state synchronization across Web and Mini Apps." })] }), _jsxs("div", { style: cardStyle, children: [_jsx("div", { style: { color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '0.5rem' }, children: "\uD83C\uDFAF 03. 60 FPS RENDER BUDGET" }), _jsx("h3", { style: cardHeadingStyle, children: "React Scan & OKLCH" }), _jsx("p", { style: cardDescStyle, children: "Continuous render profiling ensures sub-16.6ms frames with APCA mathematically calibrated tokens." })] })] })] }), _jsx("footer", { style: footerStyle, children: "Induktr Studio v2.0 \u2022 Canon System Architecture \u2022 Developed by Induktr" })] }) }));
}
export default App;
