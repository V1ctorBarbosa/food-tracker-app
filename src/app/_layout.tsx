import {
  Archivo_400Regular,
  Archivo_500Medium,
  Archivo_600SemiBold,
  Archivo_700Bold,
} from '@expo-google-fonts/archivo';
import { ArchivoBlack_400Regular } from '@expo-google-fonts/archivo-black';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SelectedDayProvider } from '@/entities/selected-day';
import { useSession } from '@/entities/session';
import { useThemeBootstrap } from '@/features/theme';
import { queryClient } from '@/shared/api/query-client';
import { useRefetchOnAppFocus } from '@/shared/api/use-refetch-on-app-focus';
import { theme } from '@/shared/config/theme';
import { withAppPalette } from '@/shared/lib/navigation-theme';
import { ThemeRoot } from '@/shared/ui/ThemeRoot';

import '@/global.css';

SplashScreen.preventAutoHideAsync();

const lightNavigationTheme = withAppPalette(DefaultTheme, theme.light);
const darkNavigationTheme = withAppPalette(DarkTheme, theme.dark);

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const session = useSession();
  const isThemeReady = useThemeBootstrap();
  const [fontsLoaded] = useFonts({
    Archivo_400Regular,
    Archivo_500Medium,
    Archivo_600SemiBold,
    Archivo_700Bold,
    ArchivoBlack_400Regular,
  });
  useRefetchOnAppFocus();

  const isReady = fontsLoaded && isThemeReady && session.status !== 'loading';

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  const isNightMode = colorScheme === 'dark';
  let navigationTheme = lightNavigationTheme;
  let statusBarStyle: 'light' | 'dark' = 'dark';
  if (isNightMode) {
    navigationTheme = darkNavigationTheme;
    statusBarStyle = 'light';
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SelectedDayProvider>
          <ThemeRoot>
            <ThemeProvider value={navigationTheme}>
              <StatusBar style={statusBarStyle} />
              <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
                <Stack.Screen name="index" options={{ animation: 'fade' }} />
                <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
                <Stack.Screen name="sign-in" options={{ animation: 'fade' }} />
                <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
                <Stack.Screen name="add-food" options={{ animation: 'slide_from_bottom' }} />
                <Stack.Screen
                  name="day-picker"
                  options={{ presentation: 'transparentModal', animation: 'none', contentStyle: { backgroundColor: 'transparent' } }}
                />
              </Stack>
            </ThemeProvider>
          </ThemeRoot>
        </SelectedDayProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
