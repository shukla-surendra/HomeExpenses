# 07 — Export & backup

Status: implemented (ACs pending on-device verification)

## Requirements
- R1: Settings → "Export CSV" creates `home-expenses-YYYY-MM-DD.csv` (all expenses) and shares it as a file via the OS share sheet, so it can be saved to Drive/Files or opened in a spreadsheet.
- R2: Columns: date, category, amount, note. Fields are CSV-escaped (quotes, commas, newlines).
- R3: Settings → "Clear all data" with a confirmation; resets to defaults.
- R4: Settings → currency symbol (default ₹).

## Acceptance criteria
- [ ] AC1: Notes with commas/quotes produce valid CSV.
- [ ] AC2: Clear-all requires confirmation and restores default categories.

## Out of scope
Cloud backup. Import of CSV is spec 09; full restore is spec 08.

## Code map
`src/app/(tabs)/settings.tsx`, `src/utils/csv.ts`
