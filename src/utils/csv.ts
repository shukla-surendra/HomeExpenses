import type { AppState } from '../types';

const esc = (v: string | number) => {
  const s = String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export const expensesToCsv = (state: AppState) => {
  const names = new Map(state.categories.map((c) => [c.id, c.name]));
  const rows = [...state.expenses]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) =>
      [e.date, names.get(e.categoryId) ?? 'Unknown', e.amount.toFixed(2), e.note].map(esc).join(',')
    );
  return ['date,category,amount,note', ...rows].join('\n');
};

/** RFC-4180-style parser: quoted fields, escaped quotes, newlines in quotes, CRLF, BOM. */
export const parseCsv = (text: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  const src = text.replace(/^﻿/, '');
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      rows.push(row);
      row = [];
    } else field += ch;
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((f) => f.trim() !== ''));
};
