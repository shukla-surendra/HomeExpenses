import { useMemo, useState } from 'react';
import { SectionList, StyleSheet, Text, TextInput, View } from 'react-native';
import { CategoryPicker } from '../../components/CategoryPicker';
import { ExpenseRow } from '../../components/ExpenseRow';
import { MonthSwitcher } from '../../components/MonthSwitcher';
import { useCategoryMap, useStore } from '../../store';
import { useTheme } from '../../theme';
import { currentMonthKey, dayLabel } from '../../utils/date';
import { expensesInMonth, formatMoney, sum } from '../../utils/stats';

export default function Expenses() {
  const t = useTheme();
  const { state } = useStore();
  const cats = useCategoryMap();
  const [month, setMonth] = useState(currentMonthKey());
  const [cat, setCat] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const { sections, total } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = expensesInMonth(state.expenses, month).filter(
      (e) =>
        (!cat || e.categoryId === cat) &&
        (!q || e.note.toLowerCase().includes(q) || (cats.get(e.categoryId)?.name ?? '').toLowerCase().includes(q))
    );
    const days = new Map<string, typeof list>();
    for (const e of list) days.set(e.date, [...(days.get(e.date) ?? []), e]);
    const sections = [...days.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([date, data]) => ({
        date,
        subtotal: sum(data),
        data: data.sort((a, b) => b.createdAt - a.createdAt),
      }));
    return { sections, total: sum(list) };
  }, [state.expenses, month, cat, query, cats]);

  return (
    <SectionList
      sections={sections}
      keyExtractor={(e) => e.id}
      contentContainerStyle={styles.page}
      keyboardShouldPersistTaps="handled"
      stickySectionHeadersEnabled={false}
      ListHeaderComponent={
        <View>
          <MonthSwitcher value={month} onChange={setMonth} />
          <Text style={{ color: t.muted, marginBottom: 8 }}>
            Total {formatMoney(total, state.currency)}
            {cat || query ? ' (filtered)' : ''}
          </Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search notes or categories"
            placeholderTextColor={t.muted}
            style={[styles.search, { backgroundColor: t.card, borderColor: t.border, color: t.text }]}
          />
          <CategoryPicker allowAll value={cat} onChange={setCat} />
        </View>
      }
      renderSectionHeader={({ section }) => (
        <View style={styles.dayHead}>
          <Text style={{ color: t.muted, fontWeight: '600' }}>{dayLabel(section.date)}</Text>
          <Text style={{ color: t.muted }}>{formatMoney(section.subtotal, state.currency)}</Text>
        </View>
      )}
      renderItem={({ item }) => <ExpenseRow expense={item} />}
      ListEmptyComponent={
        <View style={{ alignItems: 'center', marginTop: 48 }}>
          <Text style={{ color: t.text, fontWeight: '600' }}>No expenses found</Text>
          <Text style={{ color: t.muted, marginTop: 4 }}>Try another month or clear the filters.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  page: { padding: 16, paddingBottom: 32 },
  search: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 8 },
  dayHead: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, marginBottom: 8 },
});
