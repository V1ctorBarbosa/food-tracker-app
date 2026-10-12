import type { Food } from '@/entities/food';

import { filterFoodsByKind, getFoodKindView, parseFoodKind } from './food-kind';

jest.mock('firebase/auth', () => ({ onAuthStateChanged: jest.fn() }));

function createFood(name: string, baseUnitType: Food['baseUnitType']): Food {
  return {
    id: name,
    name,
    source: 'Taco',
    baseUnitQuantity: 100,
    baseUnitType,
    caloriesPerBaseUnit: 100,
    proteinPerBaseUnit: 1,
    carbsPerBaseUnit: 1,
    fatPerBaseUnit: 1,
  };
}

const rice = createFood('Arroz', 'Gram');
const milk = createFood('Leite', 'Milliliter');
const juice = createFood('Suco', 'Liter');

describe('parseFoodKind', () => {
  test('reads a drink', () => {
    expect(parseFoodKind('drink')).toBe('drink');
  });

  test('treats anything else, or nothing, as a food', () => {
    expect(parseFoodKind('food')).toBe('food');
    expect(parseFoodKind(undefined)).toBe('food');
    expect(parseFoodKind('soup')).toBe('food');
  });
});

describe('filterFoodsByKind', () => {
  test('keeps only foods measured by volume when searching drinks', () => {
    expect(filterFoodsByKind([rice, milk, juice], 'drink')).toEqual([milk, juice]);
  });

  test('keeps only foods measured by mass when searching foods', () => {
    expect(filterFoodsByKind([rice, milk, juice], 'food')).toEqual([rice]);
  });
});

describe('getFoodKindView', () => {
  test('starts a new custom drink in milliliters', () => {
    expect(getFoodKindView('drink').customFoodBaseUnit).toBe('Milliliter');
    expect(getFoodKindView('drink').title).toBe('Adicionar bebida');
  });

  test('starts a new custom food in grams', () => {
    expect(getFoodKindView('food').customFoodBaseUnit).toBe('Gram');
    expect(getFoodKindView('food').title).toBe('Adicionar alimento');
  });
});
