import type { NutritionHistoryEntry, WeightHistoryEntry } from '@/entities/dashboard';

import {
  calculateProgressPercent,
  calculateWeightDelta,
  countDistinctMealTypes,
  findNextPendingMealType,
  formatCaloriesRemaining,
  formatLiters,
  formatMacroGrams,
  getTodayNutrition,
} from './dashboard-view';

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

describe('formatCaloriesRemaining', () => {
  test.each([
    [600, '600 restantes'],
    [0, '0 restantes'],
    [-150, '150 acima'],
    [12.6, '13 restantes'],
    [-0.4, '0 restantes'],
  ])('formats %p as %p', (caloriesRemaining, expected) => {
    expect(formatCaloriesRemaining(caloriesRemaining)).toBe(expected);
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

describe('getTodayNutrition', () => {
  const nutritionHistory: NutritionHistoryEntry[] = [
    { date: '2026-09-01', calories: 1800, protein: 120, carbs: 200, fat: 60, waterMilliliters: 1500 },
    { date: '2026-09-02', calories: 2000, protein: 140, carbs: 220, fat: 65, waterMilliliters: 2000 },
  ];

  test("returns today's row when present", () => {
    expect(getTodayNutrition(nutritionHistory, '2026-09-02')).toEqual({
      calories: 2000,
      protein: 140,
      carbs: 220,
      fat: 65,
      waterMilliliters: 2000,
    });
  });

  test('zero-fills every field when nothing has been logged today', () => {
    expect(getTodayNutrition(nutritionHistory, '2026-09-03')).toEqual({
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      waterMilliliters: 0,
    });
  });
});

describe('formatMacroGrams', () => {
  test('rounds a floating-point value to one decimal place', () => {
    expect(formatMacroGrams(14.819999999999999)).toBe('14,8');
  });

  test('trims a trailing zero decimal for a whole number', () => {
    expect(formatMacroGrams(71)).toBe('71');
  });

  test('rounds to the nearest tenth', () => {
    expect(formatMacroGrams(6.849999999999999)).toBe('6,8');
  });
});

describe('calculateWeightDelta', () => {
  test('returns the change from the previous entry to the current weight', () => {
    const weightHistory: WeightHistoryEntry[] = [
      { date: '2026-09-01', weightKilograms: 88 },
      { date: '2026-09-03', weightKilograms: 87.2 },
    ];

    expect(calculateWeightDelta(weightHistory, 86.5)).toBeCloseTo(-1.5, 5);
  });

  test('sorts an out-of-order history before picking the previous entry', () => {
    const weightHistory: WeightHistoryEntry[] = [
      { date: '2026-09-05', weightKilograms: 85 },
      { date: '2026-09-01', weightKilograms: 88 },
      { date: '2026-09-03', weightKilograms: 87.2 },
    ];

    // Sorted ascending, the previous entry is 2026-09-03 (87.2), not whatever sits
    // second-to-last in the unsorted input array.
    expect(calculateWeightDelta(weightHistory, 84.5)).toBeCloseTo(-2.7, 5);
  });

  test('returns null when there is no previous entry', () => {
    const weightHistory: WeightHistoryEntry[] = [{ date: '2026-09-03', weightKilograms: 87.2 }];

    expect(calculateWeightDelta(weightHistory, 87.2)).toBeNull();
  });

  test('returns null when there is no current weight', () => {
    const weightHistory: WeightHistoryEntry[] = [
      { date: '2026-09-01', weightKilograms: 88 },
      { date: '2026-09-03', weightKilograms: 87.2 },
    ];

    expect(calculateWeightDelta(weightHistory, null)).toBeNull();
  });
});
