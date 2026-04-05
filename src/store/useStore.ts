import { create } from "zustand";
import type { Transaction, Role, FilterType, SortKey, SortDir } from "../types";
import { transactions as mockTransactions } from "../data/mockData";

interface StoreState {
  transactions: Transaction[];
  role: Role;
  typeFilter: FilterType;
  sortKey: SortKey;
  sortDir: SortDir;
  searchQuery: string;
  monthFilter: string;
  theme: "dark" | "light";

  // Actions
  setRole: (role: Role) => void;
  setTypeFilter: (filter: FilterType) => void;
  setSortKey: (key: SortKey) => void;
  setSortDir: (dir: SortDir) => void;
  setSearchQuery: (query: string) => void;
  setMonthFilter: (month: string) => void;
  toggleTheme: () => void;
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: number) => void;
  loadFromStorage: () => void;
  persistToStorage: (transactions: Transaction[]) => void;
}

const STORAGE_KEY = "fintrack_txns";
const THEME_KEY = "fintrack_theme";

export const useStore = create<StoreState>((set, get) => ({
  transactions: [],
  role: "viewer",
  typeFilter: "all",
  sortKey: "date",
  sortDir: "desc",
  searchQuery: "",
  monthFilter: "2026-03",
  theme: "dark",

  setRole: (role) => set({ role }),
  setTypeFilter: (typeFilter) => set({ typeFilter }),
  setSortKey: (sortKey) => set({ sortKey }),
  setSortDir: (sortDir) => set({ sortDir }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setMonthFilter: (monthFilter) => set({ monthFilter }),

  toggleTheme: () => {
    const newTheme = get().theme === "dark" ? "light" : "dark";
    set({ theme: newTheme });
    localStorage.setItem(THEME_KEY, newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  },

  addTransaction: (tx) => {
    const ids = get().transactions.map((t) => t.id);
    const newId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
    const newTransaction = { ...tx, id: newId };
    const newTransactions = [newTransaction, ...get().transactions];
    set({ transactions: newTransactions });
    get().persistToStorage(newTransactions);
  },

  updateTransaction: (transaction) => {
    const newTransactions = get().transactions.map((t) =>
      t.id === transaction.id ? transaction : t
    );
    set({ transactions: newTransactions });
    get().persistToStorage(newTransactions);
  },

  deleteTransaction: (id) => {
    const newTransactions = get().transactions.filter((t) => t.id !== id);
    set({ transactions: newTransactions });
    get().persistToStorage(newTransactions);
  },

  persistToStorage: (transactions) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  },

  loadFromStorage: () => {
    const storedTxns = localStorage.getItem(STORAGE_KEY);
    const storedTheme = localStorage.getItem(THEME_KEY) as "dark" | "light" | null;

    if (storedTxns) {
      try {
        set({ transactions: JSON.parse(storedTxns) });
      } catch (e) {
        set({ transactions: mockTransactions });
      }
    } else {
      set({ transactions: mockTransactions });
    }

    if (storedTheme) {
      set({ theme: storedTheme });
      document.documentElement.setAttribute("data-theme", storedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", get().theme);
    }
  },
}));
