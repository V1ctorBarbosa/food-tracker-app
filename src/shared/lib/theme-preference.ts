export type ThemePreference = 'system' | 'light' | 'dark';

export type ColorSchemeName = 'light' | 'dark';

/** Until the user picks one, the app follows the phone's own light or dark setting. */
export const DefaultThemePreference: ThemePreference = 'system';

/** Reads a stored preference, falling back to the default for a missing or unrecognised value. */
export function parseThemePreference(storedValue: string | null): ThemePreference {
  if (storedValue === 'system' || storedValue === 'light' || storedValue === 'dark') {
    return storedValue;
  }

  return DefaultThemePreference;
}

/**
 * What flipping the night-mode switch chooses: always the opposite of what is on screen right
 * now, as an explicit choice, so the first tap works the same whether the phone was light or dark.
 */
export function nextThemePreference(currentScheme: ColorSchemeName | undefined): ThemePreference {
  if (currentScheme === 'dark') {
    return 'light';
  }

  return 'dark';
}
