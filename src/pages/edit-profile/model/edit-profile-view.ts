import type { ProfileFormValues, UserProfile } from '@/entities/profile';

/** The profile's editable fields, in the shape react-hook-form needs -- drops the read-only id. */
export function buildFormValuesFromProfile(profile: UserProfile): ProfileFormValues {
  return {
    name: profile.name,
    age: profile.age,
    heightCentimeters: profile.heightCentimeters,
    gender: profile.gender,
    activityLevel: profile.activityLevel,
    targetWeightKilograms: profile.targetWeightKilograms,
    desiredCalorieDeficit: profile.desiredCalorieDeficit,
    dailyCalorieTarget: profile.dailyCalorieTarget,
    dailyWaterTargetMilliliters: profile.dailyWaterTargetMilliliters,
    dailyProteinTargetGrams: profile.dailyProteinTargetGrams,
    dailyCarbsTargetGrams: profile.dailyCarbsTargetGrams,
    dailyFatTargetGrams: profile.dailyFatTargetGrams,
  };
}
