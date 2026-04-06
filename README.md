# fintrack — Finance Dashboard

A personal finance dashboard to track transactions, visualise spending, and simulate role-based access control. Built with React, TypeScript, Zustand, Recharts, and Tailwind CSS.

🔗 **Live Demo:** [fintrack-aksh.vercel.app](https://fintrack-aksh.vercel.app/)

---

## Preview

| Dashboard | Transactions | Insights |
|-----------|-------------|----------|
| Summary cards, trend chart, pie chart, recent activity | Searchable & sortable table, admin CRUD | Spending patterns, MoM comparison, savings rate |

---

## Features

### Dashboard Overview
- **Summary cards** — Total Balance, Total Income, Total Expenses with month-over-month deltas
- **Balance trend** — Line chart of running balance plotted day by day
- **Spending breakdown** — Donut chart grouped by category with a custom HTML legend
- **Recent transactions** — Last 5 entries inline, no extra navigation required
- **Month picker** — Filter all dashboard data to All / January / February / March

### Transactions
- Full table with Date, Description, Category, Type (coloured dot), Amount
- **Real-time search** — filters by description or category as you type
- **Type filter** — All / Income / Expense toggle buttons
- **Sorting** — Date or Amount, ascending or descending
- **Export JSON** — downloads the full transaction list as `fintrack_transactions.json`
- **Add / Edit / Delete** — available when role is set to Admin (modal form)

### Role-Based UI
Roles are simulated on the frontend via a sidebar dropdown.

| Role   | What they can do                          |
|--------|-------------------------------------------|
| Viewer | Read-only — no add, edit, or delete       |
| Admin  | Full access — add, edit, delete per row   |

Switching role immediately updates all UI — no page reload needed.

### Insights
- Highest spending category with total amount
- Month-over-month expense change (% vs previous month, with ▲/▼ indicator)
- Savings rate with contextual badge: **Excellent** ≥ 20%, **Moderate** ≥ 10%, **Low** < 10%
- Average daily spend for the current month
- Most expensive single day with total
- Number of distinct income streams and their categories
- Monthly Income vs Expenses grouped bar chart across all three months

### Additional
- **Dark / Light mode** — toggle in the sidebar, applies instantly via `data-theme` on `<html>`
- **LocalStorage persistence** — transactions survive page refresh; falls back to seed data on first load
- **Responsive layout** — sidebar collapses on mobile, replaced by a horizontal nav bar; cards and charts reflow to single column

---

## Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | React 18 + TypeScript | Type safety, component model, industry standard |
| Build tool | Vite | Near-instant dev server, minimal config |
| State | Zustand | Lightweight, no boilerplate, easy TypeScript integration |
| Charts | Recharts | Declarative React API, composable primitives |
| Styling | Tailwind CSS + CSS variables | Utility classes for layout; CSS variables for theming |
| Icons | Lucide React | Consistent, tree-shakeable icon set |
| Fonts | Sora + DM Mono | Sora for UI text, DM Mono for numbers and dates |

---

## Project Structure

```
src/
├── types/
│   └── index.ts              # Transaction, Role, FilterType, SortKey, SortDir
├── data/
│   └── mockData.ts           # 30 seed transactions across Jan–Mar 2026
├── store/
│   └── useStore.ts           # Zustand store — transactions, role, filters, theme
├── utils/
│   └── helpers.ts            # Pure functions: calcSummary, formatINR, getDailyBalance, etc.
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx       # Desktop nav, role switcher, theme toggle
│   │   └── MobileNav.tsx     # Horizontal pill nav for small screens
│   ├── cards/
│   │   ├── SummaryCard.tsx   # Single metric card with label, value, delta
│   │   └── SummaryGrid.tsx   # 3-card grid reading from store
│   ├── charts/
│   │   ├── BalanceTrendChart.tsx   # Recharts LineChart — daily running balance
│   │   ├── SpendingPieChart.tsx    # Recharts PieChart — category breakdown
│   │   └── MonthlyBarChart.tsx     # Recharts BarChart — income vs expenses
│   ├── transactions/
│   │   ├── TransactionControls.tsx # Search, filter, sort, export, add button
│   │   ├── TransactionTable.tsx    # Table with admin edit/delete actions
│   │   └── TransactionModal.tsx    # Add / Edit modal form
│   └── insights/
│       └── InsightCard.tsx         # Icon + title + value + note card
├── pages/
│   ├── DashboardPage.tsx     # Assembles summary, charts, recent list
│   ├── TransactionsPage.tsx  # Controls + table + modal
│   └── InsightsPage.tsx      # 6 insight cards + bar chart
└── App.tsx                   # Root layout, page routing, theme init
```

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# 1. Clone the repo
git clone https://github.com/your-username/fintrack.git
cd fintrack

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

---

## State Management

All application state lives in a single Zustand store (`src/store/useStore.ts`):

```
transactions    — full list, loaded from localStorage or seed data
role            — "viewer" | "admin"
typeFilter      — "all" | "income" | "expense"
sortKey         — "date" | "amount" | "description" | "category"
sortDir         — "asc" | "desc"
searchQuery     — string, filters table in real time
monthFilter     — "all" | "2026-01" | "2026-02" | "2026-03"
theme           — "dark" | "light"
```

Computed values (filtered lists, summaries, chart data) are derived inside components using `useMemo` — they are never stored in state. This keeps the store minimal and ensures derived data is always in sync.

---

## Technical Decisions

**Zustand over Redux or Context** — Redux adds significant boilerplate for a project of this size. Context causes unnecessary re-renders when any value in the context changes. Zustand gives selector-based subscriptions, TypeScript support out of the box, and no provider wrapping.

**Inline styles for the sidebar, CSS variables for theming** — Tailwind cannot resolve dynamic CSS variable values in class names at runtime. The sidebar and card components use inline `style` props with `var(--bg2)`, `var(--accent)` etc. so theme changes apply instantly without rebuilding class strings.

**Recharts over Chart.js** — Recharts is React-native and declarative. Chart.js requires managing canvas refs and imperative `chart.destroy()` calls. For a component-based architecture, Recharts is the cleaner fit. Note: chart colors are hardcoded hex values (not CSS variables) because SVG/canvas cannot resolve CSS custom properties.

**No router (React Router / TanStack)** — with only three views and no URL-based navigation requirements, a local `activePage` state in `App.tsx` is simpler and more appropriate. Adding a router would be over-engineering.

**localStorage as persistence** — a pragmatic stand-in for a real API. Transactions are written on every mutation. If storage is unavailable or the data is corrupt, the app silently falls back to the seed dataset.

---

## Edge Cases Handled

- Zero transactions — all charts show an empty state message instead of a broken render
- No previous month data — delta lines show "No comparison data" instead of NaN or errors
- Savings rate when income is zero — returns 0% to avoid division-by-zero
- Export downloads all transactions regardless of active filters
- Role switch is instant — Admin controls appear/disappear without page reload
- Theme toggle applies `data-theme` to `document.documentElement` immediately on mount to prevent a flash of wrong theme

---

## Assumptions

- Currency is INR (₹). To localise, update `formatINR()` in `src/utils/helpers.ts`
- Mock data covers January–March 2026, matching the month picker range
- Insights comparisons are computed against March 2026 (current month) vs February 2026
- Role switching is frontend simulation only — in a real app, roles would be enforced server-side

---

## Deployment

The app is deployed on **Vercel** at [fintrack-aksh.vercel.app](https://fintrack-aksh.vercel.app/).

Vercel auto-deploys from the `main` branch on every push. No environment variables are required — the app is fully client-side with no backend or API keys.

To deploy your own fork:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project root
vercel
```

Or connect the repo directly in the [Vercel dashboard](https://vercel.com/new) — it auto-detects Vite and sets the correct build command (`npm run build`) and output directory (`dist`).

---
