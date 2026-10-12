import {
  collectCatalogFoodIds,
  isEstimatedMealItem,
  resolveMealItemName,
  scaleMealItemNutrition,
  toMealCaptureRequest,
  toMealItemRequest,
  toMealItemRequestsWithQuantity,
} from './meal-requests';
import type { EstimatedFood, MealItem } from './meal.types';

const grilledChicken: EstimatedFood = {
  name: 'Peito de frango grelhado',
  captureId: '6f9619ff-8b86-d011-b42d-00c04fc964ff',
  baseUnit: 'Gram',
  caloriesPerBaseUnit: 160,
  proteinPerBaseUnit: 32,
  carbsPerBaseUnit: 0,
  fatPerBaseUnit: 3,
};

const riceItem: MealItem = {
  id: 'item-rice',
  foodId: 'food-rice',
  quantity: 200,
  unit: 'Gram',
  calories: 260,
  protein: 5.4,
  carbs: 56,
  fat: 0.6,
  estimatedFood: null,
};

const chickenItem: MealItem = {
  id: 'item-chicken',
  foodId: null,
  quantity: 150,
  unit: 'Gram',
  calories: 240,
  protein: 48,
  carbs: 0,
  fat: 4.5,
  estimatedFood: grilledChicken,
};

describe('toMealItemRequest', () => {
  test('sends a catalog item back with its food id', () => {
    expect(toMealItemRequest(riceItem)).toEqual({ foodId: 'food-rice', quantity: 200, unit: 'Gram' });
  });

  test('sends an estimated item back with its own food, so saving the meal again keeps it', () => {
    expect(toMealItemRequest(chickenItem)).toEqual({ foodId: null, quantity: 150, unit: 'Gram', estimatedFood: grilledChicken });
  });
});

describe('toMealItemRequestsWithQuantity', () => {
  test('changes only the chosen item', () => {
    const requests = toMealItemRequestsWithQuantity([riceItem, chickenItem], 'item-chicken', 300);

    expect(requests).toEqual([
      { foodId: 'food-rice', quantity: 200, unit: 'Gram' },
      { foodId: null, quantity: 300, unit: 'Gram', estimatedFood: grilledChicken },
    ]);
  });
});

describe('toMealCaptureRequest', () => {
  test('drops the photo url, which only the response carries', () => {
    const request = toMealCaptureRequest({
      id: 'capture-1',
      hasPhoto: true,
      description: 'o frango é empanado',
      photoUrl: 'https://photos.example.test/attached/photo.jpg',
    });

    expect(request).toEqual({ id: 'capture-1', hasPhoto: true, description: 'o frango é empanado' });
  });
});

describe('scaleMealItemNutrition', () => {
  test('doubles everything when the quantity doubles', () => {
    expect(scaleMealItemNutrition(chickenItem, 300)).toEqual({ calories: 480, protein: 96, carbs: 0, fat: 9 });
  });

  test('rounds calories to whole numbers', () => {
    expect(scaleMealItemNutrition(riceItem, 150).calories).toBe(195);
  });
});

describe('resolveMealItemName', () => {
  test('uses the estimated food name for an estimated item', () => {
    expect(resolveMealItemName(chickenItem, undefined)).toBe('Peito de frango grelhado');
  });

  test('uses the catalog food name for a catalog item', () => {
    expect(resolveMealItemName(riceItem, 'Arroz branco cozido')).toBe('Arroz branco cozido');
  });

  test('shows a dash while the catalog food is unknown', () => {
    expect(resolveMealItemName(riceItem, undefined)).toBe('—');
  });
});

describe('isEstimatedMealItem', () => {
  test('tells estimated items apart from catalog ones', () => {
    expect(isEstimatedMealItem(chickenItem)).toBe(true);
    expect(isEstimatedMealItem(riceItem)).toBe(false);
  });
});

describe('collectCatalogFoodIds', () => {
  test('skips estimated items, which have no catalog food', () => {
    expect(collectCatalogFoodIds([riceItem, chickenItem])).toEqual(['food-rice']);
  });
});
