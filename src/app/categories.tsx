import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { PALETTE } from '../store/defaults';
import { useStore } from '../store';
import { useTheme } from '../theme';

export default function Categories() {
  const t = useTheme();
  const { state, addCategory, updateCategory, deleteCategory } = useStore();
  const [editingId, setEditingId] = useState<string | 'new' | null>(null);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🏷️');
  const [color, setColor] = useState(PALETTE[0]);

  const open = (id: string | 'new') => {
    const c = state.categories.find((x) => x.id === id);
    setEditingId(id);
    setName(c?.name ?? '');
    setIcon(c?.icon ?? '🏷️');
    setColor(c?.color ?? PALETTE[0]);
  };

  const save = () => {
    const n = name.trim();
    if (!n) return Alert.alert('Name required');
    const dup = state.categories.some((c) => c.id !== editingId && c.name.toLowerCase() === n.toLowerCase());
    if (dup) return Alert.alert('Duplicate name', `A category named "${n}" already exists.`);
    const data = { name: n, icon: icon.trim() || '🏷️', color };
    if (editingId === 'new') addCategory(data);
    else if (editingId) updateCategory(editingId, data);
    setEditingId(null);
  };

  const remove = (id: string) => {
    if (!deleteCategory(id)) {
      Alert.alert('Category in use', 'Move or delete its expenses before deleting this category.');
      return;
    }
    setEditingId(null);
  };

  const input = { backgroundColor: t.card, borderColor: t.border, color: t.text };

  return (
    <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      {state.categories.map((c) => (
        <Pressable
          key={c.id}
          onPress={() => open(c.id)}
          style={[styles.row, { backgroundColor: t.card, borderColor: c.id === editingId ? t.primary : t.border }]}>
          <Text style={{ fontSize: 22 }}>{c.icon}</Text>
          <Text style={{ color: t.text, flex: 1, marginLeft: 12, fontSize: 16 }}>{c.name}</Text>
          <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: c.color }} />
        </Pressable>
      ))}

      {editingId === null ? (
        <Pressable onPress={() => open('new')} style={[styles.btn, { backgroundColor: t.primary }]}>
          <Text style={{ color: t.onPrimary, fontWeight: '700' }}>+ Add category</Text>
        </Pressable>
      ) : (
        <View style={[styles.form, { backgroundColor: t.card, borderColor: t.border }]}>
          <Text style={{ color: t.text, fontWeight: '700', marginBottom: 8 }}>
            {editingId === 'new' ? 'New category' : 'Edit category'}
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TextInput
              value={icon}
              onChangeText={setIcon}
              maxLength={4}
              style={[styles.field, input, { width: 64, textAlign: 'center', fontSize: 22 }]}
            />
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Name"
              placeholderTextColor={t.muted}
              style={[styles.field, input, { flex: 1 }]}
            />
          </View>
          <View style={styles.colors}>
            {PALETTE.map((p) => (
              <Pressable
                key={p}
                onPress={() => setColor(p)}
                style={[styles.swatch, { backgroundColor: p, borderWidth: color === p ? 3 : 0, borderColor: t.text }]}
              />
            ))}
          </View>
          <Pressable onPress={save} style={[styles.btn, { backgroundColor: t.primary }]}>
            <Text style={{ color: t.onPrimary, fontWeight: '700' }}>Save</Text>
          </Pressable>
          {editingId !== 'new' ? (
            <Pressable onPress={() => remove(editingId)} style={styles.btn}>
              <Text style={{ color: t.danger, fontWeight: '600' }}>Delete category</Text>
            </Pressable>
          ) : null}
          <Pressable onPress={() => setEditingId(null)} style={styles.btn}>
            <Text style={{ color: t.muted }}>Cancel</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 16, paddingBottom: 48 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  btn: { marginTop: 8, padding: 14, borderRadius: 12, alignItems: 'center' },
  form: { marginTop: 12, padding: 16, borderRadius: 16, borderWidth: StyleSheet.hairlineWidth },
  field: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 16 },
  colors: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginVertical: 14 },
  swatch: { width: 32, height: 32, borderRadius: 16 },
});
