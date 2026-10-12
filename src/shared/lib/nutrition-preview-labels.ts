/** Calories and macros for an amount of something eaten, before or after it is saved. */
export type NutritionPreview = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

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
