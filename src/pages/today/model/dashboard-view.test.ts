import { calculateProgressPercent, countDistinctMealTypes, findNextPendingMealType, formatLiters } from './dashboard-view';

describe('findNextPendingMealType', () => {
  test('returns the first meal type not yet logged, in canonical order', () => {
    expect(findNextPendingMealType(['Breakfast', 'Lunch'])).toBe('Dinner');
  });

  test('returns null when every meal type has been logged', () => {
    expect(findNextPendingMealType(['Breakfast', 'Lunch', 'Dinner', 'Snack'])).toBeNull();
  });

  test('returns Breakfast when nothing has been logged yet', () => {
    expect(findNextPendingMealType([])).toBe('Breakfast');
  });
});

describe('countDistinctMealTypes', () => {
  test('counts each meal type once, even if logged multiple times', () => {
    expect(countDistinctMealTypes(['Snack', 'Snack', 'Breakfast'])).toBe(2);
  });

  test('returns 0 for an empty list', () => {
    expect(countDistinctMealTypes([])).toBe(0);
  });
});

describe('formatLiters', () => {
  test('converts milliliters to liters with one decimal place', () => {
    expect(formatLiters(1300)).toBe('1.3');
  });

  test('rounds to one decimal place', () => {
    expect(formatLiters(1250)).toBe('1.3');
  });
});

describe('calculateProgressPercent', () => {
  test('returns the percentage of value toward target', () => {
    expect(calculateProgressPercent(50, 200)).toBe(25);
  });

  test('clamps above-target values to 100', () => {
    expect(calculateProgressPercent(250, 200)).toBe(100);
  });

  test('returns 0 when there is no target', () => {
    expect(calculateProgressPercent(50, null)).toBe(0);
  });

  test('returns 0 when the target is zero, avoiding division by zero', () => {
    expect(calculateProgressPercent(50, 0)).toBe(0);
  });
});
