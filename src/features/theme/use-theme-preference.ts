import { colorScheme, useColorScheme } from 'nativewind';
import { useCallback, useEffect, useState } from 'react';

import { nextThemePreference } from '@/shared/lib/theme-preference';

import { loadThemePreference, saveThemePreference } from './theme-preference-storage';

/**
 * Applies the saved theme preference and reports when it has been applied, so the app can hold
 * the splash screen until then and never flash the wrong palette.
 */
export function useThemeBootstrap(): boolean {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let wasCancelled = false;

    loadThemePreference().then((preference) => {
      if (wasCancelled) {
        return;
      }

      colorScheme.set(preference);
      setIsReady(true);
    });

    return () => {
      wasCancelled = true;
    };
  }, []);

  return isReady;
}

export function useNightMode(): { isNightMode: boolean; toggleNightMode: () => void } {
  const { colorScheme: currentScheme } = useColorScheme();

  const toggleNightMode = useCallback(() => {
    const nextPreference = nextThemePreference(currentScheme);

    colorScheme.set(nextPreference);
    saveThemePreference(nextPreference).catch(() => {
      // The new theme is already on screen; failing to remember it only costs the next launch.
    });
  }, [currentScheme]);

  return { isNightMode: currentScheme === 'dark', toggleNightMode };
}
