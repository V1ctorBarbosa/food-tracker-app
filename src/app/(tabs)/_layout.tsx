import { Redirect, Tabs } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useProfileQuery } from '@/entities/profile';
import { useSession } from '@/entities/session';
import { useAuthErrorRecovery } from '@/features/auth';
import { AnimatedTabBar } from '@/shared/ui/AnimatedTabBar';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { LoadingBar } from '@/shared/ui/LoadingBar';

export default function TabsLayout() {
  const session = useSession();
  const profileQuery = useProfileQuery();
  const authErrorRecovery = useAuthErrorRecovery(profileQuery.error);

  if (session.status === 'loading' || (session.status === 'signed-in' && profileQuery.isPending)) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-ft-bg">
        <LoadingBar />
      </SafeAreaView>
    );
  }

  if (session.status === 'signed-out') {
    return <Redirect href="/sign-in" />;
  }

  if (profileQuery.isError) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-ft-bg px-7">
        <ErrorMessage message={authErrorRecovery.isRecovering ? authErrorRecovery.message : undefined} />
      </SafeAreaView>
    );
  }

  if (profileQuery.data === null) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <Tabs tabBar={(tabBarProps) => <AnimatedTabBar {...tabBarProps} />} screenOptions={{ headerShown: false, animation: 'shift' }}>
      <Tabs.Screen
        name="today"
        options={{ title: 'Hoje', tabBarIcon: ({ color }) => <View className="h-4 w-4 rounded-[3px]" style={{ backgroundColor: color }} /> }}
      />
      <Tabs.Screen
        name="log"
        options={{ title: 'Registrar', tabBarIcon: ({ color }) => <View className="h-4 w-4 rounded-full" style={{ backgroundColor: color }} /> }}
      />
      <Tabs.Screen
        name="charts"
        options={{
          title: 'Gráficos',
          tabBarIcon: ({ color }) => <View className="h-4 w-4 rotate-45" style={{ backgroundColor: color }} />,
        }}
      />
      <Tabs.Screen
        name="you"
        options={{
          title: 'Você',
          tabBarIcon: ({ color }) => <View className="h-4 w-4 rounded-b-[3px] rounded-t-full" style={{ backgroundColor: color }} />,
        }}
      />
    </Tabs>
  );
}
