import type { Food } from '@/entities/food';

import { isSelectedFoodMissingFromResults } from './selected-food-row';

function buildFood(id: string): Food {
  return {
    id,
    name: `Food ${id}`,
    source: 'Custom',
    baseUnitQuantity: 100,
    baseUnitType: 'Gram',
    caloriesPerBaseUnit: 280,
    proteinPerBaseUnit: 10,
    carbsPerBaseUnit: 30,
    fatPerBaseUnit: 13,
    servings: [],
  };
}

describe('isSelectedFoodMissingFromResults', () => {
  test('is false when nothing is selected', () => {
    expect(isSelectedFoodMissingFromResults(null, [buildFood('a')])).toBe(false);
  });

  test('is true when a food was just created and there is no result list at all', () => {
    expect(isSelectedFoodMissingFromResults(buildFood('new'), undefined)).toBe(true);
  });

  test('is true when the results are empty', () => {
    expect(isSelectedFoodMissingFromResults(buildFood('new'), [])).toBe(true);
  });

  test('is true when the results do not include the selected food', () => {
    expect(isSelectedFoodMissingFromResults(buildFood('new'), [buildFood('a'), buildFood('b')])).toBe(true);
  });

  test('is false when the selected food is already one of the listed rows', () => {
    expect(isSelectedFoodMissingFromResults(buildFood('b'), [buildFood('a'), buildFood('b')])).toBe(false);
  });

  test('matches by id, not by object identity', () => {
    expect(isSelectedFoodMissingFromResults(buildFood('b'), [buildFood('b')])).toBe(false);
  });
});
