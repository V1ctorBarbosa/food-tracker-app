import type { EstimatedMealItem, MealEstimate } from '@/features/meal-estimate';

import {
  formatAnalyzingMessage,
  formatEstimatedItemSummary,
  formatEstimateSourceLabel,
  parseEstimateSource,
  selectIncludedItems,
  sumEstimatedNutrition,
  toEstimateCaptureRequest,
  toEstimatedItemRequests,
  toggleExcludedItem,
} from './estimate-review';

jest.mock('firebase/auth', () => ({ onAuthStateChanged: jest.fn() }));

const CaptureId = '6f9619ff-8b86-d011-b42d-00c04fc964ff';

const chicken: EstimatedMealItem = {
  quantity: 150,
  unit: 'Gram',
  calories: 240,
  protein: 48,
  carbs: 0,
  fat: 4.5,
  estimatedFood: {
    name: 'Peito de frango grelhado',
    captureId: CaptureId,
    baseUnit: 'Gram',
    caloriesPerBaseUnit: 160,
    proteinPerBaseUnit: 32,
    carbsPerBaseUnit: 0,
    fatPerBaseUnit: 3,
  },
};

const rice: EstimatedMealItem = {
  quantity: 200,
  unit: 'Gram',
  calories: 256,
  protein: 5,
  carbs: 56.2,
  fat: 0.4,
  estimatedFood: {
    name: 'Arroz branco cozido',
    captureId: CaptureId,
    baseUnit: 'Gram',
    caloriesPerBaseUnit: 128,
    proteinPerBaseUnit: 2.5,
    carbsPerBaseUnit: 28.1,
    fatPerBaseUnit: 0.2,
  },
};

describe('parseEstimateSource', () => {
  test('reads a description estimate', () => {
    expect(parseEstimateSource('description')).toBe('description');
  });

  test('treats anything else, or nothing, as a photo estimate', () => {
    expect(parseEstimateSource('photo')).toBe('photo');
    expect(parseEstimateSource(undefined)).toBe('photo');
  });
});

describe('toggleExcludedItem', () => {
  test('excludes an included item', () => {
    expect(toggleExcludedItem(new Set(), 1)).toEqual(new Set([1]));
  });

  test('includes an excluded item again', () => {
    expect(toggleExcludedItem(new Set([0, 1]), 1)).toEqual(new Set([0]));
  });

  test('never changes the set it was given', () => {
    const excludedIndexes = new Set([0]);

    toggleExcludedItem(excludedIndexes, 1);

    expect(excludedIndexes).toEqual(new Set([0]));
  });
});

describe('selectIncludedItems', () => {
  test('drops the excluded items', () => {
    expect(selectIncludedItems([chicken, rice], new Set([0]))).toEqual([rice]);
  });
});

describe('sumEstimatedNutrition', () => {
  test('adds up the included items', () => {
    expect(sumEstimatedNutrition([chicken, rice])).toEqual({ calories: 496, protein: 53, carbs: 56.2, fat: 4.9 });
  });

  test('is zero when every item is excluded', () => {
    expect(sumEstimatedNutrition([])).toEqual({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  });
});

describe('toEstimatedItemRequests', () => {
  test('sends each item back with its own estimated food and no catalog food', () => {
    expect(toEstimatedItemRequests([chicken])).toEqual([
      { foodId: null, quantity: 150, unit: 'Gram', estimatedFood: chicken.estimatedFood },
    ]);
  });
});

describe('toEstimateCaptureRequest', () => {
  test('saves the estimate as the meal capture', () => {
    const estimate: MealEstimate = { captureId: CaptureId, hasPhoto: true, description: 'o frango é grelhado', items: [chicken] };

    expect(toEstimateCaptureRequest(estimate)).toEqual({ id: CaptureId, hasPhoto: true, description: 'o frango é grelhado' });
  });
});

describe('formatEstimateSourceLabel', () => {
  test('names where the estimate came from', () => {
    expect(formatEstimateSourceLabel(true)).toBe('Pela foto');
    expect(formatEstimateSourceLabel(false)).toBe('Pela descrição');
  });
});

describe('formatAnalyzingMessage', () => {
  test('says what is being read while the estimate runs', () => {
    expect(formatAnalyzingMessage(true)).toBe('Identificando os alimentos da foto');
    expect(formatAnalyzingMessage(false)).toBe('Lendo sua descrição');
  });
});

describe('formatEstimatedItemSummary', () => {
  test('shows the amount and the calories', () => {
    expect(formatEstimatedItemSummary(chicken, 'g')).toBe('150 g · 240 kcal');
  });
});
