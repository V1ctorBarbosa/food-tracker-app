const theme = require('./src/shared/config/theme.json');

// Tailwind class colors are static at build time, so they always reflect the light palette for
// now. theme.light and theme.dark are identical until a real dark palette is designed -- see
// src/shared/config/theme.ts for the runtime useThemeColors() hook that will pick between them.
const colors = theme.light;

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
        'ft-bg': colors.background,
        'ft-card': colors.card,
        'ft-calories': colors.calories,
        'ft-calories-dark': colors.caloriesDark,
        'ft-protein': colors.protein,
        'ft-carbs': colors.carbs,
        'ft-fat': colors.fat,
        'ft-water': colors.water,
        'ft-water-dark': colors.waterDark,
        'ft-weight': colors.weight,
        'ft-muted': colors.textMuted,
        'ft-muted-2': colors.textMuted2,
        'ft-muted-3': colors.textMuted3,
      },
    },
  },
  plugins: [],
};
