import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarList } from '../../components/BarList';
import { ExpenseRow } from '../../components/ExpenseRow';
import { MonthSwitcher } from '../../components/MonthSwitcher';
import { TrendChart } from '../../components/TrendChart';
import { useStore } from '../../store';
import { useTheme } from '../../theme';
import { currentMonthKey, shiftMonth } from '../../utils/date';
import { budgetFor, byCategory, delta, expensesInMonth, formatMoney, sum, trend } from '../../utils/stats';

export default function Dashboard() {
  const t = useTheme();
  const { state } = useStore();
  const [month, setMonth] = useState(currentMonthKey());

  const { list, total, cats, series, change, recent } = useMemo(() => {
    const list = expensesInMonth(state.expenses, month);
    const total = sum(list);
    const prev = sum(expensesInMonth(state.expenses, shiftMonth(month, -1)));
    return {
      list,
      total,
      cats: byCategory(list),
      series: trend(state.expenses, month),
      change: delta(total, prev),
      recent: [...list].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt).slice(0, 3),
    };
  }, [state.expenses, month]);

  const limit = budgetFor(state, 'total');
  const over = limit !== undefined && total > limit;
  const card = { backgroundColor: t.card, borderColor: t.border };

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <MonthSwitcher value={month} onChange={setMonth} />

      <View style={[styles.card, card]}>
        <Text style={{ color: t.muted }}>Total spent</Text>
        <Text style={[styles.total, { color: t.text }]}>{formatMoney(total, state.currency)}</Text>
        {change !== null ? (
          <Text style={{ color: change > 0 ? t.danger : t.primary, fontWeight: '600' }}>
            {change > 0 ? '▲' : '▼'} {Math.abs(change).toFixed(0)}% vs last month
          </Text>
        ) : null}
        {limit !== undefined ? (
          <View style={{ marginTop: 12 }}>
            <View style={[styles.track, { backgroundColor: t.track }]}>
              <View
                style={{
                  width: `${Math.min(100, (total / limit) * 100)}%`,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: over ? t.danger : t.primary,
                }}
              />
            </View>
            <Text style={{ color: over ? t.danger : t.muted, marginTop: 4, fontSize: 12 }}>
              {formatMoney(total, state.currency)} of {formatMoney(limit, state.currency)} budget (
              {((total / limit) * 100).toFixed(0)}%)
            </Text>
          </View>
        ) : null}
      </View>

      {list.length === 0 ? (
        <View style={[styles.card, card, { alignItems: 'center' }]}>
          <Text style={{ color: t.text, fontSize: 16, fontWeight: '600' }}>No expenses this month</Text>
          <Text style={{ color: t.muted, marginTop: 4 }}>Tap ➕ Add to record your first one.</Text>
        </View>
      ) : (
        <>
          <Text style={[styles.h, { color: t.text }]}>By category</Text>
          <View style={[styles.card, card]}>
            <BarList items={cats} />
          </View>

          <Text style={[styles.h, { color: t.text }]}>Last 6 months</Text>
          <View style={[styles.card, card]}>
            <TrendChart data={series} selected={month} />
          </View>

          <View style={styles.rowBetween}>
            <Text style={[styles.h, { color: t.text }]}>Recent</Text>
            <Pressable onPress={() => router.navigate('/expenses')}>
              <Text style={{ color: t.primary, fontWeight: '600' }}>See all</Text>
            </Pressable>
          </View>
          {recent.map((e) => (
            <ExpenseRow key={e.id} expense={e} />
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 16, paddingBottom: 32 },
  card: { borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, padding: 16, marginBottom: 16 },
  total: { fontSize: 36, fontWeight: '800', marginVertical: 4 },
  track: { height: 10, borderRadius: 5, overflow: 'hidden' },
  h: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
