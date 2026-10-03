# 03 — Expense list

Status: implemented (ACs pending on-device verification)

## Requirements
- R1: Month selector (prev/next) at top; default current month; shows month total.
- R2: Expenses grouped by day (newest first) with day subtotal.
- R3: Row shows category icon, note (or category name), amount.
- R4: Filter by category (chips, "All" default) and text search over note/category name.
- R5: Tap row → edit (spec 02). Empty state with hint when no results.

## Acceptance criteria
- [ ] AC1: Switching month only shows that month's expenses and total.
- [ ] AC2: Category filter and search combine (AND); the total reflects the filtered set.
- [ ] AC3: Day headers show correct subtotal.

## Code map
`src/app/(tabs)/expenses.tsx`, `src/components/ExpenseRow.tsx`, `src/components/MonthSwitcher.tsx`
