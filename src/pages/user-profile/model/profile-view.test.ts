import type { UserProfile } from '@/entities/profile';

import { buildBodyStatRows, buildTargetRows } from './profile-view';

// @/entities/profile's barrel also re-exports useProfileQuery, which pulls in firebase/auth
// transitively through the session entity -- mocked here so importing the barrel's pure label
// functions doesn't require Firebase's ESM build to run under Jest.
jest.mock('@/shared/api/firebase', () => ({ auth: {} }));
jest.mock('firebase/auth', () => ({ onAuthStateChanged: jest.fn() }));

const baseProfile: UserProfile = {
  id: 'user-1',
  name: 'Victor',
  age: 30,
  heightCentimeters: 178,
  gender: 'Male',
  activityLevel: 'Moderate',
  targetWeightKilograms: null,
  desiredCalorieDeficit: 300,
  dailyCalorieTarget: 2200,
  dailyWaterTargetMilliliters: null,
  dailyProteinTargetGrams: null,
  dailyCarbsTargetGrams: null,
  dailyFatTargetGrams: null,
  canEstimateMeals: false,
};

describe('buildBodyStatRows', () => {
  test('formats age, height, gender, and activity level as readable rows', () => {
    expect(buildBodyStatRows(baseProfile)).toEqual([
      { label: 'Idade', value: '30 anos' },
      { label: 'Altura', value: '178 cm' },
      { label: 'Gênero', value: 'Masculino' },
      { label: 'Nível de atividade', value: 'Moderado' },
    ]);
  });
});

describe('buildTargetRows', () => {
  test('always includes calories, since it is the only required target', () => {
    expect(buildTargetRows(baseProfile)).toEqual([{ label: 'Calorias', value: '2.200 kcal' }]);
  });

  test('omits every optional target left unset', () => {
    const rows = buildTargetRows(baseProfile);

    expect(rows.map((row) => row.label)).toEqual(['Calorias']);
  });

  test('includes each optional target only when it has been set, converting water to liters', () => {
    const profileWithTargets: UserProfile = {
      ...baseProfile,
      targetWeightKilograms: 75.5,
      dailyWaterTargetMilliliters: 2500,
      dailyProteinTargetGrams: 140,
      dailyCarbsTargetGrams: 220,
      dailyFatTargetGrams: 65,
    };

    expect(buildTargetRows(profileWithTargets)).toEqual([
      { label: 'Calorias', value: '2.200 kcal' },
      { label: 'Peso alvo', value: '75,5 kg' },
      { label: 'Água', value: '2,5 L' },
      { label: 'Proteína', value: '140g' },
      { label: 'Carboidrato', value: '220g' },
      { label: 'Gordura', value: '65g' },
    ]);
  });
});
