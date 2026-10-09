import type { Food } from './food.types';

import { findCustomFoodById, formatCustomFoodSummary } from './custom-food-view';

function buildFood(overrides: Partial<Food>): Food {
  return {
    id: 'food-1',
    name: 'My whey',
    source: 'Custom',
    baseUnitQuantity: 100,
    baseUnitType: 'Gram',
    caloriesPerBaseUnit: 280,
    proteinPerBaseUnit: 10,
    carbsPerBaseUnit: 30,
    fatPerBaseUnit: 13,
    servings: [],
    ...overrides,
  };
}

describe('formatCustomFoodSummary', () => {
  test('spells the macros out in full words', () => {
    expect(formatCustomFoodSummary(buildFood({}))).toBe('280 kcal · 10 g proteína · 30 g carboidrato · 13 g gordura');
  });

  test('shows one decimal place with the comma when there is a fraction', () => {
    const summary = formatCustomFoodSummary(buildFood({ proteinPerBaseUnit: 24.5, fatPerBaseUnit: 1.25 }));

    expect(summary).toBe('280 kcal · 24,5 g proteína · 30 g carboidrato · 1,3 g gordura');
  });

  test('keeps zero values visible', () => {
    const summary = formatCustomFoodSummary(buildFood({ caloriesPerBaseUnit: 0, proteinPerBaseUnit: 0, carbsPerBaseUnit: 0, fatPerBaseUnit: 0 }));

    expect(summary).toBe('0 kcal · 0 g proteína · 0 g carboidrato · 0 g gordura');
  });
});

describe('findCustomFoodById', () => {
  const foods = [buildFood({ id: 'a' }), buildFood({ id: 'b', name: 'Granola' })];

  test('finds the food with the given id', () => {
    expect(findCustomFoodById(foods, 'b')?.name).toBe('Granola');
  });

  test('is null when the id is not in the list', () => {
    expect(findCustomFoodById(foods, 'missing')).toBeNull();
  });

  test('is null while the list has not loaded', () => {
    expect(findCustomFoodById(undefined, 'a')).toBeNull();
  });

  test('is null when there is no id', () => {
    expect(findCustomFoodById(foods, undefined)).toBeNull();
  });
});
