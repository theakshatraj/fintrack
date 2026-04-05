export type Transaction = {
  id: number;
  date: string; // "YYYY-MM-DD"
  description: string;
  amount: number;
  category: string;
  type: "income" | "expense";
};

export type Role = "viewer" | "admin";

export type FilterType = "all" | "income" | "expense";

export type SortKey = "date" | "amount" | "description" | "category";

export type SortDir = "asc" | "desc";
