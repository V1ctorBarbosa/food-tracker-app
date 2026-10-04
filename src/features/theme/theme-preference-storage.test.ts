import AsyncStorage from '@react-native-async-storage/async-storage';

import { loadThemePreference, saveThemePreference, ThemePreferenceStorageKey } from './theme-preference-storage';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('theme preference storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  test('defaults to following the phone when nothing was saved', async () => {
    expect(await loadThemePreference()).toBe('system');
  });

  test('returns what was saved', async () => {
    await saveThemePreference('dark');

    expect(await loadThemePreference()).toBe('dark');
  });

  test('saves under the documented key', async () => {
    await saveThemePreference('light');

    expect(await AsyncStorage.getItem(ThemePreferenceStorageKey)).toBe('light');
  });

  test('falls back to the default for a corrupted value', async () => {
    await AsyncStorage.setItem(ThemePreferenceStorageKey, 'purple');

    expect(await loadThemePreference()).toBe('system');
  });

  test('falls back to the default when storage cannot be read', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('storage unavailable'));

    expect(await loadThemePreference()).toBe('system');
  });
});
