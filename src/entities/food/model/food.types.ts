export type MeasurementUnit = 'Gram' | 'Kilogram' | 'Milliliter' | 'Liter';

/** 'Usda' is retired (no longer queried live) but stays valid so an earlier-cached food still displays. */
export type FoodSource = 'Usda' | 'OpenFoodFacts' | 'Custom' | 'Taco';

export type Food = {
  id: string;
  name: string;
  source: FoodSource;
  baseUnitQuantity: number;
  baseUnitType: MeasurementUnit;
  caloriesPerBaseUnit: number;
  proteinPerBaseUnit: number;
  carbsPerBaseUnit: number;
  fatPerBaseUnit: number;
};

/** A custom food is either a food, per 100 g, or a drink, per 100 ml. */
export type CustomFoodBaseUnit = 'Gram' | 'Milliliter';

/** Nutrition is per 100 of baseUnitType. */
export type CreateCustomFoodRequest = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  baseUnitType: CustomFoodBaseUnit;
};

/**
 * The same fields as creating one. Switching baseUnitType also moves the amounts already logged
 * for the food to the new unit on the backend (350 g becomes 350 ml).
 */
export type UpdateCustomFoodRequest = CreateCustomFoodRequest;
