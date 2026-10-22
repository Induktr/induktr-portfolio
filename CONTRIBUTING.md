# Contributing to Induktr Studio

Welcome to **Induktr Studio**! Whether you are a human systems engineer, tech lead, or an autonomous AI agent, please follow our canonical engineering standards to maintain architectural purity and zero technical debt.

---

## 1. Architectural Horizons: Active Workspace vs Target v2.0
- **Active Operational Codebase (`src/`):** Next.js App Router organized under **Feature-Sliced Design (FSD 2.1)**. Data layer powered by **Drizzle ORM** (`src/shared/api/database/schemas/schema.ts`).
- **Target Architecture Specification (v2.0):** Documented in [`README.md`](README.md) and [`docs/`](docs/) (Decoupled microservices, Vite + React 19, NestJS on Bun, Prisma 7).
- *Engineering Guideline:* All daily development, bug fixes, and feature additions happen within the active `src/` codebase without breaking existing Drizzle models or FSD slice boundaries.

---

## 2. Quickstart Runbook

```bash
# 1. Install dependencies via Bun (or npm)
bun install

# 2. Configure environment variables
cp .env.example .env

# 3. Start development server
bun run dev

# 4. Typecheck & Verification Gate (Must pass with 0 errors)
bun run typecheck
bun run lint

# 5. Telegram Bot Polling Worker
bun run bot:poll
```

---

## 3. Engineering Invariants & Quality Standards

1. **Feature-Sliced Design (FSD 2.1):** Strict unidirectional imports (`app` -> `widgets` -> `features` -> `entities` -> `shared`). Cross-imports on the same layer are strictly banned.
2. **60/120 FPS Compositor:** Sub-16.6ms frame budget, GPU compositor animations only (`transform`, `opacity`), zero layout thrashing.
3. **Database & API Boundaries:** Database mutations through Drizzle ORM remain on the server side (Server Components, Server Actions, or API routes). Direct DB queries in `'use client'` components are prohibited.
4. **Three.js Hygiene:** Dispose all WebGL geometries and materials on unmount to prevent memory leaks.

---

## 4. Complete Canonical Documentation Suite (`/docs`)

- 🏛️ [System Architecture Blueprint (`docs/doc-architecture.md`)](docs/doc-architecture.md)
- ⚙️ [Technical Specification & ADRs 01–06 (`docs/doc-tech.md`)](docs/doc-tech.md)
- 🎨 [Design System & OKLCH Specifications (`docs/doc-design.md`)](docs/doc-design.md)
- 🌐 [Global i18n & RTL Localization Protocol (`docs/doc-loc1n.md`)](docs/doc-loc1n.md)
- 🛡️ [Quality Assurance, Validation & SPOF Resilience (`docs/doc-validation.md`)](docs/doc-validation.md)
- 📘 [Official User Guide & Multi-Rail Monetization (`docs/doc-user.md`)](docs/doc-user.md)
