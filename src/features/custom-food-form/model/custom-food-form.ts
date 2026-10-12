import type { CustomFoodBaseUnit } from '@/entities/food';
import { parseDecimalInput } from '@/shared/lib/parse-decimal';

export type CustomFoodFormFields = {
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  baseUnitType: CustomFoodBaseUnit;
};

export type CustomFoodValues = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  baseUnitType: CustomFoodBaseUnit;
};

/** The typed fields as numbers, or null unless the name is filled in and every macro is a number (comma or dot). */
export function parseCustomFoodFields(fields: CustomFoodFormFields): CustomFoodValues | null {
  const name = fields.name.trim();
  const calories = parseDecimalInput(fields.calories);
  const protein = parseDecimalInput(fields.protein);
  const carbs = parseDecimalInput(fields.carbs);
  const fat = parseDecimalInput(fields.fat);

  if (name.length === 0 || calories === null || protein === null || carbs === null || fat === null) {
    return null;
  }

  return { name, calories, protein, carbs, fat, baseUnitType: fields.baseUnitType };
}

export function isCustomFoodFormValid(fields: CustomFoodFormFields): boolean {
  return parseCustomFoodFields(fields) !== null;
}
