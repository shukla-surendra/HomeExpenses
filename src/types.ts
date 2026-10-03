export type Expense = {
  id: string;
  amount: number;
  categoryId: string;
  date: string; // YYYY-MM-DD, local
  note: string;
  createdAt: number;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export type Budget = {
  categoryId: string | 'total';
  monthlyLimit: number;
};

export type AppState = {
  version: 1;
  defaultsVersion: number;
  expenses: Expense[];
  categories: Category[];
  budgets: Budget[];
  currency: string;
  lastBackupAt?: number;
};
