import { CustomFoodKindOptions, formatCustomFoodFormTitle } from './custom-food-kind';

// @/entities/food's barrel also re-exports its query hooks, which pull in firebase/auth through the
// shared API client -- mocked here so importing the barrel's pure unit helpers doesn't require
// Firebase's ESM build to run under Jest.
jest.mock('@/shared/api/firebase', () => ({ auth: {} }));
jest.mock('firebase/auth', () => ({ onAuthStateChanged: jest.fn() }));

describe('CustomFoodKindOptions', () => {
  test('offers a food in grams and a drink in milliliters, food first', () => {
    expect(CustomFoodKindOptions).toEqual([
      { baseUnitType: 'Gram', label: 'Comida' },
      { baseUnitType: 'Milliliter', label: 'Bebida' },
    ]);
  });
});

describe('formatCustomFoodFormTitle', () => {
  test('says the values are per 100 g for a food', () => {
    expect(formatCustomFoodFormTitle('Novo alimento', 'Gram')).toBe('Novo alimento · por 100 g');
  });

  test('says the values are per 100 ml for a drink', () => {
    expect(formatCustomFoodFormTitle('Valores', 'Milliliter')).toBe('Valores · por 100 ml');
  });
});
