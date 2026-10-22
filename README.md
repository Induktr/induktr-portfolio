# ⚡ Induktr Studio v2.0 — High-Performance Protocol & Engineering Platform

> **Status:** Production Architecture v2.0 (Major Migration)  
> **Brand Mission:** *Turning Complexity into Leverage*  
> **Lead Architect:** Nikita Voitenko (Induktr)  
> **Core Paradigms:** Decoupled Microservices • 60/120 FPS Compositor UI • Bun Runtime • Prisma 7 • GraphQL Code-First • Telegram Omnichannel Sync  

---

## 🏛️ Executive Architecture Migration (v1.0 ➔ v2.0)

In version **v2.0**, the **Induktr Studio** digital platform underwent a qualitative leap from the monolithic prototype of the first iteration to a sovereign, distributed microservice ecosystem matching Silicon Valley SaaS standards:

| Layer / Component | v1.0 (Legacy Prototype) | v2.0 (Production Protocol) | v2.0 Engineering Leverage |
| :--- | :--- | :--- | :--- |
| **Frontend Toolchain** | Next.js 16 (App Router / RSC) | **Vite 6 + React 19 SPA (FSD 2.1)** | Eliminates hydration overhead, instant HMR (<15ms), TTFB < 15ms |
| **Render Profiler** | None | **React Scan Integration** | Hardware 60/120 FPS enforcement, sub-16.6ms frame budget, 0 redundant renders |
| **Design System** | sRGB Tailwind v4 | **OKLCH Color Math + 8px Grid** | Perceptually uniform palette, deep obsidian, fluid typography `clamp()` |
| **Backend Runtime** | Node.js Runtime | **Bun v1.2+ Native Runtime** | 3.2x higher I/O throughput, cold start <10ms, native TypeScript |
| **Backend Core** | Express / Route Handlers | **NestJS 11+ Modular Core** | Enterprise Dependency Injection, strict Guards, Pipes, and Interceptors |
| **Data Layer & ORM** | Drizzle ORM | **Prisma 7 (PostgreSQL)** | High-speed Wasm query engine, declarative migrations, 100% Type-Safe |
| **API Protocol** | REST API endpoints | **GraphQL Code-First Gateway** | Zero over-fetching, strict DTO schemas, single typed schema contract |
| **Authentication** | Classical Cookie Sessions | **Telegram HMAC-SHA256 + JWT** | Zero-password 1-click login, seamless Web ⟷ Telegram Mini App state sync |
| **Internationalization**| UA / EN / RU | **EN, UA, DE, AR (RTL), ES** | 5 strategic gateways, dynamic chunks <5KB, CSS Logical Properties |

---

## 📚 Project Documentation Hub (`/docs`)

All comprehensive architectural and engineering specifications are organized in the [`/docs`](./docs/) directory:

* **[📐 docs/README.md](./docs/README.md)** — Universal Architectural Blueprint & Canonical Template.
* **[🏛️ docs/doc-architecture.md](./docs/doc-architecture.md)** — Core System Topology, Dual-Loop Data Pipeline, Idempotency Protocols, Prisma 7 Transactions, and Circuit Breakers.
* **[⚙️ docs/doc-tech.md](./docs/doc-tech.md)** — Architectural Decision Records (ADRs 01–06), Studio Business Model, and TCO Cost Reduction Audit (~$5/mo vs $250+/mo).
* **[🎨 docs/doc-design.md](./docs/doc-design.md)** — Design System & Visual Specification: OKLCH math, fluid typography, 60/120 FPS compositor physics, and Tailwind v4 CSS tokens.
* **[🌐 docs/doc-loc1n.md](./docs/doc-loc1n.md)** — Global i18n Protocol across 5 languages, native RTL support for Arabic, and omnichannel state synchronization.
* **[📘 docs/doc-user.md](./docs/doc-user.md)** — High-Level User Guide: 3 interaction touchpoints, purchasing UI Kits & Cheatsheets via Fiat (Apple Pay, Cards) and Crypto (Web3 + CEX exchanges).
* **[🛡️ docs/doc-validation.md](./docs/doc-validation.md)** — Quality Assurance & Validation Standard: Playwright E2E specs, SPOF matrix, k6 load testing, React Scan, and Definition of Done (DoD).

---

## 🏗️ Monorepo Architecture (Decoupled Workspace)

```bash
induktr-studio/
├── apps/
│   ├── web/                    # Client SPA (Vite 6 + React 19 + FSD 2.1 + React Scan)
│   └── api/                    # Backend Core (NestJS 11 + Bun + Prisma 7 + GraphQL)
├── packages/
│   ├── contracts/              # Shared GraphQL types, Zod schemas, DTOs
│   └── config/                 # Unified TypeScript, Biome & Tailwind tokens
├── docs/                       # Complete project documentation suite
├── public/                     # Static assets and media
└── docker/                     # Multi-stage Bun Alpine Dockerfile
```

---

## 🚦 Quickstart Runbook

```bash
# 1. Install dependencies via Bun's high-speed package manager
bun install

# 2. Configure environment variables
cp .env.example .env

# 3. Apply PostgreSQL database migrations via Prisma 7
bun run db:migrate

# 4. Start concurrent development environment (Frontend + Backend)
bun run dev
```

---

## 💎 Product Matrix & Monetization Architecture

1. **High-Ticket Custom Engineering ($3,000 – $10,000+):**
   * Autonomous multi-agent AI systems, high-velocity protocol frontends, and mission-critical SaaS platforms.
2. **Digital Assets (Self-Serve Instant Access):**
   * **High-Level Tier ($29):** Production-ready UI Kits, design systems, and boilerplate architectures.
   * **Low-Level Tier ($69):** Deep-tech engineering cheatsheets (V8 engine physics, Zero-Trust Enclaves, prototype security).
   * **Instant Multi-Rail Checkout:** Apple Pay / Google Pay / Credit Cards or Cryptocurrency (Phantom, MetaMask, TON, direct Binance/Bybit transfers).

---

## 📊 Performance & Quality SLA

* **FPS:** `60–120 FPS Locked` (GPU compositor animations, zero dropped frames).
* **Core Web Vitals:** `LCP < 0.8s`, `CLS = 0.000`, `INP < 50ms` (Lighthouse score: `100/100`).
* **API Cold Start:** `< 10ms` powered by the native Bun runtime.
* **Lead Dispatch Latency:** `< 150ms` from client terminal execution to private Telegram broadcast.

---

*Architected & Maintained by Induktr Studio. Lead Architect: Nikita Voitenko.*
