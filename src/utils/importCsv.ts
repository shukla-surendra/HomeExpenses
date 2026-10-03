import { PALETTE } from '../store/defaults';
import type { AppState, Category, Expense } from '../types';
import { parseCsv } from './csv';

export type ImportPlan =
  | { error: string }
  | {
      expenses: Expense[];
      newCategories: Category[];
      duplicates: number;
      invalid: number;
    };

const REQUIRED = ['date', 'category', 'amount'];

const pad = (n: number) => String(n).padStart(2, '0');

/** Accepts YYYY-MM-DD or DD/MM/YYYY (also - or . separators); returns YYYY-MM-DD or null. */
export const normalizeDate = (raw: string): string | null => {
  const s = raw.trim();
  let y: number, m: number, d: number;
  let match = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s);
  if (match) [y, m, d] = [+match[1], +match[2], +match[3]];
  else if ((match = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/.exec(s))) [d, m, y] = [+match[1], +match[2], +match[3]];
  else return null;
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
  return `${y}-${pad(m)}-${pad(d)}`;
};

/** Tolerates currency symbols/spaces and thousands commas; returns amount > 0 (2 dp) or null. */
export const parseAmount = (raw: string): number | null => {
  const cleaned = raw.replace(/[^\d.\-]/g, '');
  if (!/^\d*\.?\d+$|^\d+\.$/.test(cleaned)) return null;
  const n = Math.round(parseFloat(cleaned) * 100) / 100;
  return Number.isFinite(n) && n > 0 ? n : null;
};

const key = (date: string, categoryId: string, amount: number, note: string) =>
  `${date}|${categoryId}|${amount.toFixed(2)}|${note}`;

/** Pure: validates CSV text against the current state; writes nothing (spec 09). */
export function planImport(text: string, state: AppState, now = Date.now()): ImportPlan {
  const rows = parseCsv(text);
  if (rows.length === 0) return { error: 'The file is empty.' };
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const missing = REQUIRED.filter((c) => !header.includes(c));
  if (missing.length) return { error: `Missing required column(s): ${missing.join(', ')}.` };
  const idx = (c: string) => header.indexOf(c);
  const [di, ci, ai, ni] = [idx('date'), idx('category'), idx('amount'), idx('note')];

  const byName = new Map(state.categories.map((c) => [c.name.toLowerCase(), c]));
  const newCategories: Category[] = [];
  const seen = new Set(state.expenses.map((e) => key(e.date, e.categoryId, e.amount, e.note)));
  const expenses: Expense[] = [];
  let duplicates = 0;
  let invalid = 0;

  rows.slice(1).forEach((r, n) => {
    const date = normalizeDate(r[di] ?? '');
    const amount = parseAmount(r[ai] ?? '');
    const catName = (r[ci] ?? '').trim();
    if (!date || amount === null || !catName) {
      invalid++;
      return;
    }
    let cat = byName.get(catName.toLowerCase());
    if (!cat) {
      cat = {
        id: `imp-${now.toString(36)}-${newCategories.length}`,
        name: catName,
        icon: '🏷️',
        color: PALETTE[(state.categories.length + newCategories.length) % PALETTE.length],
      };
      newCategories.push(cat);
      byName.set(catName.toLowerCase(), cat);
    }
    const note = ni >= 0 ? (r[ni] ?? '').trim() : '';
    const k = key(date, cat.id, amount, note);
    if (seen.has(k)) {
      duplicates++;
      return;
    }
    seen.add(k);
    expenses.push({ id: `imp-${now.toString(36)}-e${n}`, amount, categoryId: cat.id, date, note, createdAt: now + n });
  });

  return { expenses, newCategories, duplicates, invalid };
}
