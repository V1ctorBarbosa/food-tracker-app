import type { MealCaptureRequest, MealItemRequest } from '@/entities/meal';
import type { EstimatedMealItem, MealEstimate } from '@/features/meal-estimate';
import type { NutritionPreview } from '@/shared/lib/nutrition-preview-labels';

/** Which source the estimate is made from: a photo (with an optional description) or a description alone. */
export type EstimateSource = 'photo' | 'description';

/** The source asked for in the route; anything else, or nothing, is a photo. */
export function parseEstimateSource(source: string | undefined): EstimateSource {
  if (source === 'description') {
    return 'description';
  }

  return 'photo';
}

/** Items start included; tapping one moves its index in or out of this set of excluded items. */
export function toggleExcludedItem(excludedIndexes: ReadonlySet<number>, index: number): Set<number> {
  const nextExcludedIndexes = new Set(excludedIndexes);
  if (nextExcludedIndexes.has(index)) {
    nextExcludedIndexes.delete(index);
    return nextExcludedIndexes;
  }

  nextExcludedIndexes.add(index);
  return nextExcludedIndexes;
}

export function selectIncludedItems(items: readonly EstimatedMealItem[], excludedIndexes: ReadonlySet<number>): EstimatedMealItem[] {
  return items.filter((_item, index) => !excludedIndexes.has(index));
}

export function sumEstimatedNutrition(items: readonly EstimatedMealItem[]): NutritionPreview {
  return items.reduce<NutritionPreview>(
    (total, item) => ({
      calories: total.calories + item.calories,
      protein: total.protein + item.protein,
      carbs: total.carbs + item.carbs,
      fat: total.fat + item.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
}

/** The items as the meal endpoints take them: each sent back with its own estimated food. */
export function toEstimatedItemRequests(items: readonly EstimatedMealItem[]): MealItemRequest[] {
  return items.map((item) => ({
    foodId: null,
    quantity: item.quantity,
    unit: item.unit,
    estimatedFood: item.estimatedFood,
  }));
}

export function toEstimateCaptureRequest(estimate: MealEstimate): MealCaptureRequest {
  return { id: estimate.captureId, hasPhoto: estimate.hasPhoto, description: estimate.description };
}

export function formatEstimateSourceLabel(hasPhoto: boolean): string {
  if (hasPhoto) {
    return 'Pela foto';
  }

  return 'Pela descrição';
}

export function formatAnalyzingMessage(hasPhoto: boolean): string {
  if (hasPhoto) {
    return 'Identificando os alimentos da foto';
  }

  return 'Lendo sua descrição';
}

/** "150 g · 240 kcal": an estimated item's amount and calories, for its row in the review. */
export function formatEstimatedItemSummary(item: EstimatedMealItem, unitLabel: string): string {
  return `${item.quantity} ${unitLabel} · ${item.calories} kcal`;
}
