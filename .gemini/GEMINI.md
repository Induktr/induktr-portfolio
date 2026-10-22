# Induktr Studio - Antigravity Agent Context & Engineering Rules

This file is automatically loaded at the beginning of any Antigravity AI session in `induktr-studio`.

## Architectural State & Dual-Horizon Rule
- **Active Codebase:** Next.js App Router in `src/` organized via **Feature-Sliced Design (FSD 2.1)** (`app` -> `widgets` -> `features` -> `entities` -> `shared`).
- **Target Specification:** Decoupled Architecture v2.0 as documented in `docs/` and `README.md`.
- **Database & Data Layer:** Current operational code runs on **Drizzle ORM** (`src/shared/api/database/schemas/schema.ts`). Do NOT break Drizzle schemas or invent non-existent Prisma clients in `src/`!
- **Runtime & Execution:** Use **Bun** (`bun run dev`, `bun run typecheck`).

## Deterministic Execution & Status Engine (IPO-Protocol)
Every pipeline must emit deterministic status without freeform token overhead:
`[IPO:INPUT]` -> `[IPO:PROCESS:k/N]` -> `[IPO:OUTCOME]`

1. **Input Phase:** Validate Zod schemas, props, and DB models before editing files.
2. **Process Phase:** Isolated pure functions, zero `any`, strict FSD top-down unidirectional imports. Dispose Three.js geometries/materials on unmount.
3. **Outcome Phase:** Run `bun run typecheck` (`tsc --noEmit`) to verify zero compiler regressions.

## Documentation References in `/docs`
- Target Blueprint & Topology: `docs/doc-architecture.md`
- Tech Specifications & ADRs 01-06: `docs/doc-tech.md`
- Design Tokens & 60/120 FPS Compositor: `docs/doc-design.md`
- Validation & Definition of Done: `docs/doc-validation.md`
- Localization Protocols: `docs/doc-loc1n.md`
- User Journey & Monetization: `docs/doc-user.md`
