import { calculateMacroSharePercents, formatItemCalories, formatItemCountLabel, formatMealItemMacros } from './meal-item-view';

describe('formatMealItemMacros', () => {
  test('spells the macros out in full words, in whole grams', () => {
    const label = formatMealItemMacros({ quantity: 100, unitLabel: 'g', protein: 1.1, carbs: 26.4, fat: 0.3 });

    expect(label).toBe('100 g · 1 g proteína · 26 g carboidrato · 0 g gordura');
  });

  test('rounds half grams up', () => {
    const label = formatMealItemMacros({ quantity: 250, unitLabel: 'ml', protein: 2.5, carbs: 10.5, fat: 4.5 });

    expect(label).toBe('250 ml · 3 g proteína · 11 g carboidrato · 5 g gordura');
  });
});

describe('formatItemCalories', () => {
  test.each([
    [98, '98 kcal'],
    [0, '0 kcal'],
    [1250, '1250 kcal'],
  ])('writes %p calories as %p', (calories, expected) => {
    expect(formatItemCalories(calories)).toBe(expected);
  });
});

describe('formatItemCountLabel', () => {
  test('uses the singular for exactly one item', () => {
    expect(formatItemCountLabel(1)).toBe('1 item');
  });

  test.each([[0], [2], [5]])('uses the plural for %p items', (count) => {
    expect(formatItemCountLabel(count)).toBe(`${count} itens`);
  });
});

describe('calculateMacroSharePercents', () => {
  test('splits the bar in proportion to each macro', () => {
    const shares = calculateMacroSharePercents(10, 30, 10);

    expect(shares.proteinPercent).toBeCloseTo(20);
    expect(shares.carbsPercent).toBeCloseTo(60);
    expect(shares.fatPercent).toBeCloseTo(20);
  });

  test('the three shares add up to the whole bar', () => {
    const { proteinPercent, carbsPercent, fatPercent } = calculateMacroSharePercents(1.3, 26.2, 0.4);

    expect(proteinPercent + carbsPercent + fatPercent).toBeCloseTo(100);
  });

  test('is all zero when the meal has no macros', () => {
    expect(calculateMacroSharePercents(0, 0, 0)).toEqual({ proteinPercent: 0, carbsPercent: 0, fatPercent: 0 });
  });
});
