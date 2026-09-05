import { getMeasurementUnitLabel } from './measurement-unit-labels';

describe('getMeasurementUnitLabel', () => {
  test('abbreviates Gram to g', () => {
    expect(getMeasurementUnitLabel('Gram')).toBe('g');
  });

  test('lowercases every other unit', () => {
    expect(getMeasurementUnitLabel('Kilogram')).toBe('kilogram');
    expect(getMeasurementUnitLabel('Milliliter')).toBe('milliliter');
    expect(getMeasurementUnitLabel('Liter')).toBe('liter');
  });
});
