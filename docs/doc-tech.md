# ⚙️ Technical Specification & Architectural Decisions (doc-tech.md v2.0)

> **Document Status:** Canon / Technical Architecture & Economic Specification  
> **Lead Architect:** Nikita Voitenko (Induktr Studio)  
> **Status:** `Approved & In Execution` | **Target TCO:** `~$0–$5 / month (99% Infrastructure Savings)`  
> **Performance Targets:** `60 FPS UI (<16.6ms) / <10ms Cold-Start / Zero-RSC Overhead / 100% Type-Safe`  

---

## 🎯 1. Root Cause & Strategic Architecture Context

In version v1.0, the digital platform accomplished its primary initial goal: establishing the first lead generation pipeline (The Lead Machine). However, scaling past the prototype revealed standard industrial traps inherent in modern fullstack web development:

1. **The "Next.js / Vercel Monolith" Dictate:** Bloated runtime size, unpredictable hydration delays from React Server Components (RSC), complex App Router caching bugs, and financial vendor lock-in to Vercel's infrastructure (where high-bandwidth spikes lead to steep enterprise bills).
2. **Data Fragmentation & Manual Support:** The lack of a unified digital identity between Telegram and web visitors forced manual file sharing for purchases and status tracking.
3. **The "Complexity Tax":** Loosely-typed REST endpoints and edge-case bugs consumed valuable founder attention, burning high-signal cognitive bandwidth on debugging routine issues.

**The v2.0 Architectural Answer:** Complete decoupling of the platform into independent microservice boundaries, transitioning to modern 2026 high-velocity standards, and engineering an autonomous digital asset engine with near-zero operating costs.

---

## 🛠️ 2. Architectural Decision Records (ADRs): What, How, Why & Trade-offs

### ADR-01: Monolith Decoupling ➔ Vite+ SPA (Client) + NestJS (Backend)
* **Decision:** Split the codebase into two isolated workspaces managed under Bun: `apps/web` (Frontend) and `apps/api` (Backend).
* **Why Drop Next.js RSC:** Server-side rendering in Next.js imposes high cold-start penalties, introduces frame-rendering hitches, and couples the deployment to Vercel.
* **Implementation:** The client is built on clean **Vite 6 + React 19** with **Feature-Sliced Design (FSD 2.1)**, compiled into ultra-lightweight static assets hosted on Cloudflare Pages (Global Anycast Edge CDN).
* **Business Objective:** Sub-15ms TTFB, 0ms perceived UI latency, and total independence from server-side frontend hosting costs ($0/month).

---

### ADR-02: Backend Runtime Migration from Node.js ➔ Bun
* **Decision:** Run all backend services exclusively on the **Bun** runtime.
* **Why Drop Node.js:** Node.js exhibits slower disk and network I/O, requires bulky intermediate transpilations (`ts-node`, `tsx`), and consumes 2.5–3x more RAM.
* **Implementation:** The backend executes natively via `bun run main.ts`. Native TypeScript support, instant package installation, and a microsecond HTTP engine.
* **Business Objective:** Sub-10ms server cold start and the capacity to handle thousands of concurrent connections on a single low-spec $5/mo VPS.

---

### ADR-03: Framework Evolution from Express ➔ NestJS (Enterprise Core)
* **Decision:** Transition from unorganized Express scripts to the modular architecture of **NestJS 11+**.
* **Why Drop Express:** Express lacks architectural boundaries, leading to unmaintainable route sprawl and inconsistent middleware.
* **Implementation:** Clear module boundaries (`LeadModule`, `AuthModule`, `TelegramModule`, `PrismaModule`), Dependency Injection (DI), and automatic request payload sterilization via `ValidationPipe` and custom Guards.
* **Business Objective:** 100% predictable codebase. New developers or AI agents can attach modules in minutes without destabilizing existing subsystems.

---

### ADR-04: ORM Modernization from Drizzle ➔ Prisma 7
* **Decision:** Standardize on **Prisma 7** over PostgreSQL as the single source of truth.
* **Why Prisma 7:** Prisma 7 overhauled its query engine with optimized WebAssembly/C++ drivers, eliminating historical memory latency while offering best-in-class declarative schema migrations, type generation, and ACID transaction safety.
* **Implementation:** Centralized `schema.prisma` defining relational integrity across `User`, `Product`, `Purchase`, and `CustomOrder` models.
* **Business Objective:** Total protection against data corruption or schema drift during product releases.

---

### ADR-05: Protocol Replacement from REST API ➔ GraphQL Code-First API
* **Decision:** Sunset multiple custom REST endpoints in favor of a single typed **GraphQL** gateway via NestJS.
* **Why Drop REST:** REST causes **Over-fetching** (wasting client bandwidth) or **Under-fetching** (requiring 3–4 cascading requests to assemble user dashboards).
* **Implementation:** Code-First schema generation: `schema.gql` is automatically compiled from TypeScript DTO classes. Clients (urql/Apollo) request strictly the exact fields rendered on screen.
* **Business Objective:** Minimal network payload over mobile networks and instant client-side data resolution.

---

### ADR-06: Adoption of React Scan & OKLCH Design Tokens
* **Decision:** Integrate the **React Scan** profiler into development cycles and ground the visual palette in **OKLCH**.
* **Why:** Traditional sRGB CSS produces muddy gray shifts in dark themes, and unmonitored React re-renders drop frame rates below 60 FPS on mobile hardware.
* **Implementation:** React Scan highlights any component re-rendering without prop mutations. Color tokens are specified in `oklch(L C H)` adhering to APCA contrast formulas.
* **Business Objective:** Establishing world-class studio status. The platform operates with the fluidity of a desktop workstation application.

---

## 🌐 3. Omnichannel Architecture: Web ⟷ Telegram Synchronization

The flagship operational capability of v2.0 is a **Single Customer Profile**, removing all friction between the web platform and the Telegram messenger:

```
[Web Client Session]                                [Telegram User]
         │                                                 │
         ▼ (Telegram Login Widget / JWT)                   ▼ (Telegram Mini App: HMAC-SHA256 initData)
┌─────────────────────────────────────────────────────────────────┐
│                     NestJS Gateway & Auth Guard                 │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼ (Unified User Context)
┌─────────────────────────────────────────────────────────────────┐
│                 Prisma 7 Database (PostgreSQL)                  │
│                                                                 │
│  • User (id, telegramId, email)                                 │
│  • Purchases (High-Level / Low-Level Cheatsheets, UI Kits)      │
│  • CustomOrders (Development Status, Milestones, Receipts)      │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
      [Instant Mirrored State on Both Web and Telegram Platforms]
```

* **Zero-Password Authentication:** Direct cryptographic validation via Telegram eliminates passwords, email verification links, and login friction, boosting conversion rates by 2–3x.
* **Instant Asset Access:** Once a client purchases an engineering cheatsheet on the website, it is immediately accessible inside their Telegram Mini App on the go, and vice versa.

---

## 📈 4. Studio Business Model & Monetization Architecture

How technical architecture directly generates business leverage:

1. **High-Ticket Engineering Authority ($3,000 – $10,000+):**
   * Premium clients seek verified technical excellence. Public 60 FPS benchmarks, NestJS/Bun runtime velocity, and instant latency serve as unquestionable **Proof of Work**.
2. **Two-Tier Knowledge Monetization (Digital Products):**
   * **High-Level Tier ($29):** Accessible UI Kits and modular design systems for indie hackers and startups.
   * **Low-Level Tier ($69):** Deep-tech architectural cheatsheets (V8 engine physics, Zero-Trust Enclaves, hardware memory models).
   * Fully automated delivery with zero manual overhead.
3. **Autonomous Lead Qualification (Archy Negotiator):**
   * The interactive terminal captures budget and requirements, formatting an actionable proposal card dispatched to Induktr Studio's private Telegram within $<150$ ms.

---

## 💰 5. Infrastructure Economics: Total Cost of Ownership (TCO) Reduction

Comparing traditional fullstack agency costs against the Induktr Studio v2.0 architecture:

| Expense Category | Traditional Stack (Next.js + Vercel + SaaS) | Induktr Studio v2.0 (Vite + Bun + Edge) | Economic Leverage |
| :--- | :--- | :--- | :--- |
| **Frontend Hosting** | Vercel Pro: **$20/mo + bandwidth charges** | Cloudflare Pages: **$0.00 / mo (Unmetered)** | **-100% cost** on static delivery |
| **Backend Compute** | Serverless Functions: **$30–$80/mo** | 1x Dedicated VPS (Bun): **$4–$5 / mo** | **-85% cost** on compute |
| **Authentication** | Auth0 / Clerk: **$25–$99/mo** after 10k MAU | Native Telegram HMAC + JWT: **$0.00 / mo** | **-100% cost** on identity providers |
| **Database** | Managed DB with enterprise markup: **$25–$50/mo** | Supabase / Self-hosted Postgres: **$0–$10/mo** | **-70% cost** on data tier |
| **Notifications & SMS**| Twilio / SendGrid: **$15–$40/mo** | Telegram Bot API: **$0.00 / mo** | **-100% cost** on notification egress |
| **TOTAL TCO** | **~$110 – $289+ / mo (~$2,500/year)** | **~$4 – $15 / mo (~$100/year)** | **>$2,400+ Annual Savings** |

### ⏳ Time Dividend (Zero-Tech-Debt Dividend):
* **-15 hours/month** saved on server restarts, cold-start diagnosis, and Next.js caching edge cases.
* **-10 hours/month** saved on manual file delivery to clients.
* Reclaimed focus is redirected entirely to high-ticket client delivery, client relations, and core IP development.

---

## 🏁 6. Conclusion & Architectural Verdict

**Induktr Studio v2.0** proves an immutable law of software engineering: **clean architecture is fundamentally cheaper than fragile architecture**.  
By decoupling the client, adopting Bun, structuring NestJS modules, and implementing omnichannel Telegram integration, the studio achieves an optimal balance: **world-class speed for users at near-zero infrastructure cost for the business.**
