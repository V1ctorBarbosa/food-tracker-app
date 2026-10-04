import { useColorScheme, vars } from 'nativewind';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { theme } from '@/shared/config/theme';
import { buildThemeVariables } from '@/shared/lib/theme-variables';

const lightVariables = vars(buildThemeVariables(theme.light));
const darkVariables = vars(buildThemeVariables(theme.dark));

function pickThemeVariables(isNightMode: boolean) {
  if (isNightMode) {
    return darkVariables;
  }

  return lightVariables;
}

/**
 * Hands the active palette to every Tailwind colour class below it. The classes read CSS
 * variables, so swapping the variables here recolours the whole app at once.
 */
export function ThemeRoot({ children }: { children: ReactNode }) {
  const { colorScheme } = useColorScheme();
  const variables = pickThemeVariables(colorScheme === 'dark');

  return <View style={[{ flex: 1 }, variables]}>{children}</View>;
}
