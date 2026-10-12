import { calculateNutritionForQuantity } from './nutrition-preview';
import type { Food } from '@/entities/food';

const chickenBreastRaw: Food = {
  id: 'food-1',
  name: 'Chicken breast, raw',
  source: 'Usda',
  baseUnitQuantity: 100,
  baseUnitType: 'Gram',
  caloriesPerBaseUnit: 165,
  proteinPerBaseUnit: 31,
  carbsPerBaseUnit: 0,
  fatPerBaseUnit: 3.6,
};

describe('calculateNutritionForQuantity', () => {
  it('matches the mockup worked example: 165 kcal/100g at 150g -> 248 kcal', () => {
    const result = calculateNutritionForQuantity(chickenBreastRaw, 150);

    expect(result.calories).toBe(248);
    expect(result.protein).toBeCloseTo(46.5, 5);
    expect(result.carbs).toBe(0);
    expect(result.fat).toBeCloseTo(5.4, 5);
  });

  it('scales linearly with quantity', () => {
    const result = calculateNutritionForQuantity(chickenBreastRaw, 200);

    expect(result.calories).toBe(330);
    expect(result.protein).toBeCloseTo(62, 5);
  });

  it('returns zeros for a zero quantity', () => {
    const result = calculateNutritionForQuantity(chickenBreastRaw, 0);

    expect(result).toEqual({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  });

  it('scales a drink by milliliters: a 350 ml can of a 42 kcal/100 ml soda is 147 kcal', () => {
    const cocaCola = {
      ...chickenBreastRaw,
      name: 'Coca-Cola',
      baseUnitType: 'Milliliter' as const,
      caloriesPerBaseUnit: 42,
      proteinPerBaseUnit: 0,
      carbsPerBaseUnit: 10.5,
      fatPerBaseUnit: 0,
    };

    const result = calculateNutritionForQuantity(cocaCola, 350);

    expect(result.calories).toBe(147);
    expect(result.carbs).toBeCloseTo(36.75, 5);
  });
});
