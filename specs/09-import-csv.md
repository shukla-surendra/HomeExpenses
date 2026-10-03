# 09 — Import expenses from CSV

Status: in-progress

## Purpose
Bring in expenses from a spreadsheet or another app, or re-import a CSV exported by this app (spec 07).
Backup/restore (spec 08) remains the way to restore everything; CSV import only **adds expenses**.

## File format
UTF-8 CSV with a header row. Required columns (case-insensitive, any order): `date`, `category`, `amount`.
Optional: `note`. Extra columns are ignored. Commas, quotes and newlines inside quoted fields are supported.
Dates: `YYYY-MM-DD` or `DD/MM/YYYY` (also `-` or `.` as separator for the latter).

## Requirements
- R1: Settings → "Import CSV" opens the OS file picker and parses the chosen file.
- R2: A file missing a required column is rejected with a message naming the missing column(s); nothing changes.
- R3: Row validation: valid date, amount a number > 0 (a leading currency symbol and thousands commas are tolerated,
  e.g. `₹1,200.50`), non-empty category. Invalid rows are skipped and counted.
- R4: Category is matched to an existing category by name, case-insensitive. Unknown names create a new category
  (icon 🏷️, next palette colour).
- R5: Duplicates (same date + category + amount + note as an existing or earlier-imported expense) are skipped and counted.
- R6: Before importing, show a confirmation: "Import N expenses (X new categories)? Y duplicates and Z invalid rows will be skipped."
  Nothing is written until the user confirms.
- R7: After importing, show a result message with the counts. Importing is additive; it never deletes or edits existing data.
- R8: A file with zero valid new rows shows "Nothing to import" with the skip counts.

## Acceptance criteria
- [ ] AC1: Export CSV then Import CSV on the same data adds nothing (all duplicates).
- [ ] AC2: Export CSV, Clear all data, Import CSV restores all expenses (categories recreated by name).
- [ ] AC3: `₹1,200.50`, `12/03/2026` and quoted notes with commas import correctly.
- [ ] AC4: A CSV without an `amount` column is rejected.
- [ ] AC5: Cancelling the picker or the confirmation changes nothing.

Verification note: the parsing/validation/dedupe logic behind AC1–AC4 passed a scripted test (2026-10-02); ACs stay
unchecked until confirmed on a device (file picker and share sheet are not covered by the script).

## Out of scope
Column mapping UI, Excel (.xlsx) files, importing budgets/currency (use restore).

## Code map
`src/utils/csv.ts` (parser), `src/utils/importCsv.ts` (validate + plan), `src/utils/files.ts`, `src/store/index.tsx` (`applyImport`), `src/app/(tabs)/settings.tsx`
