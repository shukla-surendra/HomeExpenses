# 02 — Add / edit expense

Status: implemented (ACs pending on-device verification)

## Purpose
Fast capture and correction of an expense.

## Requirements
- R1: Fields: amount (required, numeric > 0), category (required, chip picker), date (default today, picker), note (optional).
- R2: Amount keyboard is numeric-decimal; max 2 decimals.
- R3: Save is disabled until valid; invalid amount shows inline message.
- R4: Opened from the **Add** tab (create) or by tapping a row in the list (edit).
- R5: Edit mode shows a Delete button with confirmation.
- R6: After save, return to previous screen.

## Acceptance criteria
- [ ] AC1: Entering 250, choosing Groceries, Save → appears at top of today's list.
- [ ] AC2: Amount 0, empty, or "abc" cannot be saved.
- [ ] AC3: Editing changes persist; deleting asks for confirmation.
- [ ] AC4: Future dates are allowed (pre-recording a bill).

## Out of scope
Receipts, recurring entries, split expenses.

## Code map
`src/app/expense/[id].tsx` (id = `new` for create), `src/components/CategoryPicker.tsx`, `src/app/(tabs)/add.tsx` (placeholder; tab press opens the form)
