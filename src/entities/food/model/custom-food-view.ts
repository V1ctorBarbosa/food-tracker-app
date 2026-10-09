import { formatMaxDecimals } from '@/shared/lib/format';

import type { Food } from './food.types';

const MacroDecimalPlaces = 1;

/** "280 kcal · 10 g proteína · 30 g carboidrato · 13 g gordura", all per 100 g. */
export function formatCustomFoodSummary(food: Food): string {
  const proteinLabel = `${formatMaxDecimals(food.proteinPerBaseUnit, MacroDecimalPlaces)} g proteína`;
  const carbsLabel = `${formatMaxDecimals(food.carbsPerBaseUnit, MacroDecimalPlaces)} g carboidrato`;
  const fatLabel = `${formatMaxDecimals(food.fatPerBaseUnit, MacroDecimalPlaces)} g gordura`;

  return `${food.caloriesPerBaseUnit} kcal · ${proteinLabel} · ${carbsLabel} · ${fatLabel}`;
}

/** The food with this id from the loaded list, or null when it is not there (yet, or not the user's). */
export function findCustomFoodById(foods: readonly Food[] | undefined, id: string | undefined): Food | null {
  if (foods === undefined || id === undefined) {
    return null;
  }

  return foods.find((food) => food.id === id) ?? null;
}
