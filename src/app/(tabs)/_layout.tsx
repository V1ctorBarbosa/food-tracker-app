import { Redirect, Tabs } from 'expo-router';
import { View } from 'react-native';

import { useSession } from '@/entities/session';

const ActiveColor = '#274F8C';
const InactiveColor = '#B9C0CE';

export default function TabsLayout() {
  const session = useSession();

  if (session.status === 'loading') {
    return null;
  }

  if (session.status === 'signed-out') {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ActiveColor,
        tabBarInactiveTintColor: InactiveColor,
        tabBarStyle: { backgroundColor: '#F2F1F8', borderTopColor: '#DCD8E6' },
        tabBarLabelStyle: { fontFamily: 'Archivo_700Bold', fontSize: 9, letterSpacing: 1, textTransform: 'uppercase' },
      }}>
      <Tabs.Screen
        name="today"
        options={{ title: 'Today', tabBarIcon: ({ color }) => <View className="h-4 w-4 rounded-[3px]" style={{ backgroundColor: color }} /> }}
      />
      <Tabs.Screen
        name="log"
        options={{ title: 'Log', tabBarIcon: ({ color }) => <View className="h-4 w-4 rounded-full" style={{ backgroundColor: color }} /> }}
      />
      <Tabs.Screen
        name="charts"
        options={{
          title: 'Charts',
          tabBarIcon: ({ color }) => <View className="h-4 w-4 rotate-45" style={{ backgroundColor: color }} />,
        }}
      />
      <Tabs.Screen
        name="you"
        options={{
          title: 'You',
          tabBarIcon: ({ color }) => <View className="h-4 w-4 rounded-b-[3px] rounded-t-full" style={{ backgroundColor: color }} />,
        }}
      />
    </Tabs>
  );
}
