import type { NutritionPreview } from '@/shared/lib/nutrition-preview-labels';

import type { MealCapture, MealCaptureRequest, MealItem, MealItemRequest } from './meal.types';

const MissingFoodName = '—';

/**
 * An item as it must be sent back when the meal is saved again. An estimated item has no catalog
 * food, so it goes back with its own food; sending only its foodId would lose it.
 */
export function toMealItemRequest(item: MealItem): MealItemRequest {
  if (item.estimatedFood !== null) {
    return { foodId: null, quantity: item.quantity, unit: item.unit, estimatedFood: item.estimatedFood };
  }

  return { foodId: item.foodId, quantity: item.quantity, unit: item.unit };
}

/** Every item of a meal as it must be sent back, with one of them at a new quantity. */
export function toMealItemRequestsWithQuantity(items: MealItem[], itemId: string, quantity: number): MealItemRequest[] {
  return items.map((item) => {
    const request = toMealItemRequest(item);
    if (item.id !== itemId) {
      return request;
    }

    return { ...request, quantity };
  });
}

export function toMealCaptureRequest(capture: MealCapture): MealCaptureRequest {
  return { id: capture.id, hasPhoto: capture.hasPhoto, description: capture.description };
}

/**
 * The item's nutrition at another quantity. Both kinds of item are linear in their quantity on the
 * backend, so scaling the saved snapshot gives the value the backend recalculates, without needing
 * the catalog food.
 */
export function scaleMealItemNutrition(item: MealItem, quantity: number): NutritionPreview {
  const ratio = quantity / item.quantity;

  return {
    calories: Math.round(item.calories * ratio),
    protein: item.protein * ratio,
    carbs: item.carbs * ratio,
    fat: item.fat * ratio,
  };
}

/** The name to show for an item: an estimated item carries its own, a catalog item's comes from its food. */
export function resolveMealItemName(item: MealItem, catalogFoodName: string | undefined): string {
  if (item.estimatedFood !== null) {
    return item.estimatedFood.name;
  }

  return catalogFoodName ?? MissingFoodName;
}

export function isEstimatedMealItem(item: MealItem): boolean {
  return item.estimatedFood !== null;
}

/** The catalog foods a meal's items point at, so their names can be loaded. Estimated items have none. */
export function collectCatalogFoodIds(items: MealItem[]): string[] {
  return items.map((item) => item.foodId).filter((foodId): foodId is string => foodId !== null);
}
