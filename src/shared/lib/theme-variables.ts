const HexColorPattern = /^#([0-9a-fA-F]{6})$/;
const CssVariablePrefix = '--ft-';

/** "#274F8C" becomes "39 79 140", the channel form Tailwind needs to apply opacity modifiers. */
export function hexToRgbTriplet(hexColor: string): string {
  const match = HexColorPattern.exec(hexColor);

  if (match === null) {
    throw new Error(`Expected a 6-digit hex colour like #274F8C, got "${hexColor}".`);
  }

  const channels = [0, 2, 4].map((start) => parseInt(match[1].slice(start, start + 2), 16));

  return channels.join(' ');
}

/**
 * The CSS variable a palette key is exposed as: "caloriesDark" becomes "--ft-calories-dark".
 * tailwind.config.js applies the same rule, so the two stay in step.
 */
export function themeKeyToCssVariable(key: string): string {
  const kebabKey = key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

  return `${CssVariablePrefix}${kebabKey}`;
}

/**
 * One CSS variable per solid-colour palette entry. Translucent entries (rgba) are skipped: they
 * are read directly in styles and can't take part in Tailwind's opacity modifiers anyway.
 */
export function buildThemeVariables(palette: Record<string, string>): Record<string, string> {
  const variables: Record<string, string> = {};

  for (const [key, color] of Object.entries(palette)) {
    if (HexColorPattern.test(color)) {
      variables[themeKeyToCssVariable(key)] = hexToRgbTriplet(color);
    }
  }

  return variables;
}
