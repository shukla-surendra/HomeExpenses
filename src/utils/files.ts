import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

/** Writes `content` to the cache dir and opens the OS share sheet for it. */
export async function shareTextFile(name: string, content: string, mimeType: string, UTI: string, dialogTitle: string) {
  if (!(await Sharing.isAvailableAsync())) throw new Error('Sharing is not available on this device.');
  const file = new File(Paths.cache, name);
  if (file.exists) file.delete();
  file.create();
  file.write(content);
  await Sharing.shareAsync(file.uri, { mimeType, dialogTitle, UTI });
}

/** Opens the file picker; returns the file's text, or null if cancelled. Throws if unreadable. */
export async function pickTextFile(): Promise<string | null> {
  const res = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });
  if (res.canceled || !res.assets?.[0]) return null;
  return new File(res.assets[0].uri).text();
}
