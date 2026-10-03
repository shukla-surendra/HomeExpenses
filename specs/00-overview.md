# 00 — Overview

Status: implemented (ACs pending on-device verification)

## Purpose
A simple mobile app (Android first, iOS from the same codebase) for a household to record
every expense and review where money goes.

## Users
One household. Single device, single profile, no accounts. Works fully offline.

## Principles
- Adding an expense takes under 10 seconds (amount → category → save).
- Data stays on the device; export is the backup path.
- Currency is a single global setting (default INR, symbol ₹).

## Tech decisions
- Expo (SDK 57) + React Native + TypeScript, Expo Router for navigation (`src/app/`).
- Persistence: AsyncStorage (JSON). Chosen over SQLite for Expo Go compatibility and because
  data volume (thousands of rows) is small. Revisit if >20k expenses.
- No backend, no auth in v1.

## Branding
- Logo: a house outline containing a rupee-coin, white on brand green `#2E7D32` (matches the app's primary colour).
- Sources live in `assets/logo/*.svg`; PNGs in `assets/` are generated from them (1024px icon/foreground/background/monochrome/splash, 48px favicon).
- Android adaptive icon: foreground artwork stays inside the central 66% safe zone; background is solid brand green; a monochrome layer supports themed icons.
- iOS icon is opaque (no transparency). Splash: rounded logo tile on white (light) / `#0F1113` (dark) via `expo-splash-screen` config; Expo Go shows the app icon instead, so check it in the installed build.
- App display name: "Home Expenses".

## Build & install
- Builds run in the cloud with EAS (no local Android SDK needed). Config: `eas.json`.
- `preview` profile → installable **APK** for personal devices (`npx eas-cli build -p android --profile preview`);
  install by opening the build's download link/QR on the phone and allowing "install unknown apps".
- `production` profile → Play Store AAB (not used yet). iOS needs an Apple Developer account ($99/yr); out of scope for now.
- Android package / iOS bundle id: `com.homeexpenses.app` (change in `app.json` before any store release; it cannot change afterwards).
- EAS installs with `npm ci`: keep `package-lock.json` in sync (run plain `npm install`, not `--legacy-peer-deps`) and keep `react-dom` pinned to the SDK's React version (`npx expo install react-dom`). Verify with `npm ci --dry-run` before building.
- Updating the app by installing a newer APK over the old one keeps its data; uninstalling does not (see spec 08).

## Screens
Tabs: **Dashboard**, **Expenses**, **Add** (modal), **Settings** (categories, budgets, CSV export/import, backup/restore).

## Out of scope (v1)
Multi-user/sync, receipts/photos, recurring expenses, multi-currency, income tracking.
