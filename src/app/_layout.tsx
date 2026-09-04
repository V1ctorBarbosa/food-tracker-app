import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { useSession } from '@/entities/session';
import { queryClient } from '@/shared/api/query-client';
import { useRefetchOnAppFocus } from '@/shared/api/use-refetch-on-app-focus';

import '@/global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const session = useSession();
  useRefetchOnAppFocus();

  useEffect(() => {
    if (session.status !== 'loading') {
      SplashScreen.hideAsync();
    }
  }, [session.status]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
