# UI/UX Design System & Guidelines

## 1. Aesthetic Principles & Design Philosophy

`YKS Koçu` follows a modern, high-end, premium web aesthetic designed to captivate students while maintaining functional clarity for intensive study tracking.

- **Vibrant & Tailored Palette**: Curated dark and light mode themes using HSL CSS variables and Tailwind CSS v4.
- **Modern Typography**: Powered by Vercel's `Geist` and `Geist Mono` font families.
- **Glassmorphism & Depth**: Subtle backdrop blur (`backdrop-blur-md`), layered cards, soft border gradients, and elevation shadows.
- **Micro-Animations & Transitions**: Dynamic hover effects, subtle state transitions, and smooth tab switching.

---

## 2. Color Palette & Theme Tokens

### Light Theme
- **Background**: `#F8FAFC` (Slate 50)
- **Card Background**: `#FFFFFF` (White)
- **Foreground / Text**: `#0F172A` (Slate 900)
- **Muted Text**: `#64748B` (Slate 500)
- **Primary Accent**: `#2563EB` (Blue 600) / `#3B82F6` (Blue 500)
- **Success Accent**: `#16A34A` (Green 600)
- **Warning Accent**: `#D97706` (Amber 600)
- **Border Color**: `#E2E8F0` (Slate 200)

### Dark Theme
- **Background**: `#090D16` (Deep Charcoal)
- **Card Background**: `#111827` (Gray 900) with `backdrop-filter`
- **Foreground / Text**: `#F8FAFC` (Slate 50)
- **Muted Text**: `#94A3B8` (Slate 400)
- **Primary Accent**: `#3B82F6` (Blue 500) / `#60A5FA` (Blue 400)
- **Success Accent**: `#22C55E` (Green 500)
- **Warning Accent**: `#F59E0B` (Amber 500)
- **Border Color**: `#1E293B` (Slate 800)

---

## 3. Component Design Standards

### Buttons
- Primary: `bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-blue-500/20 active:scale-[0.98]`
- Secondary: `bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-medium px-4 py-2.5 rounded-xl transition-all`
- Destructive: `bg-rose-600 hover:bg-rose-700 text-white font-medium px-4 py-2.5 rounded-xl transition-all`

### Input Fields & Select Dropdowns
- `w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`

### Cards & Container Elements
- `bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm backdrop-blur-xl transition-all`

---

## 4. Accessibility & Form Guidelines

- **Semantic HTML**: Mandatory usage of `<main>`, `<header>`, `<nav>`, `<aside>`, `<section>`, `<article>`, `<button>`, and `<label>`.
- **Keyboard Navigation**: Clear `:focus-visible` outlines on all interactive elements.
- **Form Inputs**: Every input must be accompanied by an explicit label and placeholder example.
- **Responsive Layouts**: Desktop multi-column grid layouts collapse gracefully to single-column flex layouts on mobile devices (`sm:`, `md:`, `lg:` breakpoints).
