import { useColorScheme } from 'nativewind';

import themeJson from './theme.json';

/**
 * Single source of truth for the app's palette -- also read directly (via require, since it's
 * JSON) by tailwind.config.js, so Tailwind class colors and these raw values never drift apart.
 *
 * `dark` is currently just a copy of `light`: no dark palette has been designed yet. When one
 * is, only this file changes -- every consumer (Tailwind classes and useThemeColors() call
 * sites) picks it up automatically.
 */
export const theme = themeJson;

export type ThemeColors = typeof themeJson.light;

/** The 5 metric colors used for the sign-in stripe and the loading indicator, in a fixed order. */
export const brandStripeColors: readonly string[] = [
  theme.light.calories,
  theme.light.protein,
  theme.light.carbs,
  theme.light.fat,
  theme.light.weight,
];

export function useThemeColors(): ThemeColors {
  const { colorScheme } = useColorScheme();
  return colorScheme === 'dark' ? theme.dark : theme.light;
}
