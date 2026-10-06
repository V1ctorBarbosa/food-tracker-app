const PercentScale = 100;

export type MealItemMacros = {
  quantity: number;
  unitLabel: string;
  protein: number;
  carbs: number;
  fat: number;
};

export type MacroSharePercents = {
  proteinPercent: number;
  carbsPercent: number;
  fatPercent: number;
};

/** "100 g · 1 g proteína · 26 g carboidrato · 0 g gordura", with the macros rounded to whole grams. */
export function formatMealItemMacros({ quantity, unitLabel, protein, carbs, fat }: MealItemMacros): string {
  const proteinLabel = `${Math.round(protein)} g proteína`;
  const carbsLabel = `${Math.round(carbs)} g carboidrato`;
  const fatLabel = `${Math.round(fat)} g gordura`;

  return `${quantity} ${unitLabel} · ${proteinLabel} · ${carbsLabel} · ${fatLabel}`;
}

export function formatItemCalories(calories: number): string {
  return `${calories} kcal`;
}

export function formatItemCountLabel(itemCount: number): string {
  if (itemCount === 1) {
    return '1 item';
  }

  return `${itemCount} itens`;
}

/** Each macro's share of the three together, for the stacked bar; all zero when there is nothing to split. */
export function calculateMacroSharePercents(protein: number, carbs: number, fat: number): MacroSharePercents {
  const total = protein + carbs + fat;
  if (total <= 0) {
    return { proteinPercent: 0, carbsPercent: 0, fatPercent: 0 };
  }

  return {
    proteinPercent: (protein / total) * PercentScale,
    carbsPercent: (carbs / total) * PercentScale,
    fatPercent: (fat / total) * PercentScale,
  };
}
