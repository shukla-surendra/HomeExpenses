import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { AppState, Category, Expense } from '../types';
import { DEFAULTS_VERSION, defaultCategories, defaultState } from './defaults';

const KEY = 'home-expenses/v1';

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/** Validates/migrates a state object; any malformed piece falls back to defaults (spec 01 R6, R7). */
export const normalize = (s: any): AppState | null => {
  const base = defaultState();
  if (!s || s.version !== 1 || !Array.isArray(s.expenses)) return null;
  let categories: Category[] = Array.isArray(s.categories) && s.categories.length ? s.categories : base.categories;
  if ((s.defaultsVersion ?? 1) < DEFAULTS_VERSION) {
    const have = new Set(categories.map((c) => c.name.toLowerCase()));
    categories = [...categories, ...defaultCategories().filter((c) => !have.has(c.name.toLowerCase()))];
  }
  return {
    version: 1,
    defaultsVersion: DEFAULTS_VERSION,
    expenses: s.expenses,
    categories,
    budgets: Array.isArray(s.budgets) ? s.budgets : [],
    currency: typeof s.currency === 'string' && s.currency ? s.currency : base.currency,
    lastBackupAt: typeof s.lastBackupAt === 'number' ? s.lastBackupAt : undefined,
  };
};

const parse = (raw: string | null): AppState => {
  if (!raw) return defaultState();
  try {
    return normalize(JSON.parse(raw)) ?? defaultState();
  } catch {
    return defaultState();
  }
};

type Store = {
  state: AppState;
  ready: boolean;
  addExpense: (e: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, e: Omit<Expense, 'id' | 'createdAt'>) => void;
  deleteExpense: (id: string) => void;
  addCategory: (c: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, c: Omit<Category, 'id'>) => void;
  /** Returns false when the category is in use. */
  deleteCategory: (id: string) => boolean;
  setBudget: (categoryId: string | 'total', limit: number) => void;
  setCurrency: (c: string) => void;
  clearAll: () => void;
  restore: (s: AppState) => void;
  markBackedUp: () => void;
  /** Additive import of already-validated rows (spec 09). */
  applyImport: (expenses: Expense[], categories: Category[]) => void;
};

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => setState(parse(raw)))
      .catch(() => {})
      .finally(() => {
        loaded.current = true;
        setReady(true);
      });
  }, []);

  useEffect(() => {
    if (loaded.current) AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
  }, [state]);

  const value = useMemo<Store>(
    () => ({
      state,
      ready,
      addExpense: (e) =>
        setState((s) => ({ ...s, expenses: [...s.expenses, { ...e, id: uid(), createdAt: Date.now() }] })),
      updateExpense: (id, e) =>
        setState((s) => ({ ...s, expenses: s.expenses.map((x) => (x.id === id ? { ...x, ...e } : x)) })),
      deleteExpense: (id) => setState((s) => ({ ...s, expenses: s.expenses.filter((x) => x.id !== id) })),
      addCategory: (c) => setState((s) => ({ ...s, categories: [...s.categories, { ...c, id: uid() }] })),
      updateCategory: (id, c) =>
        setState((s) => ({ ...s, categories: s.categories.map((x) => (x.id === id ? { ...x, ...c } : x)) })),
      deleteCategory: (id) => {
        if (state.expenses.some((e) => e.categoryId === id)) return false;
        setState((s) => ({
          ...s,
          categories: s.categories.filter((c) => c.id !== id),
          budgets: s.budgets.filter((b) => b.categoryId !== id),
        }));
        return true;
      },
      setBudget: (categoryId, limit) =>
        setState((s) => {
          const rest = s.budgets.filter((b) => b.categoryId !== categoryId);
          return { ...s, budgets: limit > 0 ? [...rest, { categoryId, monthlyLimit: limit }] : rest };
        }),
      setCurrency: (currency) => setState((s) => ({ ...s, currency })),
      clearAll: () => setState(defaultState()),
      restore: (next) => setState(next),
      applyImport: (expenses, categories) =>
        setState((s) => ({
          ...s,
          categories: [...s.categories, ...categories],
          expenses: [...s.expenses, ...expenses],
        })),
      markBackedUp: () => setState((s) => ({ ...s, lastBackupAt: Date.now() })),
    }),
    [state, ready]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore must be used inside StoreProvider');
  return v;
};

export const useCategoryMap = () => {
  const { state } = useStore();
  return useMemo(() => new Map(state.categories.map((c) => [c.id, c])), [state.categories]);
};
