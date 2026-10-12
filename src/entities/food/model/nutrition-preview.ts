import type { NutritionPreview } from '@/shared/lib/nutrition-preview-labels';

import type { Food } from './food.types';

/**
 * Mirrors the backend's NutritionCalculator.Calculate so the live preview shown here matches what
 * gets saved. The quantity is in the food's own base unit: grams for a food, milliliters for a drink.
 */
export function calculateNutritionForQuantity(food: Food, quantity: number): NutritionPreview {
  const ratio = quantity / food.baseUnitQuantity;

  return {
    calories: Math.round(food.caloriesPerBaseUnit * ratio),
    protein: food.proteinPerBaseUnit * ratio,
    carbs: food.carbsPerBaseUnit * ratio,
    fat: food.fatPerBaseUnit * ratio,
  };
}
