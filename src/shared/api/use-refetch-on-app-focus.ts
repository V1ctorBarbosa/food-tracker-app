import { focusManager } from '@tanstack/react-query';
import { useEffect } from 'react';
import { AppState, Platform, type AppStateStatus } from 'react-native';

const ActiveAppState: AppStateStatus = 'active';

/**
 * Wires React Native's AppState into TanStack Query's focusManager, so queries
 * refetch when the app returns to the foreground -- mirroring the browser
 * window-focus refetch behavior TanStack Query assumes by default on web.
 */
export function useRefetchOnAppFocus(): void {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);
}

/** Pure decision logic, extracted so it can be unit tested without mounting a component. */
export function handleAppStateChange(status: AppStateStatus): void {
  if (Platform.OS === 'web') {
    return;
  }

  focusManager.setFocused(status === ActiveAppState);
}
