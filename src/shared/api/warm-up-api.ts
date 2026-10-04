import { useEffect } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { apiBaseUrl } from '@/shared/config/api-config';

const HealthPath = '/health';
const ActiveAppState: AppStateStatus = 'active';

/**
 * Pings the API's public health route so an idle backend starts booting before the first real
 * request needs it. The response is irrelevant and a failure changes nothing: the requests that
 * follow report their own errors.
 */
export async function warmUpApi(baseUrl: string = apiBaseUrl): Promise<void> {
  try {
    await fetch(`${baseUrl}${HealthPath}`);
  } catch {
    // Intentionally ignored, see above.
  }
}

/** Pure decision logic, extracted so it can be unit tested without mounting a component. */
export function handleWarmUpAppState(status: AppStateStatus, warmUp: () => Promise<void> = warmUpApi): void {
  if (status !== ActiveAppState) {
    return;
  }

  void warmUp();
}

/** Warms the API when the app opens and again whenever it returns to the foreground after idling. */
export function useWarmUpApi(): void {
  useEffect(() => {
    void warmUpApi();

    const subscription = AppState.addEventListener('change', (status) => handleWarmUpAppState(status));
    return () => subscription.remove();
  }, []);
}
