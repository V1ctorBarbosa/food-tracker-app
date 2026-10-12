import type { Meal } from '@/entities/meal';
import type { EstimatedMealItem, MealEstimate } from '@/features/meal-estimate';

import { buildAppendEstimateRequest, getEstimateComposeView, isEstimateReady } from './estimate-compose';

jest.mock('@/shared/api/firebase', () => ({ auth: {} }));
jest.mock('firebase/auth', () => ({ onAuthStateChanged: jest.fn() }));

const NewCaptureId = 'capture-new';

const chicken: EstimatedMealItem = {
  quantity: 150,
  unit: 'Gram',
  calories: 240,
  protein: 48,
  carbs: 0,
  fat: 4.5,
  estimatedFood: {
    name: 'Peito de frango grelhado',
    captureId: NewCaptureId,
    baseUnit: 'Gram',
    caloriesPerBaseUnit: 160,
    proteinPerBaseUnit: 32,
    carbsPerBaseUnit: 0,
    fatPerBaseUnit: 3,
  },
};

const existingMeal: Meal = {
  id: 'meal-1',
  loggedAt: '2026-10-12T12:30:00-03:00',
  mealType: 'Lunch',
  totalCalories: 260,
  totalProtein: 5.4,
  totalCarbs: 56,
  totalFat: 0.6,
  items: [
    { id: 'item-rice', foodId: 'food-rice', quantity: 200, unit: 'Gram', calories: 260, protein: 5.4, carbs: 56, fat: 0.6, estimatedFood: null },
  ],
  captures: [{ id: 'capture-old', hasPhoto: true, description: null, photoUrl: 'https://photos.example.test/old.jpg' }],
};

describe('getEstimateComposeView', () => {
  test('titles each source as the prototype does', () => {
    expect(getEstimateComposeView('photo').title).toBe('Foto do prato');
    expect(getEstimateComposeView('description').title).toBe('Descreva a refeição');
  });
});

describe('isEstimateReady', () => {
  test('waits for the photo on the photo option, even with a long description', () => {
    expect(isEstimateReady('photo', false, '200 g de arroz integral')).toBe(false);
  });

  test('is ready with a photo and no description', () => {
    expect(isEstimateReady('photo', true, '')).toBe(true);
  });

  test('needs a long enough description on the description option', () => {
    expect(isEstimateReady('description', false, 'almoço')).toBe(false);
    expect(isEstimateReady('description', false, '200 g de arroz integral')).toBe(true);
  });
});

describe('buildAppendEstimateRequest', () => {
  test('keeps the meal items and captures and adds the estimate after them', () => {
    const estimate: MealEstimate = { captureId: NewCaptureId, hasPhoto: true, description: 'é grelhado', items: [chicken] };

    expect(buildAppendEstimateRequest(existingMeal, estimate, [chicken])).toEqual({
      mealType: 'Lunch',
      items: [
        { foodId: 'food-rice', quantity: 200, unit: 'Gram' },
        { foodId: null, quantity: 150, unit: 'Gram', estimatedFood: chicken.estimatedFood },
      ],
      captures: [
        { id: 'capture-old', hasPhoto: true, description: null },
        { id: NewCaptureId, hasPhoto: true, description: 'é grelhado' },
      ],
    });
  });
});
