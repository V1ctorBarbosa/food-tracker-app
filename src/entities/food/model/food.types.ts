export type MeasurementUnit = 'Gram' | 'Kilogram' | 'Milliliter' | 'Liter';

export type FoodSource = 'Usda' | 'OpenFoodFacts' | 'Custom';

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
