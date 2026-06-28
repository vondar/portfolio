# 🌐 AESTHETICS // Adaptive UI/UX Portfolio Website

An immersive, futuristic digital canvas bridging the gap between ambient AI personalization, interactive spatial design, and radical accessibility. Built with **Next.js 15+ App Router**, **TypeScript**, **Tailwind CSS v4**, and **Zustand**.

---

## 🧭 Project Architecture & Capabilities

This portfolio website implements a **forensic and adaptive approach** to digital storytelling. Instead of presenting static information, the interface adapts in real-time to the context, role, and requirements of the visitor.

### 1. Adaptive Persona Profiles
The application curates copy, metrics, and case studies depending on the selected persona:
- **General (`G`)**: Balance of business impact and clean UI. Focuses on overall project value and high-level deliverables.
- **Designer (`D`)**: Visual focus detailing spatial compositions, color physics, typography scales, and user experience.
- **Developer (`E`)**: System architecture focus emphasizing database schemas, background workers, performance latency, and code execution times.

*Shortcut:* Switch roles instantly using keyboard quantum links (`G`, `D`, `E`).

### 2. Radical Accessibility Overlay (`A`)
Designed beyond standard compliance constraints to provide a neurodiverse and high-fidelity custom access matrix:
- **Dyslexia-friendly Type**: Swaps standard typefaces to heavy-bottom glyph representations (`Comic Neue`/`Comic Sans` fallbacks) with custom line-height and letter-spacing calculations.
- **Motion Scaling**: Disables heavy CSS transitions and animations globally when toggled.
- **Contrast Booster**: Reinforces element boundaries with stark border outlines for low-vision support.
- **Cognitive Focus Mode**: Simplifies structural layouts, removing visual background grids, scanlines, and diagnostic loops.

### 3. Ambient Design Tokens
- **Themes**: Supports multiple interfaces including Cyberpunk (neon gradients, scanlines, dark violet), Minimal (monochrome, high-whitespace), Classic Dark, and Classic Light.
- **Telemetry Board**: Real-time system monitoring panel logging active state configurations, theme metrics, and user preferences.

---

## 🎨 UI/UX Design System

### Color Architecture
All colors are driven by a CSS variable cascade (`--bg-primary`, `--accent`, `--accent-pink`, etc.), allowing complete theme swaps at zero runtime cost. Tailwind CSS v4's `@theme` directive re-maps these tokens into utility classes (`bg-bg-primary`, `text-accent`, etc.) for maximum consistency.

| Token | Cyberpunk | Minimal | Dark | Light |
|---|---|---|---|---|
| `--bg-primary` | `#080411` | `#fafaf9` | `#0b0f19` | `#f9fafb` |
| `--accent` | `#00f3ff` (neon cyan) | `#1c1917` | `#3b82f6` (blue) | `#2563eb` |
| `--accent-pink` | `#ff007f` | `#78716c` | `#ec4899` | `#db2777` |

The Cyberpunk theme adds a **scanline CRT overlay** and an ambient `cyan/3%` CSS grid via a `background-image` gradient to simulate depth in the background layer.

### Typography
- **Primary Typeface**: Geist Sans (variable, from `next/font/google`) — geometric, modern, and optically balanced.
- **Monospaced**: Geist Mono — used for telemetry labels, keyboard shortcut indicators (`<kbd>`), and code blocks.
- **Dyslexia Mode Fallback Stack**: `Comic Neue → Comic Sans MS → cursive` with `letter-spacing: 0.08em` and `word-spacing: 0.12em` overrides.
- Font variables are set at the `<html>` root (`--font-geist-sans`, `--font-geist-mono`) and consumed globally via `body { font-family: var(--font-geist-sans) }`.

### Spacing & Layout
- **12-Column Responsive Grid** on the hero section (`lg:grid-cols-12`) collapses to a single-column stack on mobile.
- **Max-width containers** constrained at `max-w-7xl` with `px-6 sm:px-8` responsive horizontal padding.
- **Vertical rhythm** is managed through Tailwind spacing utilities; section separators use `border-t border-border-color/50` to maintain subtle visual hierarchy.

### Motion & Micro-Interactions
All animations follow a **progressive enhancement** model, respecting the `motion-reduced` state class:

| Interaction | Default behavior | Reduced-motion behavior |
|---|---|---|
| Role switcher active pill | `bg-accent` color swap + `shadow-[0_0_12px_var(--accent-glow)]` | Color swap only |
| Project card hover | `-translate-y-1` lift + border glow | Border color change only |
| Navbar icon hover | `rotate-45` and `scale-110` transforms | Opacity transition only |
| `<Radio>` pulse indicator | `animate-pulse` Tailwind animation | Static icon |
| Theme/a11y transitions | `transition-colors duration-300` on `body` | `transition-duration: 0s` forced by `.motion-reduced *` |

### Component Patterns

**Glassmorphism Cards:**  
Project cards and the telemetry board use `bg-bg-secondary/40 backdrop-blur-md` to create frosted-glass depth. Border highlighting (`hover:border-accent/40`) signals interactivity without heavy shadows.

**Glow Effects:**  
Accent highlights use `box-shadow` with CSS variable colors: `shadow-[0_0_15px_var(--accent-glow)]`. The glow color automatically adapts per theme.

**Terminal Aesthetic:**  
Labels and diagnostic data use `font-mono`, uppercase tracking, and `//` separator idioms (e.g. `SYSTEM_SYS // AESTHETIC_CORE`) to reinforce the futuristic command-line visual language.

**Keyboard Shortcut Badges:**  
`<kbd>` elements are styled with `bg-bg-secondary border border-border-color rounded px-1.5 py-0.5 text-[10px]` to look like physical keycaps, directly reinforcing the shortcut discovery experience.

### Accessibility Compliance
- All interactive elements carry descriptive `aria-label` attributes.
- Focus states are inherited from Tailwind's default `ring` utilities.
- Modal and panel components implement click-outside and `Escape` key dismissal.
- Color contrast targets WCAG 2.2 AA baseline across all themes, with the High Contrast overlay boosting to AAA-equivalent ratios.
- Cognitive focus mode hides all decorative layers (`.cognitive-decor`) using `display: none` targeted by the `.cognitive-focus .cognitive-decor` CSS rule.

---

## 🛠️ Project Stack

- **Framework**: Next.js 15.2+ (App Router, Turbopack)
- **State Management**: Zustand (Client-side sync engine)
- **Styling**: Tailwind CSS v4 (Pure CSS-driven variables, `@theme` directives)
- **Icons**: Lucide React
- **Package Manager**: NPM / UV

---

## 📁 Directory Layout

```text
portfolio/
├── .vscode/               # Workspace settings (Tailwind v4 lint override)
├── src/
│   ├── app/
│   │   ├── globals.css    # Core design tokens, theme vars & accessibility classes
│   │   ├── layout.tsx     # SSR SEO headers and layout wrappers
│   │   └── page.tsx       # Dynamic Adaptive Hero & Curated Project index
│   ├── components/
│   │   ├── AppShell.tsx   # Shell coordinating client hooks & background states
│   │   ├── Navbar.tsx     # Responsive brand bar & interactive role selectors
│   │   ├── ProjectModal.tsx # Multi-tab specifications drawer
│   │   └── ThemeProvider.tsx # Class injector mapping state to HTML attributes
│   ├── data/
│   │   └── projects.ts    # Central registry of actual projects data
│   └── hooks/
│       └── useKeyboardShortcuts.ts # Hotkey listener hook (D/E/G/A)
├── PLAN.md                # Roadmap specification
└── README.md              # The System Manual
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js v24+
- NPM v11+

### Installation

1. Clone and enter the directory:
   ```bash
   git clone <repository-url>
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) inside your browser.

---

## 📊 Live Verification

Compile the optimized static build to verify typescript validity and edge deployment budgets:
```bash
npm run build
```
Expected output:
```text
✓ Compiled successfully in 3.0s
Running TypeScript ...
Finished TypeScript in 2.2s ...
Generating static pages ...
✓ Generating static pages using 5 workers (4/4) in 465ms
Finalizing page optimization ...
```
