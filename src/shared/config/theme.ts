import { useColorScheme } from 'nativewind';

import themeJson from './theme.json';

/**
 * Single source of truth for the app's palette. ThemeRoot turns the active scheme's solid colours
 * into CSS variables that the Tailwind classes read (see tailwind.config.js), while code that
 * needs a raw colour value (an SVG fill, a placeholder, a gradient stop) reads it from
 * useThemeColors(). Both come from this one file, so they never drift apart.
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
