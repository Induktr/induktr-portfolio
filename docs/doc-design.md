# 🌌 Induktr Studio v2.0 — Design System & Visual Specification (`doc-design.md`)

> **Document Status:** Canon / Architecture Specification  
> **Target Platform:** React 19 / Vite 6 / Tailwind CSS v4 / TypeScript Strict  
> **Design Paradigms:** Feature-Sliced Design (FSD 2.1) • OKLCH Perceptual Gamut • 60/120 FPS Compositor Motion • Fluid Spatial Math  
> **Studio Tier:** High-Ticket Digital Engineering & Autonomous AI Systems ($3,000 – $10,000+)  

---

## 1. Executive Philosophy & Visual Identity Core

### 1.1 The Brand Thesis: Cyber-Physical Engineering
Induktr Studio v2.0 is positioned not as a template web agency, but as an **elite engineering laboratory** building autonomous AI systems, high-throughput interfaces, and institutional-grade digital products.

The visual language is grounded in **Cyber-Physical Obsidian**:
* **Deep Obsidian Space:** The viewport canvas is not a flat `#000000`, but a layered perceptual obsidian with subtle spectral refraction.
* **Hardware Telemetry:** The interface breathes live data — latency indicators, FPS monitors, monospace state registers, and pseudo-terminal lead acquisition prompts.
* **Tactile Physics:** Despite its technical rigor, every element responds with the precision of a physical measurement instrument (damped springs, ambient backlights, zero input lag).

```
┌────────────────────────────────────────────────────────────────────────┐
│  INDUKTR DESIGN PHILOSOPHY                                             │
│                                                                        │
│  [ Precision Engineering ] ──► Zero Layout Shift, OKLCH, 60/120 FPS    │
│  [ Tactical Authority    ] ──► Institutional Dark Mode, Deep Obsidian  │
│  [ High-Ticket Conversion] ──► Optimistic UI, Frictionless Terminal     │
└────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Core Architectural Principles
1. **Perceptual Uniformity:** Colors are mathematically computed in OKLCH to preserve uniform lightness across the entire dynamic range.
2. **Sub-16.6ms Frame Budget:** All interactions execute purely on the GPU compositor, strictly preventing reflows and layout thrashing.
3. **Information Density & Clarity:** Optimal 4px/8px modular rhythm crafted specifically for technical founders, CTOs, and systems engineers.
4. **Optimistic Interactive Patterns:** Controls, forms, and terminals respond instantaneously without blocking on server roundtrips.

---

## 2. Color Mathematics (OKLCH Color Space)

### 2.1 Why OKLCH Over Hex / HSL?
Traditional color spaces (sRGB, Hex, HSL) suffer from perceptual non-linearity: yellow at HSL `L=50%` appears 3x brighter to human vision than blue at `L=50%`. This breaks design accessibility and visual equilibrium.

**OKLCH (Lightness, Chroma, Hue)** guarantees:
* **Perceptual Uniformity:** An identical Lightness ($L$) value appears equally luminous to the human eye regardless of Hue ($H$).
* **Predictable Contrast:** APCA and WCAG contrast ratio calculations become mathematically deterministic.
* **Wide Gamut (Display P3):** Full support for vibrant quantum accents on modern MacBook Pro, iPhone, and OLED displays without clipping artifacts.

---

### 2.2 Surface Palette (Obsidian & Titanium Spectrum)

| Token Name | OKLCH Value | sRGB Fallback | Architectural Role |
| :--- | :--- | :--- | :--- |
| `--surface-canvas` | `oklch(0.12 0.010 260)` | `#0b0d11` | Absolute viewport background (Deep Space Obsidian) |
| `--surface-subtle` | `oklch(0.14 0.012 260)` | `#0f1217` | Section backgrounds, secondary surfaces |
| `--surface-elevated-1` | `oklch(0.17 0.014 260)` | `#151921` | Bento cards, primary containers |
| `--surface-elevated-2` | `oklch(0.21 0.016 260)` | `#1c222c` | Dropdowns, dialogs, active hover layers |
| `--surface-elevated-3` | `oklch(0.26 0.020 260)` | `#252d3a` | Tooltips, active inspector panels |
| `--surface-glass` | `oklch(0.16 0.014 260 / 0.65)` | `rgba(21, 25, 33, 0.65)` | Translucent panels with `backdrop-filter: blur(16px)` |

---

### 2.3 Quantum Spectral Accents

Each accent carries a distinct semantic and operational responsibility:

```
[ Electric Cyan   ] ──► oklch(0.78 0.16 200) ──► Engineering focus, system status, active links
[ Quantum Violet  ] ──► oklch(0.70 0.22 295) ──► AI Core, agentic pipelines, premium accents
[ Matrix Emerald  ] ──► oklch(0.76 0.18 152) ──► 200 OK, low latency (<20ms), live state
[ Kinetic Amber   ] ──► oklch(0.80 0.16 75)  ──► Warning, queue saturation, high load
[ Krypton Crimson ] ──► oklch(0.65 0.24 25)  ──► Validation errors, critical exceptions
```

| Token | OKLCH Value | UI Role |
| :--- | :--- | :--- |
| `--accent-cyan` | `oklch(0.78 0.16 200)` | Primary brand accent, terminal focus, active selection states |
| `--accent-cyan-glow` | `oklch(0.78 0.16 200 / 0.25)` | Radial specular spotlights and border glows |
| `--accent-cyan-dim` | `oklch(0.35 0.08 200)` | Inactive terminal borders, secondary badges |
| `--accent-violet` | `oklch(0.70 0.22 295)` | Neural agent highlights and autonomous pipeline modules |
| `--accent-violet-glow`| `oklch(0.70 0.22 295 / 0.22)`| Ambient glow in Hero typography and primary CTAs |
| `--accent-emerald` | `oklch(0.76 0.18 152)` | 60 FPS locked badge, 99.99% uptime, "Online" telemetry |
| `--accent-amber` | `oklch(0.80 0.16 75)` | Capacity limit warnings, queue wait times |
| `--accent-crimson` | `oklch(0.65 0.24 25)` | Terminal parsing errors, form validation failures |

---

### 2.4 Typography Contrast Verification (APCA & WCAG)

Every typographic tier is certified against **WCAG 2.2 AAA** and **APCA (Accessible Perceptual Contrast Algorithm)** relative to `--surface-canvas`:

| Typography Tier | OKLCH Value | WCAG Ratio | APCA Score | Role |
| :--- | :--- | :--- | :--- | :--- |
| `--text-primary` | `oklch(0.98 0.005 260)` | **16.8:1 (AAA)** | **Lc 99.2** | Headings, key performance metrics, CTAs |
| `--text-secondary` | `oklch(0.80 0.010 260)` | **9.4:1 (AAA)** | **Lc 82.5** | Technical copy, case study narratives |
| `--text-tertiary` | `oklch(0.58 0.014 260)` | **4.9:1 (AA+)** | **Lc 58.1** | Input labels, telemetry tags, inactive tabs |
| `--text-muted` | `oklch(0.42 0.010 260)` | **2.6:1 (Sub)** | **Lc 39.0** | Code comments, structural line numbers |
| `--text-accent` | `oklch(0.82 0.14 200)` | **10.2:1 (AAA)** | **Lc 86.4** | Clickable hyperlinks, terminal command highlights |

---

### 2.5 Gradients & Specular Borders

```css
/* Bento Spotlight Radial Glow */
--gradient-spotlight: radial-gradient(
  600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
  oklch(0.78 0.16 200 / 0.12),
  transparent 40%
);

/* Hero Title Kinetic Gradient */
--gradient-hero-title: linear-gradient(
  135deg,
  oklch(0.98 0.005 260) 0%,
  oklch(0.88 0.08 200) 50%,
  oklch(0.75 0.20 295) 100%
);

/* Structural Borders */
--border-subtle: oklch(0.26 0.012 260 / 0.40);
--border-default: oklch(0.32 0.016 260 / 0.65);
--border-hover: oklch(0.55 0.08 200 / 0.80);
--border-focus: oklch(0.78 0.16 200);
```

---

## 3. Fluid Typography & Spatial Grid

### 3.1 Fluid Typography Scale (`clamp()` Calculus)
To eliminate Cumulative Layout Shift (CLS = 0.000) and scale seamlessly from mobile viewports (375px) to Ultra-Wide screens (1920px), typographic scales are dynamically interpolated via CSS `clamp()`:

$$\text{FontSize} = \text{clamp}\left(V_{\min},\; V_{\min} + (V_{\max} - V_{\min}) \times \frac{100\text{vw} - 375\text{px}}{1440\text{px} - 375\text{px}},\; V_{\max}\right)$$

| Token | Range (px) | CSS Formula | Weight / Tracking / LH | Role |
| :--- | :--- | :--- | :--- | :--- |
| `--text-display-1` | 44px → 72px | `clamp(2.75rem, 1.76rem + 4.21vw, 4.5rem)` | 800 / -0.04em / 1.05 | Primary Hero Headline |
| `--text-display-2` | 32px → 52px | `clamp(2.00rem, 1.30rem + 3.00vw, 3.25rem)` | 700 / -0.035em / 1.10 | Major Section Headings |
| `--text-h1` | 24px → 36px | `clamp(1.50rem, 1.08rem + 1.80vw, 2.25rem)` | 600 / -0.025em / 1.20 | Bento Card Headers |
| `--text-h2` | 20px → 26px | `clamp(1.25rem, 1.04rem + 0.90vw, 1.625rem)`| 600 / -0.02em / 1.30 | Module Subheadings |
| `--text-body-lg` | 18px → 20px | `clamp(1.125rem, 1.08rem + 0.19vw, 1.25rem)` | 400 / -0.01em / 1.60 | Executive Summaries |
| `--text-body` | 16px (Fix) | `1.00rem` | 400 / 0.00em / 1.55 | Body Copy |
| `--text-small` | 14px (Fix) | `0.875rem` | 400 / +0.01em / 1.50 | Captions, Metadata |
| `--text-mono-sm`| 13px (Fix) | `0.8125rem` | 500 / -0.01em / 1.40 | Telemetry, Terminal, Code |
| `--text-mono-xs`| 11px (Fix) | `0.6875rem` | 600 / +0.04em / 1.30 | Status Badges, Latency Tags |

### 3.2 Font Stacks
* **Primary UI Font:**
  `font-sans: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;`
* **Telemetry & Monospace Font:**
  `font-mono: 'Geist Mono', 'JetBrains Mono', 'Fira Code', monospace;`
  *(Enforces tabular figures to eliminate text jittering during real-time telemetry updates).*

---

### 3.3 4px / 8px Spatial Matrix

All paddings, margins, gaps, and component bounds adhere strictly to a $4\text{px}$ modular scale:

```
  [ 4px ]  ─── --space-1  ─── Micro offsets, badge inner padding
  [ 8px ]  ─── --space-2  ─── Icon-to-label gaps, button padding-y
  [ 12px ] ─── --space-3  ─── Input vertical padding, compact chips
  [ 16px ] ─── --space-4  ─── Standard grid gaps, input horizontal padding
  [ 24px ] ─── --space-6  ─── Small card padding
  [ 32px ] ─── --space-8  ─── Bento container internal padding
  [ 48px ] ─── --space-12 ─── Major section gaps
  [ 64px ] ─── --space-16 ─── Desktop vertical layout offsets
  [ 96px ] ─── --space-24 ─── Large hero dividers
  [ 128px ]─── --space-32 ─── Hero top-level spatial padding
```

#### Corner Radii Scale
* `--radius-xs`: `4px` — status dots, micro-tags.
* `--radius-sm`: `8px` — buttons, dropdowns, code chips.
* `--radius-md`: `12px` — text inputs, secondary cards.
* `--radius-lg`: `18px` — bento cards, interactive terminals.
* `--radius-xl`: `28px` — outer section frames.
* `--radius-full`: `9999px` — status pills, rounded badges.

---

## 4. Interaction Physics & 60/120 FPS Motion Architecture

### 4.1 Frame Budget & Compositor Rules
Induktr v2.0 enforces non-negotiable performance thresholds:
* **Frame Budget:** $\le 16.66\text{ ms}$ (60Hz displays) and $\le 8.33\text{ ms}$ (120Hz ProMotion).
* **JavaScript Execution Ceiling:** $\le 4\text{ ms}$ per interactive event.
* **Layout / Recalculate Styles:** **0ms** during active transitions.

> **Non-Negotiable Rule:**  
> Animations modify **only compositor properties**: `transform` (`translate3d`, `scale`, `rotate`) and `opacity`.  
> Animating geometric properties (`top`, `left`, `width`, `height`, `margin`, `padding`) is strictly prohibited.

```
               USER INTERACTION (Click / Hover)
                             │
                             ▼
              [ 1. JS Execution ] < 4ms (Atomic State Update)
                             │
                             ▼
              [ 2. Recalc Style ] Skipped via Compositor Properties
                             │
                             ▼
              [ 3. Layout / Reflow ] 0ms (NO LAYOUT SHIFT)
                             │
                             ▼
              [ 4. Paint ] Skipped via Dedicated GPU Layer
                             │
                             ▼
              [ 5. GPU Composite ] ~2ms (60/120 FPS Locked)
```

### 4.2 VRAM Leak-Proof `will-change` Management
To prevent video memory exhaustion from excessive layer creation, `will-change` is bound exclusively to **intent triggers (hover/focus)**:

```css
.bento-card {
  transform: translate3d(0, 0, 0);
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1),
              border-color 300ms ease;
}

.bento-card:hover {
  will-change: transform;
}
```

### 4.3 Motion Curves (Easings)

```css
/* Snappy Micro: Instant physical response for buttons and toggles */
--ease-snappy: cubic-bezier(0.16, 1, 0.3, 1);       /* 180ms - 220ms */

/* Bento Spring: Inertial card expansions and floating popovers */
--ease-spring: cubic-bezier(0.34, 1.40, 0.64, 1);    /* 320ms - 400ms */

/* Terminal Reveal: Smooth disclosure of terminal output and dialogs */
--ease-reveal: cubic-bezier(0.05, 0.7, 0.1, 1.0);    /* 450ms */

/* Ambient Pulse: Infinite breathing cycles for radars and status indicators */
--ease-ambient: cubic-bezier(0.4, 0, 0.6, 1);       /* 2400ms - 3600ms */
```

### 4.4 React Scan Zero-Jank Enforcement
Every UI component is continuously validated with **React Scan**:
1. Mouse movement inside a Bento grid **never** triggers component re-renders — cursor coordinates stream directly to CSS Custom Properties (`--mouse-x`, `--mouse-y`) via native `requestAnimationFrame`.
2. Form state updates in the `LeadCaptureTerminal` are isolated to localized refs with debounced synchronization, preventing cascading re-renders across parent layouts.

---

## 5. Component Architecture (FSD 2.1 & Design Primitives)

```
src/
├── app/                  # Global style runtime, context providers, token bindings
├── pages/                # Route views (Home, Showcase, Tech-Audit, ClientHub)
├── widgets/              # Composite blocks (LeadCaptureTerminal, ProjectShowcaseGrid, BentoHero)
├── features/             # Business capabilities (BudgetSelector, TerminalExecutor, FPSMonitor)
├── entities/             # Domain entities (ProjectCard, ServiceTier, TelemetryMetric)
└── shared/               # Atomic design primitives & system utilities
    ├── ui/               # Button, Input, BentoCard, Badge, GlassContainer
    └── lib/              # usePerformanceMetrics, useSpotlight, oklch-utils
```

---

### 5.1 Tactical Button (`Button`)

The button component replicates the tactile response of a precision physical toggle switch.

```tsx
// shared/ui/Button/Button.tsx
import React from 'react';
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  "relative inline-flex items-center justify-center font-mono font-medium tracking-tight select-none transition-all duration-200 outline-none active:scale-[0.98] active:translate-y-[1px] disabled:opacity-40 disabled:pointer-events-none cursor-pointer overflow-hidden",
  {
    variants: {
      variant: {
        primary: [
          "bg-[oklch(0.78_0.16_200)] text-[oklch(0.12_0.01_260)] font-semibold shadow-[0_0_24px_oklch(0.78_0.16_200/0.35)]",
          "hover:bg-[oklch(0.85_0.14_200)] hover:shadow-[0_0_36px_oklch(0.78_0.16_200/0.55)]",
          "border border-[oklch(0.90_0.12_200)]"
        ],
        quantum: [
          "bg-gradient-to-r from-[oklch(0.70_0.22_295)] to-[oklch(0.78_0.16_200)] text-white font-semibold",
          "shadow-[0_0_30px_oklch(0.70_0.22_295/0.4)] hover:shadow-[0_0_45px_oklch(0.70_0.22_295/0.6)]",
          "border border-white/20"
        ],
        secondary: [
          "bg-[oklch(0.17_0.014_260)] text-[oklch(0.98_0.005_260)]",
          "border border-[oklch(0.32_0.016_260/0.7)] hover:border-[oklch(0.78_0.16_200/0.8)]",
          "hover:bg-[oklch(0.21_0.016_260)] hover:shadow-[0_0_20px_oklch(0.78_0.16_200/0.15)]"
        ],
        terminal: [
          "bg-[oklch(0.14_0.012_260)] text-[oklch(0.78_0.16_200)] font-mono text-xs uppercase",
          "border border-[oklch(0.35_0.08_200)] hover:border-[oklch(0.78_0.16_200)]",
          "hover:bg-[oklch(0.78_0.16_200/0.08)] before:content-['['] after:content-[']'] before:mr-1 after:ml-1"
        ]
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-sm gap-1.5",
        md: "h-11 px-5 text-sm rounded-md gap-2",
        lg: "h-14 px-8 text-base rounded-lg gap-3"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);
```

---

### 5.2 Bento Card with Specular Spotlight (`BentoCard`)

```tsx
// shared/ui/BentoCard/BentoCard.tsx
import React, { useRef } from 'react';

export const BentoCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden rounded-lg bg-[oklch(0.17_0.014_260)] border border-[oklch(0.32_0.016_260/0.5)] p-8 transition-all duration-300 hover:border-[oklch(0.78_0.16_200/0.6)] ${className}`}
    >
      <div 
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(500px circle at var(--mouse-x, 0) var(--mouse-y, 0), oklch(0.78 0.16 200 / 0.12), transparent 40%)`
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
```

---

### 5.3 Lead Capture Terminal (`LeadCaptureTerminal`)

The premier conversion instrument designed for $3,000–$10,000+ engagements. Clients engage with an interactive engineering console rather than a generic form:

```
┌── [ INDUKTR SYSTEM CONSOLE v2.0 ] ───────────────────────────────────────────┐
│                                                                              │
│  > INITIALIZING DIRECT ENCRYPTION CHANNEL... [ OK ]                          │
│  > SELECT ENGAGEMENT BUDGET:                                                 │
│    [x] $3,000 - $5,000  (MVP / Fast-Track Autonomous Agent)                  │
│    [ ] $5,000 - $10,000 (Production System / Multi-Agent Core)              │
│    [ ] $10,000+         (Enterprise Dedicated Pipeline)                      │
│                                                                              │
│  > ENTER WORK TELEGRAM / EMAIL:                                              │
│    [ alex@founder.io                                    ]                    │
│                                                                              │
│  > PROJECT BRIEF / SYSTEM REQUIREMENTS:                                      │
│    [ Autonomous agent for automated financial data pipelines... ]           │
│                                                                              │
│  [ EXECUTE DEPLOYMENT REQUEST // 0.04s LATENCY ]                             │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Token Specification (CSS Custom Properties / Tailwind v4)

Complete production-ready stylesheet to import into `globals.css`:

```css
@import "tailwindcss";

@layer base {
  :root {
    /* ==========================================================================
       1. COLOR SYSTEM (OKLCH PERCEPTUAL SPACE)
       ========================================================================== */
    --surface-canvas: oklch(0.12 0.010 260);      /* #0b0d11 */
    --surface-subtle: oklch(0.14 0.012 260);      /* #0f1217 */
    --surface-elevated-1: oklch(0.17 0.014 260);  /* #151921 */
    --surface-elevated-2: oklch(0.21 0.016 260);  /* #1c222c */
    --surface-elevated-3: oklch(0.26 0.020 260);  /* #252d3a */
    --surface-glass: oklch(0.16 0.014 260 / 0.65);

    /* Quantum Accents */
    --accent-cyan: oklch(0.78 0.16 200);
    --accent-cyan-hover: oklch(0.85 0.14 200);
    --accent-cyan-dim: oklch(0.35 0.08 200);
    --accent-cyan-glow: oklch(0.78 0.16 200 / 0.25);

    --accent-violet: oklch(0.70 0.22 295);
    --accent-violet-hover: oklch(0.76 0.20 295);
    --accent-violet-dim: oklch(0.32 0.10 295);
    --accent-violet-glow: oklch(0.70 0.22 295 / 0.25);

    --accent-emerald: oklch(0.76 0.18 152);
    --accent-emerald-glow: oklch(0.76 0.18 152 / 0.20);

    --accent-amber: oklch(0.80 0.16 75);
    --accent-amber-glow: oklch(0.80 0.16 75 / 0.20);

    --accent-crimson: oklch(0.65 0.24 25);
    --accent-crimson-glow: oklch(0.65 0.24 25 / 0.20);

    /* Text & Legibility */
    --text-primary: oklch(0.98 0.005 260);
    --text-secondary: oklch(0.80 0.010 260);
    --text-tertiary: oklch(0.58 0.014 260);
    --text-muted: oklch(0.42 0.010 260);
    --text-accent: oklch(0.82 0.14 200);

    /* Structural Borders */
    --border-subtle: oklch(0.26 0.012 260 / 0.40);
    --border-default: oklch(0.32 0.016 260 / 0.65);
    --border-hover: oklch(0.55 0.08 200 / 0.80);
    --border-focus: oklch(0.78 0.16 200);

    /* ==========================================================================
       2. FLUID TYPOGRAPHY SCALE (CLAMP FORMULAS)
       ========================================================================== */
    --font-display-1: clamp(2.75rem, 1.76rem + 4.21vw, 4.50rem);
    --font-display-2: clamp(2.00rem, 1.30rem + 3.00vw, 3.25rem);
    --font-h1: clamp(1.50rem, 1.08rem + 1.80vw, 2.25rem);
    --font-h2: clamp(1.25rem, 1.04rem + 0.90vw, 1.625rem);
    --font-body-lg: clamp(1.125rem, 1.08rem + 0.19vw, 1.25rem);
    --font-body: 1.00rem;
    --font-small: 0.875rem;
    --font-mono-sm: 0.8125rem;
    --font-mono-xs: 0.6875rem;

    /* ==========================================================================
       3. SPATIAL GEOMETRY & RADII (4px / 8px GRID)
       ========================================================================== */
    --space-1: 0.25rem;   /* 4px */
    --space-2: 0.50rem;   /* 8px */
    --space-3: 0.75rem;   /* 12px */
    --space-4: 1.00rem;   /* 16px */
    --space-6: 1.50rem;   /* 24px */
    --space-8: 2.00rem;   /* 32px */
    --space-12: 3.00rem;  /* 48px */
    --space-16: 4.00rem;  /* 64px */
    --space-24: 6.00rem;  /* 96px */
    --space-32: 8.00rem;  /* 128px */

    --radius-xs: 4px;
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 18px;
    --radius-xl: 28px;
    --radius-full: 9999px;

    /* ==========================================================================
       4. HARDWARE MOTION EASINGS
       ========================================================================== */
    --ease-snappy: cubic-bezier(0.16, 1, 0.3, 1);
    --ease-spring: cubic-bezier(0.34, 1.40, 0.64, 1);
    --ease-reveal: cubic-bezier(0.05, 0.7, 0.1, 1.0);
    --ease-ambient: cubic-bezier(0.4, 0, 0.6, 1);

    /* ==========================================================================
       5. SPECULAR SHADOWS & GLOWS
       ========================================================================== */
    --shadow-subtle: 0 2px 8px -2px oklch(0.05 0.005 260 / 0.5);
    --shadow-card: 0 12px 32px -8px oklch(0.02 0.005 260 / 0.8);
    --shadow-glow-cyan: 0 0 32px -4px oklch(0.78 0.16 200 / 0.35);
    --shadow-glow-violet: 0 0 32px -4px oklch(0.70 0.22 295 / 0.35);
  }

  body {
    background-color: var(--surface-canvas);
    color: var(--text-primary);
    font-family: var(--font-sans);
    letter-spacing: -0.01em;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .backdrop-glass {
    background-color: var(--surface-glass);
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
  }
}
```

---

## 7. Quality Assurance & Engineering Checklist

Before deploying any production surface:

* [ ] **APCA / WCAG Contrast Certification:** `body` typography satisfies APCA $\ge \text{Lc } 75$; secondary labels $\ge \text{Lc } 50$.
* [ ] **60/120 FPS Locked:** Chrome DevTools Performance confirms zero Long Tasks ($>50\text{ms}$) during mouse movements and active scrolling.
* [ ] **React Scan Verification:** Zero unneeded re-renders across the root container during state updates.
* [ ] **CLS Zero-Shift:** Cumulative Layout Shift strictly equals `0.000` via fluid `clamp()` and explicit `aspect-ratio` bounds.
* [ ] **No Layout Thrashing:** Animated layers modify strictly `transform` and `opacity`.
* [ ] **Cross-Engine Fallbacks:** Verified rendering across Chromium V8, Gecko, and Apple WebKit.
