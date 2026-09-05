export type CustomFoodFormFields = {
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
};

/** True when the name is filled in and every macro field is a non-empty, parseable number. */
export function isCustomFoodFormValid(fields: CustomFoodFormFields): boolean {
  const macroValues = [fields.calories, fields.protein, fields.carbs, fields.fat];
  return fields.name.trim().length > 0 && macroValues.every((value) => value.trim().length > 0 && !Number.isNaN(Number(value)));
}
