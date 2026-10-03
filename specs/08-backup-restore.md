# 08 — Backup & restore

Status: in-progress

## Purpose
Uninstalling the app erases its local storage. A backup file kept outside the app (Drive, WhatsApp,
email, Files) lets the user get all data back after reinstalling or moving to a new phone.

## Requirements
- R1: Settings → "Backup data" creates `home-expenses-backup-YYYY-MM-DD.json` and opens the OS share sheet
  (save to Drive/Files, send via WhatsApp/email).
- R2: Backup file is JSON: `{ app: "home-expenses", schema: 1, exportedAt: ISO string, data: AppState }`
  and contains expenses, categories, budgets, currency.
- R3: Settings → "Restore from backup" opens the OS file picker, reads the chosen file and validates it.
- R4: Invalid files (not JSON, wrong `app`, unsupported `schema`, missing expenses array) are rejected with a
  clear message and change nothing.
- R5: Before restoring, show a confirmation with counts: "Replace current data (X expenses) with backup (Y expenses)?"
  Restore **replaces** current data (no merge, so no duplicates). Restored data goes through the same
  normalisation/migration as stored data (spec 01 R6, R7).
- R6: Settings shows "Last backup: <date>" (or "Never") and the Dashboard-independent reminder text
  "Back up before uninstalling" under the Backup row when the last backup is older than 30 days or never.
- R7: Android `allowBackup` is enabled in app config as a best-effort extra (Google auto-backup on store-installed
  builds). The app does not rely on it and it is not available in Expo Go.
- R8: Existing CSV export (spec 07) is unchanged; CSV is for spreadsheets, JSON is for restore.

## Acceptance criteria
- [ ] AC1: Backup → clear all data → restore returns identical expenses, categories, budgets, currency.
- [ ] AC2: Backup file saved to Drive/Files survives uninstall + reinstall and restores on the new install.
- [ ] AC3: Picking a random/invalid file shows an error and leaves data untouched.
- [ ] AC4: Cancelling the picker or the confirmation changes nothing.
- [ ] AC5: "Last backup" updates after sharing a backup.

## Out of scope
Automatic cloud sync, scheduled backups, merge-restore, encryption.

## Code map
`src/utils/backup.ts`, `src/store/index.tsx` (`restore`, `normalize`), `src/app/(tabs)/settings.tsx`, `app.json`
