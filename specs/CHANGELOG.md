# Spec changelog

Newest first. One line per spec change: date — spec — change — why.

- 2026-10-02 — 00 — Build note: lockfile must satisfy `npm ci`; pinned react-dom — first EAS build failed in Install dependencies.
- 2026-10-02 — 00 — Added Branding section: house + coin logo, asset sizes and adaptive-icon rules — user request.
- 2026-10-02 — 00 — Documented EAS build/install flow (preview APK) and added eas.json — user wants app on phone.
- 2026-10-02 — 09 — New spec: CSV import (additive, dedupe, auto-create categories) — user request for import/export.
- 2026-10-02 — 07 — CSV export now shares a .csv file instead of text — pairs with import and spreadsheets.
- 2026-10-02 — 08 — New spec: JSON backup/restore via share sheet + file picker, so data survives uninstall — user request.
- 2026-10-02 — 01 — Merge new default categories into existing installs via `defaultsVersion` — new defaults weren't showing for already-installed app.
- 2026-10-02 — 01 — Added default categories Milk, Recharge & Subscriptions, Clothes (10 → 13) — user request.
- 2026-10-02 — 07 — Export shares CSV as text via RN Share (no file attachment) — avoids unverified expo-file-system API for v1.
- 2026-10-02 — all — ACs reset to unchecked until verified on an Android device/emulator — they were ticked before verification.
- 2026-10-02 — 00–07 — Initial specs for v1 (expense entry, list, dashboard, categories, budgets, export) — project kickoff.
