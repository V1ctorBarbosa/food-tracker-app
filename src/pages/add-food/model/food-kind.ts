import type { CustomFoodBaseUnit, Food, MeasurementUnit } from '@/entities/food';

export type FoodKind = 'food' | 'drink';

export type FoodKindView = {
  title: string;
  searchPlaceholder: string;
  selectedLabel: string;
  customFoodBaseUnit: CustomFoodBaseUnit;
};

const DrinkUnits: readonly MeasurementUnit[] = ['Milliliter', 'Liter'];

const FoodKindViews: Record<FoodKind, FoodKindView> = {
  food: {
    title: 'Adicionar alimento',
    searchPlaceholder: 'Buscar alimentos...',
    selectedLabel: 'Alimento selecionado',
    customFoodBaseUnit: 'Gram',
  },
  drink: {
    title: 'Adicionar bebida',
    searchPlaceholder: 'Buscar bebidas...',
    selectedLabel: 'Bebida selecionada',
    customFoodBaseUnit: 'Milliliter',
  },
};

/** The kind asked for in the route; anything else, or nothing, is a food. */
export function parseFoodKind(kind: string | undefined): FoodKind {
  if (kind === 'drink') {
    return 'drink';
  }

  return 'food';
}

export function getFoodKindView(kind: FoodKind): FoodKindView {
  return FoodKindViews[kind];
}

/** Keeps the results of the kind being searched: drinks are the foods measured by volume. */
export function filterFoodsByKind(foods: Food[], kind: FoodKind): Food[] {
  return foods.filter((food) => isOfKind(food, kind));
}

function isOfKind(food: Food, kind: FoodKind): boolean {
  const isDrink = DrinkUnits.includes(food.baseUnitType);
  if (kind === 'drink') {
    return isDrink;
  }

  return !isDrink;
}
