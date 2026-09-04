import * as httpClient from '@/shared/api/http-client';
import { ApiError } from '@/shared/api/http-client';

import { fetchProfileOrNull } from './use-profile-query';
import type { UserProfile } from './profile.types';

jest.mock('@/shared/api/firebase', () => ({ auth: {} }));
jest.mock('firebase/auth', () => ({ onAuthStateChanged: jest.fn() }));

describe('fetchProfileOrNull', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns the profile when the request succeeds', async () => {
    const profile: UserProfile = {
      id: 'user-1',
      name: 'Victor',
      age: 30,
      heightCentimeters: 175,
      gender: 'Male',
      activityLevel: 'Moderate',
      targetWeightKilograms: 75,
      desiredCalorieDeficit: 500,
      dailyCalorieTarget: 2200,
      dailyWaterTargetMilliliters: 2500,
      dailyProteinTargetGrams: 150,
      dailyCarbsTargetGrams: 220,
      dailyFatTargetGrams: 70,
    };
    jest.spyOn(httpClient, 'getJson').mockResolvedValue(profile);

    await expect(fetchProfileOrNull()).resolves.toEqual(profile);
  });

  it('returns null when the profile does not exist yet (404)', async () => {
    jest.spyOn(httpClient, 'getJson').mockRejectedValue(new ApiError(404, 'Request failed with status 404.'));

    await expect(fetchProfileOrNull()).resolves.toBeNull();
  });

  it('rethrows non-404 errors', async () => {
    const serverError = new ApiError(500, 'Request failed with status 500.');
    jest.spyOn(httpClient, 'getJson').mockRejectedValue(serverError);

    await expect(fetchProfileOrNull()).rejects.toBe(serverError);
  });
});
