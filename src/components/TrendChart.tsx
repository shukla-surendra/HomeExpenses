import { StyleSheet, Text, View } from 'react-native';
import { useStore } from '../store';
import { useTheme } from '../theme';
import { monthShort } from '../utils/date';
import { formatMoney } from '../utils/stats';

export function TrendChart({ data, selected }: { data: { key: string; total: number }[]; selected: string }) {
  const t = useTheme();
  const { state } = useStore();
  const max = Math.max(...data.map((d) => d.total), 1);
  return (
    <View style={styles.row}>
      {data.map((d) => {
        const active = d.key === selected;
        return (
          <View key={d.key} style={styles.col}>
            <Text style={{ color: t.muted, fontSize: 10 }} numberOfLines={1}>
              {d.total > 0 ? formatMoney(d.total, state.currency) : ''}
            </Text>
            <View style={styles.barBox}>
              <View
                style={{
                  height: `${(d.total / max) * 100}%`,
                  minHeight: d.total > 0 ? 3 : 0,
                  backgroundColor: active ? t.primary : t.track,
                  borderRadius: 4,
                }}
              />
            </View>
            <Text style={{ color: active ? t.text : t.muted, fontSize: 12, fontWeight: active ? '700' : '400' }}>
              {monthShort(d.key)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', height: 150, gap: 8 },
  col: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  barBox: { flex: 1, width: '70%', justifyContent: 'flex-end', marginVertical: 4 },
});
