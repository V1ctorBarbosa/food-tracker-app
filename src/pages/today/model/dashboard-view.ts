import type { MealType } from '@/entities/meal';

const AllMealTypesInOrder: MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export function findNextPendingMealType(loggedMealTypes: MealType[]): MealType | null {
  return AllMealTypesInOrder.find((mealType) => !loggedMealTypes.includes(mealType)) ?? null;
}

export function countDistinctMealTypes(loggedMealTypes: MealType[]): number {
  return new Set(loggedMealTypes).size;
}

export function formatLiters(milliliters: number): string {
  return (milliliters / 1000).toFixed(1);
}

/** Clamped 0-100 progress toward a target; 0 when there is no target to measure against. */
export function calculateProgressPercent(value: number, target: number | null): number {
  if (target === null || target <= 0) {
    return 0;
  }

  return Math.min(100, (value / target) * 100);
}
