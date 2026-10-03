import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useStore } from '../../store';
import { useTheme } from '../../theme';
import { pickBackup, shareBackup } from '../../utils/backup';
import { expensesToCsv } from '../../utils/csv';
import { pickTextFile, shareTextFile } from '../../utils/files';
import { planImport } from '../../utils/importCsv';
import { today } from '../../utils/date';

export default function Settings() {
  const t = useTheme();
  const { state, setCurrency, clearAll, restore, markBackedUp, applyImport } = useStore();

  const exportCsv = async () => {
    if (state.expenses.length === 0) return Alert.alert('Nothing to export', 'Add some expenses first.');
    try {
      await shareTextFile(
        `home-expenses-${today()}.csv`,
        expensesToCsv(state),
        'text/csv',
        'public.comma-separated-values-text',
        'Export expenses'
      );
    } catch (e) {
      Alert.alert('Export failed', e instanceof Error ? e.message : 'Something went wrong.');
    }
  };

  const importCsv = async () => {
    let text: string | null;
    try {
      text = await pickTextFile();
    } catch {
      return Alert.alert('Cannot import', 'Could not read this file.');
    }
    if (text === null) return;
    const plan = planImport(text, state);
    if ('error' in plan) return Alert.alert('Cannot import', plan.error);
    const skipped = `${plan.duplicates} duplicate(s) and ${plan.invalid} invalid row(s) skipped.`;
    if (plan.expenses.length === 0) return Alert.alert('Nothing to import', skipped);
    const cats = plan.newCategories.length ? ` (${plan.newCategories.length} new categories)` : '';
    Alert.alert('Import expenses?', `Import ${plan.expenses.length} expenses${cats}? ${skipped}`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Import',
        onPress: () => {
          applyImport(plan.expenses, plan.newCategories);
          Alert.alert('Import complete', `Added ${plan.expenses.length} expenses.`);
        },
      },
    ]);
  };

  const backup = async () => {
    try {
      await shareBackup(state);
      markBackedUp();
    } catch (e) {
      Alert.alert('Backup failed', e instanceof Error ? e.message : 'Something went wrong.');
    }
  };

  const restoreFromFile = async () => {
    const picked = await pickBackup();
    if (!picked) return;
    if ('error' in picked) return Alert.alert('Cannot restore', picked.error);
    Alert.alert(
      'Restore backup?',
      `Replace current data (${state.expenses.length} expenses) with backup (${picked.state.expenses.length} expenses)? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Replace', style: 'destructive', onPress: () => restore(picked.state) },
      ]
    );
  };

  const [now] = useState(() => Date.now());
  const STALE_MS = 30 * 24 * 3600 * 1000;
  const stale = !state.lastBackupAt || now - state.lastBackupAt > STALE_MS;

  const confirmClear = () =>
    Alert.alert('Clear all data?', 'All expenses, budgets and custom categories will be deleted.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear everything', style: 'destructive', onPress: clearAll },
    ]);

  const item = (label: string, onPress: () => void, color = t.text) => (
    <Pressable onPress={onPress} style={[styles.row, { backgroundColor: t.card, borderColor: t.border }]}>
      <Text style={{ color, fontSize: 16 }}>{label}</Text>
      <Text style={{ color: t.muted }}>›</Text>
    </Pressable>
  );

  return (
    <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      {item('🏷️  Categories', () => router.push('/categories'))}
      {item('🎯  Budgets', () => router.push('/budgets'))}
      {item('📤  Export CSV (spreadsheet)', exportCsv)}
      {item('📥  Import CSV', importCsv)}

      <View style={{ height: 16 }} />
      {item('💾  Backup data', backup)}
      <Text style={{ color: stale ? t.danger : t.muted, marginBottom: 8, marginLeft: 4, fontSize: 12 }}>
        Last backup: {state.lastBackupAt ? new Date(state.lastBackupAt).toLocaleDateString() : 'Never'}
        {stale ? ' — back up before uninstalling' : ''}
      </Text>
      {item('♻️  Restore from backup', restoreFromFile)}
      <View style={{ height: 16 }} />

      <View style={[styles.row, { backgroundColor: t.card, borderColor: t.border }]}>
        <Text style={{ color: t.text, fontSize: 16 }}>Currency symbol</Text>
        <TextInput
          value={state.currency}
          onChangeText={(v) => setCurrency(v.slice(0, 4))}
          style={{ color: t.text, fontSize: 16, minWidth: 50, textAlign: 'right' }}
        />
      </View>

      <View style={{ height: 24 }} />
      {item('🗑️  Clear all data', confirmClear, t.danger)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 8,
  },
});
