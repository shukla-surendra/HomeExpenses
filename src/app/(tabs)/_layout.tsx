import { router, Tabs } from 'expo-router';
import { type ColorValue, Text } from 'react-native';
import { useTheme } from '../../theme';

const icon = (glyph: string) =>
  function TabIcon({ color }: { color: ColorValue }) {
    return <Text style={{ fontSize: 20, color }}>{glyph}</Text>;
  };

export default function TabsLayout() {
  const t = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: t.primary,
        tabBarInactiveTintColor: t.muted,
        tabBarStyle: { backgroundColor: t.card, borderTopColor: t.border },
        headerStyle: { backgroundColor: t.card },
        headerTintColor: t.text,
        sceneStyle: { backgroundColor: t.bg },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Dashboard', tabBarIcon: icon('📊') }} />
      <Tabs.Screen name="expenses" options={{ title: 'Expenses', tabBarIcon: icon('🧾') }} />
      <Tabs.Screen
        name="add"
        options={{ title: 'Add', tabBarIcon: icon('➕') }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push({ pathname: '/expense/[id]', params: { id: 'new' } });
          },
        }}
      />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: icon('⚙️') }} />
    </Tabs>
  );
}
