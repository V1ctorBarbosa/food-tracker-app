// Colours are CSS variables, not fixed hex: ThemeRoot (src/shared/ui/ThemeRoot.tsx) sets them from
// the light or dark palette in src/shared/config/theme.json, so one class works in both schemes.
// The channel form "rgb(var(--x) / <alpha-value>)" keeps opacity modifiers like bg-ft-carbs/30 working.
// A palette key maps to its variable the same way themeKeyToCssVariable() does:
// caloriesDark -> --ft-calories-dark.
const cssVariable = (paletteKey) => `--ft-${paletteKey.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;
const color = (paletteKey) => `rgb(var(${cssVariable(paletteKey)}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        display: ['ArchivoBlack_400Regular'],
        body: ['Archivo_400Regular'],
        'body-medium': ['Archivo_500Medium'],
        'body-semibold': ['Archivo_600SemiBold'],
        'body-bold': ['Archivo_700Bold'],
      },
      colors: {
        'ft-bg': color('background'),
        'ft-card': color('card'),
        'ft-ink': color('ink'),
        'ft-calories': color('calories'),
        'ft-calories-dark': color('caloriesDark'),
        'ft-calories-ink': color('caloriesInk'),
        'ft-protein': color('protein'),
        'ft-protein-ink': color('proteinInk'),
        'ft-carbs': color('carbs'),
        'ft-carbs-ink': color('carbsInk'),
        'ft-fat': color('fat'),
        'ft-fat-ink': color('fatInk'),
        'ft-water': color('water'),
        'ft-water-dark': color('waterDark'),
        'ft-weight': color('weight'),
        'ft-weight-ink': color('weightInk'),
        'ft-muted': color('textMuted'),
        'ft-muted-2': color('textMuted2'),
        'ft-muted-3': color('textMuted3'),
        'ft-hair-strong': color('hairStrong'),
      },
    },
  },
  plugins: [],
};
