import type { MealCapture, MealItem } from '@/entities/meal';

const PercentScale = 100;

/** The same step and floor as the add-food screen, so an amount is edited the way it was entered. */
export const ItemQuantityStep = 10;
export const MinimumItemQuantity = 1;

export function adjustItemQuantity(quantity: number, delta: number): number {
  return Math.max(MinimumItemQuantity, quantity + delta);
}

/** The typed amount, kept at or above the floor; null while the text is not a number yet. */
export function parseItemQuantity(parsedQuantity: number | null): number | null {
  if (parsedQuantity === null) {
    return null;
  }

  return Math.max(MinimumItemQuantity, parsedQuantity);
}

/** The edit-mode hint: a tap edits the amount, a swipe deletes. */
export const EditItemsHint = 'Toque para mudar a quantidade · deslize para apagar';

/** The captures with something to show: a photo, a description, or both. */
export function selectCapturesToShow(captures: readonly MealCapture[]): MealCapture[] {
  return captures.filter((capture) => capture.photoUrl !== null || capture.description !== null);
}

export function findMealItem(items: readonly MealItem[], itemId: string | undefined): MealItem | null {
  return items.find((item) => item.id === itemId) ?? null;
}

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
