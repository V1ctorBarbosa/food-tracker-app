import type { FoodSource } from './food.types';

/** The backend's FoodSource enum values stay in English (API contract); only the display differs. */
const FoodSourceLabels: Record<FoodSource, string> = {
  Usda: 'USDA',
  OpenFoodFacts: 'Marca',
  Custom: 'Personalizado',
  Taco: 'TACO',
};

export function getFoodSourceLabel(source: FoodSource): string {
  return FoodSourceLabels[source];
}
