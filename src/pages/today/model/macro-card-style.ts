export type MacroKind = 'protein' | 'carbs' | 'fat';

export type MacroCardStyle = {
  backgroundClassName: string;
  textClassName: string;
  fillClassName: string;
  trackClassName: string;
};

const MacroCardStyles: Record<MacroKind, MacroCardStyle> = {
  protein: {
    backgroundClassName: 'bg-ft-protein',
    textClassName: 'text-white',
    fillClassName: 'bg-white',
    trackClassName: 'bg-white/30',
  },
  carbs: {
    backgroundClassName: 'bg-ft-carbs',
    textClassName: 'text-white',
    fillClassName: 'bg-white',
    trackClassName: 'bg-white/30',
  },
  // The yellow card is too light for white text, so it switches to the deep blue instead.
  fat: {
    backgroundClassName: 'bg-ft-fat',
    textClassName: 'text-ft-on-fat',
    fillClassName: 'bg-ft-on-fat',
    trackClassName: 'bg-ft-on-fat/20',
  },
};

/** Solid-colour macro card: the macro's own colour as background, with a text colour that stays readable on it. */
export function resolveMacroCardStyle(macro: MacroKind): MacroCardStyle {
  return MacroCardStyles[macro];
}
