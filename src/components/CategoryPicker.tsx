import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { useStore } from '../store';
import { useTheme } from '../theme';

type Props = {
  value: string | null;
  onChange: (id: string | null) => void;
  /** Adds an "All" chip that maps to null (used for filtering). */
  allowAll?: boolean;
  wrap?: boolean;
};

export function CategoryPicker({ value, onChange, allowAll, wrap }: Props) {
  const t = useTheme();
  const { state } = useStore();
  const chip = (id: string | null, label: string, color: string) => {
    const active = value === id;
    return (
      <Pressable
        key={id ?? 'all'}
        onPress={() => onChange(id)}
        style={[
          styles.chip,
          { borderColor: active ? color : t.border, backgroundColor: active ? color + '26' : t.card },
        ]}>
        <Text style={{ color: t.text, fontWeight: active ? '700' : '400' }}>{label}</Text>
      </Pressable>
    );
  };
  const chips = [
    allowAll ? chip(null, 'All', t.primary) : null,
    ...state.categories.map((c) => chip(c.id, `${c.icon} ${c.name}`, c.color)),
  ];
  if (wrap) return <>{chips}</>;
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      {chips}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { gap: 8, paddingVertical: 4 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 0 },
});
