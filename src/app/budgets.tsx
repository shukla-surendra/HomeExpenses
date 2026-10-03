import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useStore } from '../store';
import { useTheme } from '../theme';
import { budgetFor } from '../utils/stats';

function LimitRow({ id, label }: { id: string | 'total'; label: string }) {
  const t = useTheme();
  const store = useStore();
  const current = budgetFor(store.state, id);
  const [text, setText] = useState(current ? String(current) : '');

  return (
    <View style={[styles.row, { backgroundColor: t.card, borderColor: t.border }]}>
      <Text style={{ color: t.text, flex: 1, fontSize: 16 }}>{label}</Text>
      <Text style={{ color: t.muted }}>{store.state.currency}</Text>
      <TextInput
        value={text}
        keyboardType="decimal-pad"
        placeholder="No limit"
        placeholderTextColor={t.muted}
        onChangeText={(v) => /^\d*\.?\d{0,2}$/.test(v) && setText(v)}
        onEndEditing={() => store.setBudget(id, parseFloat(text) || 0)}
        style={[styles.input, { color: t.text, borderColor: t.border }]}
      />
    </View>
  );
}

export default function Budgets() {
  const t = useTheme();
  const { state } = useStore();
  return (
    <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      <Text style={{ color: t.muted, marginBottom: 12 }}>
        Monthly limits apply to every month. Leave blank to remove a limit.
      </Text>
      <LimitRow id="total" label="Overall budget" />
      <Text style={[styles.h, { color: t.muted }]}>Per category</Text>
      {state.categories.map((c) => (
        <LimitRow key={c.id} id={c.id} label={`${c.icon} ${c.name}`} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 16, paddingBottom: 48 },
  h: { marginTop: 16, marginBottom: 8, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 8, gap: 8 },
  input: { borderBottomWidth: 1, minWidth: 90, textAlign: 'right', fontSize: 16, paddingVertical: 4 },
});
