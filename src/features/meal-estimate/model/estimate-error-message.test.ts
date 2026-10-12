import { ApiError } from '@/shared/api/http-client';

import { MealEstimateErrorCode, resolveEstimateErrorMessage } from './estimate-error-message';

jest.mock('@/shared/api/firebase', () => ({ auth: {} }));
jest.mock('firebase/auth', () => ({ onAuthStateChanged: jest.fn() }));

describe('resolveEstimateErrorMessage', () => {
  test('tells the user no food was found', () => {
    const error = new ApiError(422, 'No food was recognized in this meal.', MealEstimateErrorCode.noFoodRecognized);

    expect(resolveEstimateErrorMessage(error)).toBe('Não encontramos comida aqui. Tente outra foto ou descreva a refeição.');
  });

  test('tells the user the hourly limit was reached', () => {
    const error = new ApiError(429, 'Too many requests.', MealEstimateErrorCode.tooManyRequests);

    expect(resolveEstimateErrorMessage(error)).toContain('última hora');
  });

  test('falls back to a generic message for an unknown error code', () => {
    const error = new ApiError(500, 'Boom', 'UnexpectedError');

    expect(resolveEstimateErrorMessage(error)).toBe('Não foi possível calcular essa refeição. Tente novamente.');
  });

  test('falls back to a generic message for a failure that is not from the API', () => {
    expect(resolveEstimateErrorMessage(new Error('Photo upload failed with status 403.'))).toBe(
      'Não foi possível calcular essa refeição. Tente novamente.',
    );
  });
});
