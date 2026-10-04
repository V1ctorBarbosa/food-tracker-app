import AsyncStorage from '@react-native-async-storage/async-storage';

import { DefaultThemePreference, parseThemePreference, type ThemePreference } from '@/shared/lib/theme-preference';

export const ThemePreferenceStorageKey = 'food-track.theme-preference';

export async function loadThemePreference(): Promise<ThemePreference> {
  try {
    return parseThemePreference(await AsyncStorage.getItem(ThemePreferenceStorageKey));
  } catch {
    // The app waits for this before it shows anything; unreadable storage must not block launch.
    return DefaultThemePreference;
  }
}

export async function saveThemePreference(preference: ThemePreference): Promise<void> {
  await AsyncStorage.setItem(ThemePreferenceStorageKey, preference);
}
