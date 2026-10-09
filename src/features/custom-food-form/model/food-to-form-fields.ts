import type { Food } from '@/entities/food';
import { formatMaxDecimals } from '@/shared/lib/format';

import type { CustomFoodFormFields } from './custom-food-form';

const MacroDecimalPlaces = 2;

export const EmptyCustomFoodFields: CustomFoodFormFields = { name: '', calories: '', protein: '', carbs: '', fat: '' };

/**
 * A saved food as the form's text fields. Macros use the pt-BR comma the form accepts as input;
 * calories are whole numbers and skip thousands grouping, which would read back as a decimal point.
 */
export function foodToFormFields(food: Food): CustomFoodFormFields {
  return {
    name: food.name,
    calories: String(food.caloriesPerBaseUnit),
    protein: formatMaxDecimals(food.proteinPerBaseUnit, MacroDecimalPlaces),
    carbs: formatMaxDecimals(food.carbsPerBaseUnit, MacroDecimalPlaces),
    fat: formatMaxDecimals(food.fatPerBaseUnit, MacroDecimalPlaces),
  };
}
