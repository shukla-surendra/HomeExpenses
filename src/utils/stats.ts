import type { AppState, Expense } from '../types';
import { monthKey, shiftMonth } from './date';

export const sum = (list: Expense[]) => list.reduce((t, e) => t + e.amount, 0);

export const expensesInMonth = (expenses: Expense[], key: string) =>
  expenses.filter((e) => monthKey(e.date) === key);

export const byCategory = (expenses: Expense[]) => {
  const map = new Map<string, number>();
  for (const e of expenses) map.set(e.categoryId, (map.get(e.categoryId) ?? 0) + e.amount);
  return [...map.entries()]
    .map(([categoryId, total]) => ({ categoryId, total }))
    .sort((a, b) => b.total - a.total);
};

export const trend = (expenses: Expense[], key: string, months = 6) =>
  Array.from({ length: months }, (_, i) => {
    const k = shiftMonth(key, i - (months - 1));
    return { key: k, total: sum(expensesInMonth(expenses, k)) };
  });

/** % change vs previous month, or null when previous is 0. */
export const delta = (current: number, previous: number) =>
  previous > 0 ? ((current - previous) / previous) * 100 : null;

export const budgetFor = (state: AppState, categoryId: string | 'total') =>
  state.budgets.find((b) => b.categoryId === categoryId)?.monthlyLimit;

export const formatMoney = (amount: number, currency: string) =>
  `${currency}${amount.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: amount % 1 ? 2 : 0 })}`;
