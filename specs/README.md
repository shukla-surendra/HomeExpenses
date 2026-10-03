# Specs — source of truth

This project is **spec-driven**. The specs in this folder define what the app does.
Code follows specs, never the other way round.

## Workflow for any change

1. **Find or create the spec.** Feature → `NN-name.md`. New feature gets the next number.
2. **Edit the spec first**: update requirements (R-ids) and acceptance criteria (AC-ids). Set `Status`.
3. **Add a line to `CHANGELOG.md`** (date, spec, what changed, why).
4. **Implement** against the acceptance criteria. Reference spec ids in code comments only where non-obvious.
5. **Verify** (`npx tsc --noEmit`, `npx expo lint`, run on Android) and tick the ACs in the spec.
6. If implementation reveals the spec is wrong, fix the spec in the same change.

## Spec format

Each spec has: Status (`draft | in-progress | implemented`), Purpose, Requirements (`R1…`),
Acceptance criteria (`AC1…`, checkbox), Out of scope, and Code map (files that implement it).

## Index

| # | Spec | Status |
|---|------|--------|
| 00 | [Overview](00-overview.md) | implemented, unverified on device |
| 01 | [Data model & storage](01-data-model.md) | implemented, unverified on device |
| 02 | [Add / edit expense](02-expense-entry.md) | implemented, unverified on device |
| 03 | [Expense list](03-expense-list.md) | implemented, unverified on device |
| 04 | [Dashboard](04-dashboard.md) | implemented, unverified on device |
| 05 | [Categories](05-categories.md) | implemented, unverified on device |
| 06 | [Budgets](06-budgets.md) | implemented, unverified on device |
| 07 | [Export & backup](07-export.md) | implemented, unverified on device |
| 08 | [Backup & restore](08-backup-restore.md) | in-progress |
| 09 | [Import expenses from CSV](09-import-csv.md) | in-progress |
