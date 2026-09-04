import type { MealType } from './meal.types';

/** The backend's MealType enum values stay in English (API contract); only the display differs. */
const MealTypeLabels: Record<MealType, string> = {
  Breakfast: 'Café da manhã',
  Lunch: 'Almoço',
  Dinner: 'Jantar',
  Snack: 'Lanche',
};

export function getMealTypeLabel(mealType: MealType): string {
  return MealTypeLabels[mealType];
}
