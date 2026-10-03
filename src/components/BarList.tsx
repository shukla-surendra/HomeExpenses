import { StyleSheet, Text, View } from 'react-native';
import { useCategoryMap, useStore } from '../store';
import { useTheme } from '../theme';
import { budgetFor, formatMoney } from '../utils/stats';

type Item = { categoryId: string; total: number };

export function BarList({ items }: { items: Item[] }) {
  const t = useTheme();
  const { state } = useStore();
  const cats = useCategoryMap();
  const grand = items.reduce((a, b) => a + b.total, 0);
  const max = items[0]?.total || 1;

  return (
    <View>
      {items.map((it) => {
        const c = cats.get(it.categoryId);
        const limit = budgetFor(state, it.categoryId);
        const over = limit !== undefined && it.total > limit;
        const pct = grand > 0 ? (it.total / grand) * 100 : 0;
        return (
          <View key={it.categoryId} style={styles.item}>
            <View style={styles.head}>
              <Text style={{ color: t.text, flex: 1 }}>
                {c?.icon} {c?.name ?? 'Unknown'}
              </Text>
              <Text style={{ color: over ? t.danger : t.text, fontWeight: '600' }}>
                {formatMoney(it.total, state.currency)}
              </Text>
              <Text style={{ color: t.muted, width: 48, textAlign: 'right' }}>{pct.toFixed(0)}%</Text>
            </View>
            <View style={[styles.track, { backgroundColor: t.track }]}>
              <View
                style={{
                  width: `${(it.total / max) * 100}%`,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: over ? t.danger : c?.color ?? t.primary,
                }}
              />
            </View>
            {limit !== undefined ? (
              <Text style={{ color: over ? t.danger : t.muted, fontSize: 11, marginTop: 2 }}>
                Budget {formatMoney(limit, state.currency)}
                {over ? ' — over' : ''}
              </Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  item: { marginBottom: 14 },
  head: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  track: { height: 8, borderRadius: 4, overflow: 'hidden' },
});
