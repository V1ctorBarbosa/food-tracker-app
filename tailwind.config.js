/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        display: ['BodoniModa_900Black'],
        body: ['Archivo_400Regular'],
        'body-medium': ['Archivo_500Medium'],
        'body-semibold': ['Archivo_600SemiBold'],
        'body-bold': ['Archivo_700Bold'],
      },
      colors: {
        'ft-bg': '#DCEAF8',
        'ft-card': '#F2F1F8',
        'ft-calories': '#274F8C',
        'ft-calories-dark': '#3D65A6',
        'ft-protein': '#BC5589',
        'ft-carbs': '#B84C44',
        'ft-fat': '#E6C43C',
        'ft-water': '#6096C2',
        'ft-water-dark': '#4B80AB',
        'ft-weight': '#17402A',
        'ft-muted': '#5E7E96',
        'ft-muted-2': '#7A879B',
        'ft-muted-3': '#9AA3B0',
      },
    },
  },
  plugins: [],
};
