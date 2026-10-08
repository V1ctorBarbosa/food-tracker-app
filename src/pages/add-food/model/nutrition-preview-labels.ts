import type { NutritionPreview } from '@/pages/add-food/model/nutrition-preview';

export type NutritionPreviewLabels = {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
};

/** The preview's four values as display text: calories as they are, macros in whole grams. */
export function formatNutritionPreviewLabels(preview: NutritionPreview): NutritionPreviewLabels {
  return {
    calories: String(preview.calories),
    protein: `${Math.round(preview.protein)}g`,
    carbs: `${Math.round(preview.carbs)}g`,
    fat: `${Math.round(preview.fat)}g`,
  };
}
