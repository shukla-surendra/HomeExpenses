# 04 — Dashboard

Status: implemented (ACs pending on-device verification)

## Requirements
- R1: Month selector; headline total for the month and delta vs previous month (% and direction).
- R2: Category breakdown: horizontal bars sorted descending, with amount and % of total.
- R3: 6-month trend bar chart (selected month and 5 before), selected month highlighted.
- R4: Budget summary: if a total budget is set, show spent / limit progress bar; turns red when exceeded.
- R5: Top 3 recent expenses of the month with link to full list.
- R6: Empty month shows a friendly empty state, no NaN/Infinity values.

## Acceptance criteria
- [ ] AC1: Category percentages sum to ~100%.
- [ ] AC2: Previous month total 0 → delta is hidden, not "Infinity%".
- [ ] AC3: Charts render without extra native dependencies (Views only).

## Code map
`src/app/(tabs)/index.tsx`, `src/components/BarList.tsx`, `src/components/TrendChart.tsx`, `src/utils/stats.ts`
