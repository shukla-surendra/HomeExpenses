import DateTimePicker from '@react-native-community/datetimepicker';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { CategoryPicker } from '../../components/CategoryPicker';
import { useStore } from '../../store';
import { useTheme } from '../../theme';
import { parseDate, toDateString, today } from '../../utils/date';

const AMOUNT_RE = /^\d*\.?\d{0,2}$/;

export default function ExpenseForm() {
  const t = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, addExpense, updateExpense, deleteExpense } = useStore();
  const existing = id === 'new' ? undefined : state.expenses.find((e) => e.id === id);

  const [amount, setAmount] = useState(existing ? String(existing.amount) : '');
  const [categoryId, setCategoryId] = useState<string | null>(existing?.categoryId ?? null);
  const [date, setDate] = useState(existing?.date ?? today());
  const [note, setNote] = useState(existing?.note ?? '');
  const [showPicker, setShowPicker] = useState(false);
  const [touched, setTouched] = useState(false);

  const value = parseFloat(amount);
  const amountOk = Number.isFinite(value) && value > 0;
  const valid = amountOk && !!categoryId;

  const save = () => {
    if (!valid || !categoryId) return;
    const data = { amount: Math.round(value * 100) / 100, categoryId, date, note: note.trim() };
    if (existing) updateExpense(existing.id, data);
    else addExpense(data);
    router.back();
  };

  const remove = () =>
    Alert.alert('Delete expense?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          if (existing) deleteExpense(existing.id);
          router.back();
        },
      },
    ]);

  const input = { backgroundColor: t.card, borderColor: t.border, color: t.text };

  return (
    <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: existing ? 'Edit expense' : 'New expense' }} />

      <Text style={[styles.label, { color: t.muted }]}>Amount ({state.currency})</Text>
      <TextInput
        autoFocus={!existing}
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={(v) => AMOUNT_RE.test(v) && setAmount(v)}
        onBlur={() => setTouched(true)}
        placeholder="0"
        placeholderTextColor={t.muted}
        style={[styles.amount, input]}
      />
      {touched && !amountOk ? <Text style={{ color: t.danger }}>Enter an amount greater than 0</Text> : null}

      <Text style={[styles.label, { color: t.muted }]}>Category</Text>
      <View style={styles.wrap}>
        <CategoryPicker wrap value={categoryId} onChange={setCategoryId} />
      </View>

      <Text style={[styles.label, { color: t.muted }]}>Date</Text>
      <Pressable onPress={() => setShowPicker(true)} style={[styles.field, input]}>
        <Text style={{ color: t.text }}>{parseDate(date).toDateString()}</Text>
      </Pressable>
      {showPicker ? (
        <DateTimePicker
          value={parseDate(date)}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(_, d) => {
            setShowPicker(Platform.OS === 'ios');
            if (d) setDate(toDateString(d));
          }}
        />
      ) : null}

      <Text style={[styles.label, { color: t.muted }]}>Note (optional)</Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="e.g. Vegetables from market"
        placeholderTextColor={t.muted}
        style={[styles.field, input]}
      />

      <Pressable
        onPress={save}
        disabled={!valid}
        style={[styles.btn, { backgroundColor: valid ? t.primary : t.border }]}>
        <Text style={{ color: valid ? t.onPrimary : t.muted, fontWeight: '700', fontSize: 16 }}>Save</Text>
      </Pressable>

      {existing ? (
        <Pressable onPress={remove} style={[styles.btn, { backgroundColor: 'transparent' }]}>
          <Text style={{ color: t.danger, fontWeight: '600' }}>Delete expense</Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 16, paddingBottom: 48 },
  label: { marginTop: 16, marginBottom: 6, fontSize: 13, fontWeight: '600' },
  amount: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 32, fontWeight: '700' },
  field: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 16 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  btn: { marginTop: 24, padding: 16, borderRadius: 12, alignItems: 'center' },
});
