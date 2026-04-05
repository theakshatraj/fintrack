import type { Transaction } from "../types";

/**
 * Calculates income, expense, and balance from a list of transactions.
 */
export const calcSummary = (txns: Transaction[]) => {
  return txns.reduce(
    (acc, txn) => {
      if (txn.type === "income") {
        acc.income += txn.amount;
      } else {
        acc.expense += txn.amount;
      }
      acc.balance = acc.income - acc.expense;
      return acc;
    },
    { income: 0, expense: 0, balance: 0 }
  );
};

/**
 * Filters transactions by month (YYYY-MM). Skip if month is "all".
 */
export const getFiltered = (txns: Transaction[], month: string) => {
  if (month === "all") return txns;
  return txns.filter((t) => t.date.startsWith(month));
};

/**
 * Formats a number as INR currency.
 */
export const formatINR = (n: number) => {
  return "₹" + Math.abs(n).toLocaleString("en-IN");
};

/**
 * Gets the highest total expense category.
 */
export const getTopCategory = (txns: Transaction[]) => {
  const expenses = txns.filter((t) => t.type === "expense");
  const categories = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  let top = { category: "N/A", amount: 0 };
  Object.entries(categories).forEach(([category, amount]) => {
    if (amount > top.amount) {
      top = { category, amount };
    }
  });
  return top;
};

/**
 * Calculates savings rate: (balance / income) * 100.
 */
export const getSavingsRate = (txns: Transaction[]) => {
  const { income, balance } = calcSummary(txns);
  if (income === 0) return 0;
  return Math.round((balance / income) * 100);
};

/**
 * Aggregates income and expenses by month for a list of months.
 */
export const getMonthlyData = (txns: Transaction[], months: string[]) => {
  return months.map((month) => {
    const monthTxns = getFiltered(txns, month);
    const { income, expense } = calcSummary(monthTxns);
    return { month, income, expense };
  });
};

/**
 * Calculates a running balance by date.
 */
export const getDailyBalance = (txns: Transaction[]) => {
  const sorted = [...txns].sort((a, b) => a.date.localeCompare(b.date));
  const daily: Record<string, number> = {};
  let running = 0;

  sorted.forEach((t) => {
    running += t.type === "income" ? t.amount : -t.amount;
    daily[t.date] = running;
  });

  return Object.entries(daily).map(([date, balance]) => ({ date, balance }));
};

/**
 * Returns the previous month string (YYYY-MM).
 */
export const getPrevMonth = (month: string) => {
  const [year, m] = month.split("-").map(Number);
  const date = new Date(year, m - 2); // Month is 0-indexed, so m-1 is current, m-2 is previous
  const prevY = date.getFullYear();
  const prevM = String(date.getMonth() + 1).padStart(2, "0");
  return `${prevY}-${prevM}`;
};

/**
 * Returns a formatted month label (e.g., "March 2026").
 */
export const getMonthLabel = (month: string) => {
  if (month === "all") return "All Time";
  const [year, m] = month.split("-").map(Number);
  const date = new Date(year, m - 1);
  return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
};
