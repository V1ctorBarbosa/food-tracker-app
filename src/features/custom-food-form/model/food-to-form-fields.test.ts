import type { Food } from '@/entities/food';

import { parseCustomFoodFields } from './custom-food-form';
import { EmptyCustomFoodFields, foodToFormFields } from './food-to-form-fields';

function buildFood(overrides: Partial<Food>): Food {
  return {
    id: 'food-1',
    name: 'My whey',
    source: 'Custom',
    baseUnitQuantity: 100,
    baseUnitType: 'Gram',
    caloriesPerBaseUnit: 120,
    proteinPerBaseUnit: 24,
    carbsPerBaseUnit: 3,
    fatPerBaseUnit: 1.5,
    servings: [],
    ...overrides,
  };
}

describe('foodToFormFields', () => {
  test('turns a food into the form text, with the comma for decimals', () => {
    expect(foodToFormFields(buildFood({}))).toEqual({ name: 'My whey', calories: '120', protein: '24', carbs: '3', fat: '1,5' });
  });

  test('keeps at most two decimal places', () => {
    const fields = foodToFormFields(buildFood({ proteinPerBaseUnit: 10.456, carbsPerBaseUnit: 0.1 }));

    expect(fields.protein).toBe('10,46');
    expect(fields.carbs).toBe('0,1');
  });

  test('never groups thousands in the calories, which would read back as a decimal', () => {
    const fields = foodToFormFields(buildFood({ caloriesPerBaseUnit: 1250 }));

    expect(fields.calories).toBe('1250');
  });

  test('reads back as the same values it came from', () => {
    const food = buildFood({ name: 'Granola', caloriesPerBaseUnit: 410, proteinPerBaseUnit: 9.5, carbsPerBaseUnit: 62.25, fatPerBaseUnit: 12 });

    expect(parseCustomFoodFields(foodToFormFields(food))).toEqual({
      name: 'Granola',
      calories: 410,
      protein: 9.5,
      carbs: 62.25,
      fat: 12,
    });
  });
});

describe('EmptyCustomFoodFields', () => {
  test('is not a valid food yet', () => {
    expect(parseCustomFoodFields(EmptyCustomFoodFields)).toBeNull();
  });
});
