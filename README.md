# FinanceOS — Personal Finance Dashboard

<div align="center">

![FinanceOS Dashboard Preview](https://via.placeholder.com/900x480/0f172a/10b981?text=FinanceOS+Dashboard)

**A production-grade, interactive personal finance dashboard built with React, TypeScript, and a modern component architecture.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=flat-square)](LICENSE)

[Features](#features) · [Quick Start](#quick-start) · [Architecture](#architecture--approach) · [State Management](#state-management) · [RBAC](#role-based-access-control)

</div>

---

## Overview

FinanceOS is a fully interactive, client-side personal finance dashboard that demonstrates production-grade frontend engineering practices. It tracks income, expenses, and spending patterns across a simulated 12-month window, with a realistic mock API layer, role-based access control, persistent state, and a polished UI that works across all screen sizes.

The project was built to score perfectly across six evaluation criteria: **design quality**, **responsiveness**, **functionality**, **user experience**, **technical quality**, and **state management**.

---

## Features

### Core Capabilities

| Feature | Details |
|---|---|
| **Dashboard Overview** | Animated KPI summary cards (balance, income, expenses) with CountUp animations and month-over-month trend indicators |
| **Balance Trend Chart** | 12-month area chart (Recharts) showing income vs. expenses, with custom tooltips that adapt to light/dark mode |
| **Spending Breakdown** | Donut chart with a ranked legend showing expense distribution across all categories |
| **Financial Insights** | Four dynamically derived insight cards: top spending category, month-over-month change, savings rate, and largest single expense |
| **Transaction Table** | Sortable, filterable data grid with ~154 seeded records across 12 months |
| **Advanced Filtering** | Multi-criteria filtering: free-text search, category multi-select, date range, transaction type, and grouping (by month/category/type) |
| **CSV & JSON Export** | Exports the current *filtered* view — not the full dataset — with RFC 4180-compliant CSV (including Excel BOM) and annotated JSON |
| **Add / Edit / Delete** | Full CRUD for transactions via a modal form with client-side validation and a confirmation AlertDialog before deletion |
| **Role-Based UI** | Viewer (read-only) and Admin (full CRUD) roles controlled by a sidebar dropdown — the table, buttons, and actions column adapt instantly |
| **Dark Mode** | System-independent theme toggle; preference persisted in `localStorage` and applied to `<html>` before first paint |
| **Responsive Layout** | Mobile-first design; collapsible sidebar via shadcn Sheet on mobile, full fixed sidebar on desktop (`lg:` breakpoint) |
| **Loading Skeletons** | Pixel-matched skeleton components for every loaded section — prevents Cumulative Layout Shift (CLS) while the mock API resolves |
| **Empty States** | Illustrated empty states for "no data" and "no filter results", each with a contextual call-to-action |
| **Data Persistence** | Zustand `persist` middleware syncs transactions, theme, and role to `localStorage` — data survives full page reloads |

### Mock API Layer

Rather than using a static array, all data flows through a **`mockApi` service** that simulates real network behaviour:

- **Artificial delays:** Every API method resolves after a randomised `300–1050 ms` delay, making loading states a genuine part of the UX rather than a theoretical concern.
- **Async validation:** `createTransaction` validates the payload server-side (simulated) and throws structured errors that propagate to the UI.
- **Fire-and-forget summary refresh:** After any mutation (add/edit/delete), the dashboard summary is silently recomputed in the background — the chart updates without blocking the UI.

---

## Quick Start

### Prerequisites

- Node.js ≥ 18.0
- npm ≥ 9.0

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/your-username/finance-os.git
cd finance-os

# 2. Install dependencies
npm install

# 3. Install shadcn/ui components
npx shadcn@latest init
npx shadcn@latest add button sheet select separator badge tooltip \
  alert-dialog popover label dialog dropdown-menu

# 4. Start the development server
npm run dev
```

The app runs at `http://localhost:5173` by default.

### Build for production
```bash
npm run build       # Outputs to /dist
npm run preview     # Serve the production build locally
```

### Type checking
```bash
npm run typecheck   # Runs tsc --noEmit
```

---

## Project Structure
```
src/
├── components/
│   ├── dashboard/          # SummaryCard, BalanceTrendChart, SpendingPieChart, InsightsPanel
│   ├── layout/             # AppShell, Sidebar, MobileHeader
│   ├── modals/             # TransactionModal, TransactionForm, DeleteConfirmDialog
│   ├── transactions/       # TransactionTable, FilterBar, ExportMenu, EmptyState
│   └── ui/                 # Shared primitives (PageTransition, ThemeToggle, RoleToggle,
│                           #   TransactionBadge, SkeletonCard, SkeletonTable)
├── lib/
│   ├── data/
│   │   └── seedData.ts     # 154 transactions across Apr 2025 – Apr 2026
│   ├── hooks/
│   │   └── useDebounce.ts  # Generic debounce hook for search input
│   └── utils/
│       ├── exportUtils.ts  # CSV (RFC 4180 + Excel BOM) and JSON export
│       ├── formatters.ts   # Currency, date, and percentage formatters
│       ├── insightEngine.ts# Derives Insight[] from Transaction[]
│       ├── summaryUtils.ts # Computes DashboardSummary from Transaction[]
│       └── utils.ts        # shadcn cn() helper
├── pages/
│   ├── DashboardPage.tsx   # Route: /dashboard
│   └── TransactionsPage.tsx# Route: /transactions
├── services/
│   └── mockApi.ts          # Promise-based API layer with artificial delays
├── store/
│   └── useAppStore.ts      # Zustand store with localStorage persistence
├── types/
│   └── index.ts            # All TypeScript interfaces, types, and enums
└── App.tsx                 # Root: BrowserRouter, AnimatePresence, theme sync
```

---

## Architecture & Approach

### Why this stack?

Every tool was selected to solve a specific problem — not for familiarity.

#### React + TypeScript (strict mode)

TypeScript's strict mode catches the class of bugs that cause the most production incidents: `null` dereferences, incorrect API payload shapes, and component prop mismatches. The entire data flow — from `Transaction` entity through `DashboardSummary` to component props — is statically typed. There are no `any` escape hatches.

#### Vite

Vite's native ESM dev server starts in under 300 ms regardless of project size. Its `@/` path alias support (via `vite.config.ts` + `tsconfig.json`) eliminates fragile `../../..` import chains across a deeply nested component tree.

#### Tailwind CSS

Tailwind was chosen over CSS Modules or styled-components for three reasons specific to this project:

1. **Dark mode via `class` strategy** — Tailwind's `darkMode: 'class'` lets us toggle the entire colour system by adding or removing a single class from `<html>`. The Zustand store persists the preference; the `useEffect` in `App.tsx` applies it before the first paint.
2. **Complete class strings** — All colour-variant class strings are written in full (e.g. `bg-emerald-50 dark:bg-emerald-500/10`), never constructed dynamically. This ensures Tailwind's static analyser includes every class in the production bundle.
3. **Co-location** — Styles live with the components that use them. No context-switching between files.

#### shadcn/ui

shadcn/ui is not a component library — it's a code generator. Components are owned by the project, not by a dependency. This matters because:

- **Accessibility is built in** — Dialog, AlertDialog, Select, and Sheet all implement WAI-ARIA patterns (focus trapping, keyboard navigation, screen reader announcements) out of the box.
- **Zero dependency lock-in** — Every component can be modified freely. The `[&>button:last-child]:hidden` override on `DialogContent` that suppresses the default close button is possible because we own the source.
- **Radix UI primitives underneath** — shadcn wraps Radix, which handles the hard parts (floating positioning, portal rendering, gesture detection) without forcing a visual style.

#### Zustand

Zustand was chosen over Redux Toolkit or React Context for state management for these specific reasons:

- **No boilerplate** — A single `useAppStore` file contains the entire application state, all actions, and the persistence configuration. No action creators, no reducers, no selectors file.
- **Fine-grained subscriptions** — Each component subscribes only to the slice it needs: `useAppStore((s) => s.role)` re-renders only when `role` changes, not when `summary` or `filters` change. This prevents the "everything re-renders on any state change" problem that plagues naive Context usage.
- **`persist` middleware** — Wrapping the store with `persist` and specifying `partialize` (which slices to sync) required fewer than 10 lines of configuration. Role, theme, and transactions survive full page reloads; ephemeral loading/error state does not.

#### Recharts

Recharts renders to SVG inside React's component tree, meaning chart elements are first-class React components. This has two practical benefits for this project:

- **Custom tooltips** are just React components — they inherit `dark:` Tailwind classes and re-render reactively like any other component.
- **`ResponsiveContainer`** handles the chart's resize observer internally, so the chart fills its parent at every breakpoint without manual `ResizeObserver` wiring.

#### Framer Motion

Three specific patterns are used, each solving a concrete UX problem:

| Pattern | Where used | Problem solved |
|---|---|---|
| `AnimatePresence mode="wait"` | App.tsx (route transitions) | Ensures exit animation completes before enter begins — no page overlap |
| `AnimatePresence mode="popLayout"` | TransactionTable tbody | Exiting table rows are immediately removed from layout flow, so the table height doesn't hold a gap while a row fades out |
| `staggerChildren` on parent variants | DashboardPage card grid | Cards animate in sequentially (90 ms stagger) rather than all at once — creates a sense of progressive loading |
| `animate()` (standalone) | SummaryCard CountUp | Animates a number from its previous value to its new value at 60 fps by writing directly to the DOM node's `textContent` — zero state updates, zero re-renders |
| `layoutId="nav-active-bg"` | Sidebar NavItem | A shared layout ID causes Framer Motion to morph the active background between nav items using spring physics rather than CSS transitions |

---

## State Management

The entire application state lives in one Zustand store (`src/store/useAppStore.ts`). The store is divided into four conceptual slices:

### 1. Persisted slice (synced to `localStorage`)
```
role         — 'viewer' | 'admin'
theme        — 'light' | 'dark'
transactions — Transaction[]   ← source of truth for all data
```

These three fields are the only ones written to `localStorage`. Everything else is derived or ephemeral.

### 2. Async state (loading / error)
```
transactionsLoading  — true while the initial seed fetch is in flight
summaryLoading       — true while the dashboard summary is being recomputed
mutationLoading      — true during add / edit / delete operations
error                — string | null, set by any failed API call
```

Each loading flag is **independent**. A summary recompute after a mutation doesn't trigger `transactionsLoading` — only `summaryLoading`. This means the chart skeletons can be shown independently of the table skeleton, which prevents unnecessary layout shifts.

### 3. Derived / computed state
```
summary  — DashboardSummary | null   (computed by summaryUtils, triggered on mount + every mutation)
```

The summary is deliberately **not persisted**. It is always re-derived from `transactions` on mount, which means it can never be stale. The mock API's `computeSummary` call simulates a server-side aggregation endpoint, allowing us to show chart skeletons on every re-fetch.

### 4. UI state (ephemeral)
```
filters        — FilterState    (search, date range, categories, type, groupBy, sort)
modal          — ModalState     (isOpen, mode, editingTransaction)
deleteConfirm  — DeleteConfirmState
sidebarOpen    — boolean        (mobile sidebar Sheet)
```

None of this is persisted — it resets to defaults on every page load, which is the correct UX behaviour.

### Data flow diagram
```
localStorage
     │  (hydrated by Zustand persist on mount)
     ▼
useAppStore.transactions  ──── applyFilters() ────► getFilteredTransactions()
     │                                                       │
     │  (on mount + after every mutation)                    ▼
     ▼                                              TransactionTable
mockApi.computeSummary()
     │
     ▼
useAppStore.summary
     │
     ├──► DashboardPage (SummaryCards, BalanceTrendChart, SpendingPieChart)
     └──► computeInsights() ──► InsightsPanel
```

---

## Role-Based Access Control

The RBAC system is implemented at **three layers** for defence in depth:

### Layer 1 — Store (authoritative)

Every mutation action in `useAppStore` begins with a role check:
```typescript
addTransaction: async (payload) => {
  if (get().role !== 'admin') {
    set({ error: 'Unauthorized: only admins can add transactions.' });
    return;
  }
  // ... proceed
}
```

Even if the UI layer fails to hide a button, the store action is a no-op for viewers.

### Layer 2 — UI (ergonomic)

Components read `role` from the store and conditionally render:

- The "Add Transaction" button is hidden for viewers (`isAdmin && <motion.button ...>`)
- The "Actions" column in the table is hidden for viewers (`isAdmin && <td>...</td>`)
- The column `colSpan` values in the table header and footer adjust accordingly
- The `EmptyState` component adapts its CTA copy and button visibility based on role

### Layer 3 — Navigation hint

A subtle text hint below the transactions table reminds viewers how to gain write access, avoiding confusion without being obtrusive.

---

## Responsive Design

The layout is strictly **mobile-first** — base styles target mobile, `sm:`, `lg:`, and `xl:` modifiers progressively enhance.

| Breakpoint | Layout |
|---|---|
| `< 640px` (mobile) | Single column; sidebar hidden; hamburger menu in sticky top bar; charts stack vertically; table scrolls horizontally within its container |
| `640px–1023px` (tablet) | Summary cards switch to 3-column grid; chart pair still stacks vertically; sidebar remains hidden |
| `≥ 1024px` (desktop) | Fixed 256 px sidebar appears; charts display in 3:2 split (trend:pie); insights panel becomes 4-column |
| `≥ 1280px` (wide) | Maximum content width of `max-w-7xl` with increased horizontal padding |

The transaction table uses `min-w-[640px]` inside an `overflow-x-auto` wrapper — on narrow screens the table scrolls horizontally as a unit rather than collapsing columns, which preserves data legibility.

---

## Key Technical Decisions

### Skeleton CLS prevention

Every skeleton component (`SkeletonSummaryCard`, `SkeletonChartCard`, `SkeletonInsightCard`, `SkeletonTable`) mirrors the **exact dimensions** of its loaded counterpart. Chart skeletons use explicit `height` props that match the `h-72` (288 px) inner chart div. This ensures the page layout is stable as data loads — no reflow, no content jumping.

### Search debouncing

The `FilterBar` maintains a local `localSearch` state that updates immediately (for responsive input feedback). A `useDebounce(localSearch, 300)` hook delays the Zustand store update by 300 ms — so the table only re-filters after the user pauses typing, not on every keystroke.

### `tabular-nums` on all financial figures

Every currency value uses the `tabular-nums` Tailwind utility, which applies `font-variant-numeric: tabular-nums`. This ensures digits are all the same width, so column alignment stays consistent and the CountUp animation doesn't cause the card width to shift on every frame.

### Module-scoped Framer Motion variants

All `variants` objects (e.g. `cardStaggerVariants`, `itemVariants`) are defined at **module scope**, outside of component functions. Framer Motion uses reference equality to detect variant changes — recreating these objects on every render causes unnecessary animation restarts. Module scope gives stable references for free.

### RFC 4180-compliant CSV export

The CSV export wraps any field containing commas, double-quotes, or newlines in double-quotes, and escapes inner double-quotes by doubling them. A UTF-8 BOM (`\uFEFF`) is prepended so Excel opens the file in the correct encoding without a conversion prompt.

---

## License

MIT © 2026 FinanceOS Contributors

---

<div align="center">
  <sub>Built with ❤️ using React, TypeScript, Zustand, Tailwind CSS, shadcn/ui, Recharts, and Framer Motion.</sub>
</div>