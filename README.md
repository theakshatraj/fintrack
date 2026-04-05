# Fintrack — Finance Dashboard

A clean, interactive personal finance dashboard built as a single-file HTML application. No build tools, no dependencies to install — just open the file in a browser.

---

## Live Preview

Open `index.html` directly in any modern browser. No server required.

---

## Features

### Dashboard Overview
- **Summary cards** — Total Balance, Income, Expenses with month-over-month deltas
- **Balance trend line chart** — running balance plotted day by day
- **Spending breakdown donut chart** — category-wise split with percentages
- **Recent transactions preview** — last 5 transactions inline

### Transactions
- Full transaction table with Date, Description, Category, Type, Amount
- **Search** — real-time filtering by description or category
- **Type filter** — All / Income / Expense toggle buttons
- **Sort** — Date (asc/desc), Amount (asc/desc) via dropdown or clicking column headers
- **Export JSON** — downloads all transactions as a JSON file

### Role-Based UI
Roles are simulated via a dropdown in the sidebar:

| Role    | Permissions                          |
|---------|--------------------------------------|
| Viewer  | Read-only — no add/edit/delete       |
| Admin   | Full access — add, edit, delete      |

Switching to Admin reveals the **Add Transaction** button and inline **Edit / Delete** controls per row.

### Insights
- Highest spending category with amount
- Month-over-month expense change (% vs February)
- Savings rate with qualitative badge (Excellent / Moderate / Low)
- Average daily spend this month
- Most expensive single day
- Number of income streams and their categories
- Monthly Income vs Expenses grouped bar chart (Jan–Mar)

### Extras
- **Dark / Light mode** — toggle persists within the session; charts re-render for each theme
- **LocalStorage persistence** — new transactions survive page refresh
- **Responsive** — sidebar collapses on mobile, layout reflows to single column; mobile nav bar appears

---

## Tech Decisions

**Single-file HTML** — No framework, no bundler, no node_modules. The brief said "no backend dependency" and "show how you think." A single file is the most portable, immediately runnable deliverable. Any reviewer can double-click it.

**Chart.js (CDN)** — Loaded from cdnjs. Handles line, doughnut, and bar charts without a build step. Lightweight and well-documented.

**Vanilla JS state** — A single `state` object holds transactions, role, and filter values. For this scale, a framework's reactivity would add overhead without benefit. All renders are explicit function calls (`renderDashboard()`, `renderTable()`, `renderInsights()`), making the data flow easy to trace.

**localStorage persistence** — Transactions written on every mutation. Falls back to seed data on first load or if storage is unavailable.

**Mock data** — 30 realistic transactions across Jan–Mar 2026, designed to produce meaningful insights (MoM comparisons, category breakdowns, savings rate variation).

**CSS variables** — Light and dark themes are a single attribute swap on `<html>`. All colors reference variables, so chart colors are the only hardcoded hex values (Chart.js canvas cannot resolve CSS variables).

---

## Assumptions

- Currency is INR (₹). Swap the symbol in `fmt()` to localise.
- Month filter on the dashboard covers Jan–Mar 2026 to match mock data range.
- Role switching is frontend-only simulation, as specified.
- Insights are computed against March 2026 data (the current month in the scenario) with February as the comparison period.

---

## File Structure

```
index.html        ← entire app (styles + markup + script)
README.md
```

All logic is in clearly separated script sections:
- `loadData / saveData` — persistence
- `renderDashboard / renderLineChart / renderPieChart / renderRecentTx` — dashboard page
- `renderTable / setTypeFilter / quickSort / exportJSON` — transactions page
- `renderInsights / renderBarChart` — insights page
- `setRole / openModal / saveTransaction / editTx / deleteTx` — RBAC + CRUD
- `showPage / filterMonth / toggleTheme` — navigation + UX

---

## Edge Cases Handled

- Empty state message when no transactions match filters
- Graceful fallback if localStorage is unavailable
- Donut/line charts destroyed before re-render to avoid canvas conflicts
- Month deltas show "No comparison data" when previous month has no entries
- Savings rate badge changes colour based on threshold (≥20% = good, ≥10% = moderate, <10% = low)
- Export works even with an empty transaction list