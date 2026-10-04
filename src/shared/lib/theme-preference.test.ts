import { DefaultThemePreference, nextThemePreference, parseThemePreference } from './theme-preference';

describe('parseThemePreference', () => {
  test.each([['system'], ['light'], ['dark']] as const)('keeps the stored value %p', (storedValue) => {
    expect(parseThemePreference(storedValue)).toBe(storedValue);
  });

  test.each([[null], [''], ['night'], ['DARK'], ['true']])('falls back to the default for %p', (storedValue) => {
    expect(parseThemePreference(storedValue)).toBe(DefaultThemePreference);
  });

  test('the default follows the phone', () => {
    expect(DefaultThemePreference).toBe('system');
  });
});

describe('nextThemePreference', () => {
  test('switches a dark screen to an explicit light choice', () => {
    expect(nextThemePreference('dark')).toBe('light');
  });

  test('switches a light screen to an explicit dark choice', () => {
    expect(nextThemePreference('light')).toBe('dark');
  });

  test('chooses dark when the current scheme is not known yet', () => {
    expect(nextThemePreference(undefined)).toBe('dark');
  });
});
