import type { UserProfile } from '@/entities/profile';

import { buildFormValuesFromProfile } from './edit-profile-view';

jest.mock('@/shared/api/firebase', () => ({ auth: {} }));
jest.mock('firebase/auth', () => ({ onAuthStateChanged: jest.fn() }));

describe('buildFormValuesFromProfile', () => {
  test('carries every editable field over, dropping the read-only id', () => {
    const profile: UserProfile = {
      id: 'user-1',
      name: 'Victor',
      age: 30,
      heightCentimeters: 178,
      gender: 'Male',
      activityLevel: 'Moderate',
      targetWeightKilograms: 75.5,
      desiredCalorieDeficit: 300,
      dailyCalorieTarget: 2200,
      dailyWaterTargetMilliliters: 2500,
      dailyProteinTargetGrams: 140,
      dailyCarbsTargetGrams: 220,
      dailyFatTargetGrams: 65,
    };

    expect(buildFormValuesFromProfile(profile)).toEqual({
      name: 'Victor',
      age: 30,
      heightCentimeters: 178,
      gender: 'Male',
      activityLevel: 'Moderate',
      targetWeightKilograms: 75.5,
      desiredCalorieDeficit: 300,
      dailyCalorieTarget: 2200,
      dailyWaterTargetMilliliters: 2500,
      dailyProteinTargetGrams: 140,
      dailyCarbsTargetGrams: 220,
      dailyFatTargetGrams: 65,
    });
  });
});
