import type { AppState, Category } from '../types';

export const PALETTE = [
  '#2E7D32', '#1565C0', '#EF6C00', '#6A1B9A', '#C62828',
  '#00838F', '#AD1457', '#4E342E', '#F9A825', '#546E7A',
];

export const DEFAULTS_VERSION = 2;

export const defaultCategories = (): Category[] =>
  [
    ['Groceries', '🛒'],
    ['Milk', '🥛'],
    ['Rent', '🏠'],
    ['Utilities', '💡'],
    ['Recharge & Subscriptions', '📱'],
    ['Transport', '🚌'],
    ['Health', '💊'],
    ['Education', '📚'],
    ['Dining', '🍽️'],
    ['Clothes', '👕'],
    ['Shopping', '🛍️'],
    ['Entertainment', '🎬'],
    ['Other', '📦'],
  ].map(([name, icon], i) => ({
    id: `cat-${name.toLowerCase().replace(/\W+/g, '-')}`,
    name,
    icon,
    color: PALETTE[i % PALETTE.length],
  }));

export const defaultState = (): AppState => ({
  version: 1,
  defaultsVersion: DEFAULTS_VERSION,
  expenses: [],
  categories: defaultCategories(),
  budgets: [],
  currency: '₹',
});
