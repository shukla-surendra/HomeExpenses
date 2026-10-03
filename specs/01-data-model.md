# 01 — Data model & storage

Status: implemented (ACs pending on-device verification)

## Entities
```ts
Expense  { id: string; amount: number /* > 0, 2 dp */; categoryId: string;
           date: string /* YYYY-MM-DD local */; note: string; createdAt: number }
Category { id: string; name: string; icon: string /* emoji */; color: string /* hex */ }
Budget   { categoryId: string | 'total'; monthlyLimit: number }
State    { defaultsVersion: number; expenses: Expense[]; categories: Category[]; budgets: Budget[]; currency: string; lastBackupAt?: number /* epoch ms, spec 08 */ }
```

## Requirements
- R1: State persists under a single AsyncStorage key `home-expenses/v1` as JSON.
- R2: First launch seeds default categories: Groceries, Milk, Rent, Utilities, Recharge & Subscriptions,
  Transport, Health, Education, Dining, Clothes, Shopping, Entertainment, Other.
  Existing installs get newly added defaults merged in once per `defaultsVersion` bump (skipping any whose
  name already exists, case-insensitive). A default the user deleted is not re-added unless a later bump introduces it.
- R3: IDs are unique, generated locally.
- R4: Deleting a category that has expenses is blocked (see 05).
- R5: Dates are stored as local calendar dates, not UTC timestamps, so month grouping is stable.
- R7: `defaultsVersion` (currently 2) records which default-category set has been applied; stored state without it is treated as 1.
- R6: A schema `version` allows future migrations; unknown/corrupt storage falls back to defaults without crashing.

## Acceptance criteria
- [ ] AC1: Expenses survive app restart.
- [ ] AC2: Fresh install shows 13 default categories.
- [ ] AC4: An install saved with the old 10 categories shows the 13 after update, with its expenses intact.
- [ ] AC3: Corrupt stored JSON does not crash the app.

## Code map
`src/store/`, `src/types.ts`, `src/utils/date.ts`
