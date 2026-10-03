# 06 — Budgets

Status: implemented (ACs pending on-device verification)

## Requirements
- R1: A monthly limit can be set for the overall total and per category. Blank/0 removes it.
- R2: Same limits apply every month (no per-month overrides in v1).
- R3: Dashboard shows total budget progress (spec 04 R4); per-category bars show a limit marker/over-budget color when a limit exists.

## Acceptance criteria
- [ ] AC1: Setting a total of 20000 with 15000 spent shows 75%.
- [ ] AC2: Spending above limit shows red state.
- [ ] AC3: Clearing the field removes the budget.

## Code map
`src/app/budgets.tsx`, `src/utils/stats.ts`
