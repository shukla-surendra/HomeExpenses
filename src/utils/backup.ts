import { normalize } from '../store';
import type { AppState } from '../types';
import { today } from './date';
import { pickTextFile, shareTextFile } from './files';

const APP_ID = 'home-expenses';

/** Writes a backup JSON to cache and opens the share sheet. */
export async function shareBackup(state: AppState): Promise<void> {
  const payload = { app: APP_ID, schema: 1, exportedAt: new Date().toISOString(), data: state };
  await shareTextFile(
    `home-expenses-backup-${today()}.json`,
    JSON.stringify(payload),
    'application/json',
    'public.json',
    'Save your Home Expenses backup'
  );
}

export type PickResult = { state: AppState } | { error: string } | null;

/** Lets the user pick a backup file; null when cancelled. Never mutates app data. */
export async function pickBackup(): Promise<PickResult> {
  try {
    const text = await pickTextFile();
    if (text === null) return null;
    const parsed = JSON.parse(text);
    if (parsed?.app !== APP_ID) return { error: 'This is not a Home Expenses backup file.' };
    if (parsed.schema !== 1) return { error: 'This backup was made by a newer version of the app.' };
    const state = normalize(parsed.data);
    return state ? { state } : { error: 'The backup file is damaged or incomplete.' };
  } catch {
    return { error: 'Could not read this file. Is it a Home Expenses backup (.json)?' };
  }
}
