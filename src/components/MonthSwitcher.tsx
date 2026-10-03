import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';
import { currentMonthKey, monthLabel, shiftMonth } from '../utils/date';

export function MonthSwitcher({ value, onChange }: { value: string; onChange: (k: string) => void }) {
  const t = useTheme();
  const atCurrent = value >= currentMonthKey();
  return (
    <View style={styles.row}>
      <Pressable accessibilityLabel="Previous month" hitSlop={12} onPress={() => onChange(shiftMonth(value, -1))}>
        <Text style={[styles.arrow, { color: t.primary }]}>‹</Text>
      </Pressable>
      <Text style={[styles.label, { color: t.text }]}>{monthLabel(value)}</Text>
      <Pressable
        accessibilityLabel="Next month"
        hitSlop={12}
        disabled={atCurrent}
        onPress={() => onChange(shiftMonth(value, 1))}>
        <Text style={[styles.arrow, { color: atCurrent ? t.border : t.primary }]}>›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  arrow: { fontSize: 32, paddingHorizontal: 12, lineHeight: 36 },
  label: { fontSize: 18, fontWeight: '600' },
});
