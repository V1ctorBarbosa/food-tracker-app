export type MeasurementUnit = 'Gram' | 'Kilogram' | 'Milliliter' | 'Liter';

/** 'Usda' is retired (no longer queried live) but stays valid so an earlier-cached food still displays. */
export type FoodSource = 'Usda' | 'OpenFoodFacts' | 'Custom' | 'Taco';

export type FoodServing = {
  id: string;
  name: string;
  quantity: number;
  unit: MeasurementUnit;
};

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
  servings: FoodServing[];
};

/** Always per 100g -- matches the app's convention for every other food source. */
export type CreateCustomFoodRequest = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

/** The same fields as creating one: editing replaces the name and the per-100g nutrition. */
export type UpdateCustomFoodRequest = CreateCustomFoodRequest;
