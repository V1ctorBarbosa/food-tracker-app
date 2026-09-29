import { getActivityLevelLabel, getGenderLabel, type UserProfile } from '@/entities/profile';
import { formatMaxDecimals } from '@/shared/lib/format';

export type ProfileStatRow = {
  label: string;
  value: string;
};

const CalorieDecimalPlaces = 0;
const WeightDecimalPlaces = 1;
const GramsDecimalPlaces = 1;
const LitersDecimalPlaces = 1;
const MillilitersPerLiter = 1000;

export function buildBodyStatRows(profile: UserProfile): ProfileStatRow[] {
  return [
    { label: 'Idade', value: `${profile.age} anos` },
    { label: 'Altura', value: `${profile.heightCentimeters} cm` },
    { label: 'Gênero', value: getGenderLabel(profile.gender) },
    { label: 'Nível de atividade', value: getActivityLevelLabel(profile.activityLevel) },
  ];
}

/** Daily targets set during onboarding; only calories is required, so the rest are shown only when set. */
export function buildTargetRows(profile: UserProfile): ProfileStatRow[] {
  const rows: ProfileStatRow[] = [
    { label: 'Calorias', value: `${formatMaxDecimals(profile.dailyCalorieTarget, CalorieDecimalPlaces)} kcal` },
  ];

  if (profile.targetWeightKilograms !== null) {
    rows.push({ label: 'Peso alvo', value: `${formatMaxDecimals(profile.targetWeightKilograms, WeightDecimalPlaces)} kg` });
  }

  if (profile.dailyWaterTargetMilliliters !== null) {
    const liters = profile.dailyWaterTargetMilliliters / MillilitersPerLiter;
    rows.push({ label: 'Água', value: `${formatMaxDecimals(liters, LitersDecimalPlaces)} L` });
  }

  if (profile.dailyProteinTargetGrams !== null) {
    rows.push({ label: 'Proteína', value: `${formatMaxDecimals(profile.dailyProteinTargetGrams, GramsDecimalPlaces)}g` });
  }

  if (profile.dailyCarbsTargetGrams !== null) {
    rows.push({ label: 'Carboidrato', value: `${formatMaxDecimals(profile.dailyCarbsTargetGrams, GramsDecimalPlaces)}g` });
  }

  if (profile.dailyFatTargetGrams !== null) {
    rows.push({ label: 'Gordura', value: `${formatMaxDecimals(profile.dailyFatTargetGrams, GramsDecimalPlaces)}g` });
  }

  return rows;
}
