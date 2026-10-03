import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useCategoryMap, useStore } from '../store';
import { useTheme } from '../theme';
import type { Expense } from '../types';
import { formatMoney } from '../utils/stats';

export function ExpenseRow({ expense }: { expense: Expense }) {
  const t = useTheme();
  const { state } = useStore();
  const cat = useCategoryMap().get(expense.categoryId);
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/expense/[id]', params: { id: expense.id } })}
      style={[styles.row, { backgroundColor: t.card, borderColor: t.border }]}>
      <View style={[styles.badge, { backgroundColor: (cat?.color ?? t.muted) + '26' }]}>
        <Text style={styles.icon}>{cat?.icon ?? '❔'}</Text>
      </View>
      <View style={styles.mid}>
        <Text style={[styles.title, { color: t.text }]} numberOfLines={1}>
          {expense.note || cat?.name || 'Unknown'}
        </Text>
        {expense.note ? <Text style={{ color: t.muted, fontSize: 12 }}>{cat?.name}</Text> : null}
      </View>
      <Text style={[styles.amount, { color: t.text }]}>{formatMoney(expense.amount, state.currency)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 8,
  },
  badge: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 20 },
  mid: { flex: 1, marginHorizontal: 12 },
  title: { fontSize: 15, fontWeight: '500' },
  amount: { fontSize: 15, fontWeight: '700' },
});
