import type { Food } from '@/entities/food';

export type NutritionPreview = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

/**
 * Mirrors the backend's NutritionCalculator.Calculate (grams-only, matching food.baseUnitType
 * for every USDA-sourced food today) so the live preview shown here matches what gets saved.
 */
export function calculateNutritionForQuantity(food: Food, quantityGrams: number): NutritionPreview {
  const ratio = quantityGrams / food.baseUnitQuantity;

  return {
    calories: Math.round(food.caloriesPerBaseUnit * ratio),
    protein: food.proteinPerBaseUnit * ratio,
    carbs: food.carbsPerBaseUnit * ratio,
    fat: food.fatPerBaseUnit * ratio,
  };
}
