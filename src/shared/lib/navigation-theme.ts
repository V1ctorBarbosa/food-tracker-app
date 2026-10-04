type NavigationColorKey = 'background' | 'card' | 'text' | 'border' | 'primary';

type AppPalette = { background: string; card: string; ink: string; tabBarBorder: string; calories: string };

/**
 * Paints the navigator's own colours with the app palette. Without this, the screen behind a
 * transition shows the navigator's default white or black instead of the app background.
 */
export function withAppPalette<TNavigationTheme extends { colors: Record<NavigationColorKey, unknown> }>(
  baseTheme: TNavigationTheme,
  palette: AppPalette,
): TNavigationTheme {
  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      background: palette.background,
      card: palette.card,
      text: palette.ink,
      border: palette.tabBarBorder,
      primary: palette.calories,
    },
  };
}
