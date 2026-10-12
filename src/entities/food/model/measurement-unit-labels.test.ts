import { getMeasurementUnitLabel, isDrinkUnit, toCustomFoodBaseUnit } from './measurement-unit-labels';

describe('getMeasurementUnitLabel', () => {
  test.each([
    ['Gram', 'g'],
    ['Kilogram', 'kg'],
    ['Milliliter', 'ml'],
    ['Liter', 'L'],
  ] as const)('shows %s as %s', (unit, expectedLabel) => {
    expect(getMeasurementUnitLabel(unit)).toBe(expectedLabel);
  });
});

describe('isDrinkUnit', () => {
  test.each([
    ['Milliliter', true],
    ['Liter', true],
    ['Gram', false],
    ['Kilogram', false],
  ] as const)('%s is a drink unit: %s', (unit, expected) => {
    expect(isDrinkUnit(unit)).toBe(expected);
  });
});

describe('toCustomFoodBaseUnit', () => {
  test.each([
    ['Milliliter', 'Milliliter'],
    ['Liter', 'Milliliter'],
    ['Gram', 'Gram'],
    ['Kilogram', 'Gram'],
  ] as const)('turns %s into %s', (unit, expectedBaseUnit) => {
    expect(toCustomFoodBaseUnit(unit)).toBe(expectedBaseUnit);
  });
});
