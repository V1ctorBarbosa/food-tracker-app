export type Gender = 'Male' | 'Female' | 'TransMale' | 'TransFemale' | 'Nonbinary' | 'Other';

export type ActivityLevel = 'Sedentary' | 'Light' | 'Moderate' | 'Active' | 'VeryActive';

export type UserProfile = {
  id: string;
  name: string;
  age: number;
  heightCentimeters: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  targetWeightKilograms: number | null;
  desiredCalorieDeficit: number;
  dailyCalorieTarget: number;
  dailyWaterTargetMilliliters: number | null;
  dailyProteinTargetGrams: number | null;
  dailyCarbsTargetGrams: number | null;
  dailyFatTargetGrams: number | null;
  /** Whether this account may use the AI photo and description estimates. Decided by the API, never sent back. */
  canEstimateMeals: boolean;
};

export type UpsertUserProfileRequest = Omit<UserProfile, 'id' | 'canEstimateMeals'>;
