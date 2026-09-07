import type { NutritionHistoryEntry, WeightHistoryEntry } from '@/entities/dashboard';
import type { MealType } from '@/entities/meal';

const AllMealTypesInOrder: MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export type TodayNutrition = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  waterMilliliters: number;
};

/** Today's row from the nutrition history, zero-filled when nothing has been logged yet. */
export function getTodayNutrition(nutritionHistory: NutritionHistoryEntry[], todayDate: string): TodayNutrition {
  const todayEntry = nutritionHistory.find((entry) => entry.date === todayDate);

  return {
    calories: todayEntry?.calories ?? 0,
    protein: todayEntry?.protein ?? 0,
    carbs: todayEntry?.carbs ?? 0,
    fat: todayEntry?.fat ?? 0,
    waterMilliliters: todayEntry?.waterMilliliters ?? 0,
  };
}

/** Change from the previous recorded weight, or null when there's no earlier entry to compare against. */
export function calculateWeightDelta(weightHistory: WeightHistoryEntry[], currentWeightKilograms: number | null): number | null {
  const sortedHistory = [...weightHistory].sort((a, b) => a.date.localeCompare(b.date));
  const previousWeight = sortedHistory.length >= 2 ? sortedHistory[sortedHistory.length - 2].weightKilograms : null;

  if (previousWeight === null || currentWeightKilograms === null) {
    return null;
  }

  return currentWeightKilograms - previousWeight;
}

const MacroGramsMaximumDecimalPlaces = 1;

/** Rounds a macro amount to at most one decimal place, trimming a trailing ".0". */
export function formatMacroGrams(valueGrams: number): string {
  return valueGrams.toLocaleString('pt-BR', { maximumFractionDigits: MacroGramsMaximumDecimalPlaces });
}

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
