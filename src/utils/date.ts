const pad = (n: number) => String(n).padStart(2, '0');

export const toDateString = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const today = () => toDateString(new Date());

export const parseDate = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};

/** Month key like "2026-10". */
export const monthKey = (dateStr: string) => dateStr.slice(0, 7);

export const currentMonthKey = () => monthKey(today());

export const shiftMonth = (key: string, delta: number) => {
  const [y, m] = key.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
};

export const monthLabel = (key: string) => {
  const [y, m] = key.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
};

export const monthShort = (key: string) => {
  const [y, m] = key.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString(undefined, { month: 'short' });
};

export const dayLabel = (dateStr: string) => {
  if (dateStr === today()) return 'Today';
  return parseDate(dateStr).toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
};
