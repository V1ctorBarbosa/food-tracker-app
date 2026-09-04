import { z } from 'zod';

import type { ActivityLevel, Gender } from '@/entities/profile';

const MinimumAge = 13;
const MaximumAge = 120;
const MinimumHeightCentimeters = 100;
const MaximumHeightCentimeters = 250;
const MinimumWeightKilograms = 30;
const MaximumWeightKilograms = 300;
const MinimumCalorieDeficit = 0;
const MaximumCalorieDeficit = 1500;
const MinimumDailyCalorieTarget = 800;
const MaximumDailyCalorieTarget = 6000;
const MinimumWaterTargetMilliliters = 0;
const MaximumWaterTargetMilliliters = 10000;
const MinimumMacroGrams = 0;
const MaximumMacroGrams = 600;

/** The backend stores water in milliliters, but liters read more naturally for a daily goal. */
const WaterLitersToMillilitersScale = 1000;

/** Reasonable, editable-later guesses used when these two steps are left blank. */
const DefaultDesiredCalorieDeficitWhenSkipped = 0;
const DefaultDailyCalorieTargetWhenSkipped = 2000;

/**
 * A required number. Its RHF field type is `number | null` (every number step starts null while
 * editing -- see OnboardingFormValues), so the schema must accept null structurally; `.nullable()`
 * would treat null as a valid value bypassing min/max, so `.refine` rejects it explicitly instead.
 */
function requiredNumberInRange(minimum: number, maximum: number) {
  return z
    .number()
    .min(minimum)
    .max(maximum)
    .nullable()
    .refine((value): value is number => value !== null);
}

/** An optional, backend-nullable number: null is accepted as-is, bypassing the range check. */
function nullableNumberInRange(minimum: number, maximum: number) {
  return z.number().min(minimum).max(maximum).nullable();
}

/** An optional-in-the-wizard but backend-required number: null resolves to `defaultValue`. */
function numberInRangeWithDefault(minimum: number, maximum: number, defaultValue: number) {
  return z
    .number()
    .min(minimum)
    .max(maximum)
    .nullable()
    .transform((value) => value ?? defaultValue);
}

const GenderValues = ['Male', 'Female', 'TransMale', 'TransFemale', 'Nonbinary', 'Other'] as const;
const ActivityLevelValues = ['Sedentary', 'Light', 'Moderate', 'Active', 'VeryActive'] as const;

/** Same null-accepting-but-rejecting shape as requiredNumberInRange, for the two select steps. */
function requiredEnum<TValue extends string>(values: readonly [TValue, ...TValue[]]) {
  return z
    .enum(values)
    .nullable()
    .refine((value): value is TValue => value !== null);
}

export const GenderOptions: readonly { value: Gender; label: string }[] = [
  { value: 'Male', label: 'Masculino' },
  { value: 'Female', label: 'Feminino' },
  { value: 'TransMale', label: 'Homem trans' },
  { value: 'TransFemale', label: 'Mulher trans' },
  { value: 'Nonbinary', label: 'Não binário' },
  { value: 'Other', label: 'Outro' },
];

export const ActivityLevelOptions: readonly { value: ActivityLevel; label: string }[] = [
  { value: 'Sedentary', label: 'Sedentário, pouco ou nenhum exercício' },
  { value: 'Light', label: 'Leve, 1 a 3 dias por semana' },
  { value: 'Moderate', label: 'Moderado, 3 a 5 dias por semana' },
  { value: 'Active', label: 'Ativo, 6 a 7 dias por semana' },
  { value: 'VeryActive', label: 'Muito ativo, exercício pesado todo dia' },
];

/**
 * The shape RHF holds WHILE editing: every field starts null/empty and only needs to satisfy the
 * schema once the wizard actually reaches (and validates) that step. `handleSubmit`'s output --
 * once every step has validated -- is `UpsertUserProfileRequest` (see OnboardingFormSchema below).
 */
export type OnboardingFormValues = {
  name: string;
  age: number | null;
  heightCentimeters: number | null;
  gender: Gender | null;
  activityLevel: ActivityLevel | null;
  targetWeightKilograms: number | null;
  desiredCalorieDeficit: number | null;
  dailyCalorieTarget: number | null;
  dailyWaterTargetMilliliters: number | null;
  dailyProteinTargetGrams: number | null;
  dailyCarbsTargetGrams: number | null;
  dailyFatTargetGrams: number | null;
};

export const OnboardingDefaultValues: OnboardingFormValues = {
  name: '',
  age: null,
  heightCentimeters: null,
  gender: null,
  activityLevel: null,
  targetWeightKilograms: null,
  desiredCalorieDeficit: null,
  dailyCalorieTarget: null,
  dailyWaterTargetMilliliters: null,
  dailyProteinTargetGrams: null,
  dailyCarbsTargetGrams: null,
  dailyFatTargetGrams: null,
};

export const OnboardingFormSchema = z.object({
  name: z.string().trim().min(1),
  age: requiredNumberInRange(MinimumAge, MaximumAge),
  heightCentimeters: requiredNumberInRange(MinimumHeightCentimeters, MaximumHeightCentimeters),
  gender: requiredEnum(GenderValues),
  activityLevel: requiredEnum(ActivityLevelValues),
  targetWeightKilograms: nullableNumberInRange(MinimumWeightKilograms, MaximumWeightKilograms),
  desiredCalorieDeficit: numberInRangeWithDefault(MinimumCalorieDeficit, MaximumCalorieDeficit, DefaultDesiredCalorieDeficitWhenSkipped),
  dailyCalorieTarget: numberInRangeWithDefault(
    MinimumDailyCalorieTarget,
    MaximumDailyCalorieTarget,
    DefaultDailyCalorieTargetWhenSkipped,
  ),
  dailyWaterTargetMilliliters: nullableNumberInRange(MinimumWaterTargetMilliliters, MaximumWaterTargetMilliliters),
  dailyProteinTargetGrams: nullableNumberInRange(MinimumMacroGrams, MaximumMacroGrams),
  dailyCarbsTargetGrams: nullableNumberInRange(MinimumMacroGrams, MaximumMacroGrams),
  dailyFatTargetGrams: nullableNumberInRange(MinimumMacroGrams, MaximumMacroGrams),
});

/** Should structurally match UpsertUserProfileRequest -- passing it straight to the mutation is what proves that. */
export type OnboardingFormOutput = z.infer<typeof OnboardingFormSchema>;

type TextStep = { kind: 'text'; key: 'name'; question: string; placeholder: string; optional: false };

type NumberFieldKey =
  | 'age'
  | 'heightCentimeters'
  | 'targetWeightKilograms'
  | 'desiredCalorieDeficit'
  | 'dailyCalorieTarget'
  | 'dailyWaterTargetMilliliters'
  | 'dailyProteinTargetGrams'
  | 'dailyCarbsTargetGrams'
  | 'dailyFatTargetGrams';

type NumberStep = {
  kind: 'number';
  key: NumberFieldKey;
  question: string;
  /** Extra context beyond the unit (already shown next to the input) -- null when there's none. */
  helperText: string | null;
  unitLabel: string;
  optional: boolean;
  /** Displayed/entered bounds, already in `unitLabel`'s unit (e.g. liters), not the stored unit. */
  minimum: number;
  maximum: number;
  /** How many stored units (the schema's unit) make up one displayed unit -- 1 unless converted. */
  unitScale: number;
};

type SelectStep = {
  kind: 'select';
  key: 'gender' | 'activityLevel';
  question: string;
  options: readonly { value: string; label: string }[];
  optional: false;
};

export type OnboardingStep = TextStep | NumberStep | SelectStep;

export const OnboardingSteps: readonly OnboardingStep[] = [
  { kind: 'text', key: 'name', question: 'Como podemos te chamar?', placeholder: 'Seu nome', optional: false },
  {
    kind: 'number',
    key: 'age',
    question: 'Qual sua idade?',
    helperText: null,
    unitLabel: 'anos',
    optional: false,
    minimum: MinimumAge,
    maximum: MaximumAge,
    unitScale: 1,
  },
  {
    kind: 'number',
    key: 'heightCentimeters',
    question: 'Qual sua altura?',
    helperText: null,
    unitLabel: 'cm',
    optional: false,
    minimum: MinimumHeightCentimeters,
    maximum: MaximumHeightCentimeters,
    unitScale: 1,
  },
  { kind: 'select', key: 'gender', question: 'Qual seu gênero?', options: GenderOptions, optional: false },
  { kind: 'select', key: 'activityLevel', question: 'Qual seu nível de atividade?', options: ActivityLevelOptions, optional: false },
  {
    kind: 'number',
    key: 'targetWeightKilograms',
    question: 'Qual seu peso alvo?',
    helperText: 'Pule se ainda não tiver certeza',
    unitLabel: 'kg',
    optional: true,
    minimum: MinimumWeightKilograms,
    maximum: MaximumWeightKilograms,
    unitScale: 1,
  },
  {
    kind: 'number',
    key: 'desiredCalorieDeficit',
    question: 'Qual déficit calórico diário você busca?',
    helperText: 'Abaixo da manutenção. Pule se não tiver um valor em mente',
    unitLabel: 'kcal',
    optional: true,
    minimum: MinimumCalorieDeficit,
    maximum: MaximumCalorieDeficit,
    unitScale: 1,
  },
  {
    kind: 'number',
    key: 'dailyCalorieTarget',
    question: 'Qual sua meta diária de calorias?',
    helperText: 'Pule se não tiver certeza. Você pode mudar depois',
    unitLabel: 'kcal',
    optional: true,
    minimum: MinimumDailyCalorieTarget,
    maximum: MaximumDailyCalorieTarget,
    unitScale: 1,
  },
  {
    kind: 'number',
    key: 'dailyWaterTargetMilliliters',
    question: 'Qual sua meta diária de água?',
    helperText: 'Pule se não tiver uma meta',
    unitLabel: 'L',
    optional: true,
    minimum: MinimumWaterTargetMilliliters / WaterLitersToMillilitersScale,
    maximum: MaximumWaterTargetMilliliters / WaterLitersToMillilitersScale,
    unitScale: WaterLitersToMillilitersScale,
  },
  {
    kind: 'number',
    key: 'dailyProteinTargetGrams',
    question: 'Qual sua meta diária de proteína?',
    helperText: 'Pule se não tiver uma meta',
    unitLabel: 'g',
    optional: true,
    minimum: MinimumMacroGrams,
    maximum: MaximumMacroGrams,
    unitScale: 1,
  },
  {
    kind: 'number',
    key: 'dailyCarbsTargetGrams',
    question: 'Qual sua meta diária de carboidrato?',
    helperText: 'Pule se não tiver uma meta',
    unitLabel: 'g',
    optional: true,
    minimum: MinimumMacroGrams,
    maximum: MaximumMacroGrams,
    unitScale: 1,
  },
  {
    kind: 'number',
    key: 'dailyFatTargetGrams',
    question: 'Qual sua meta diária de gordura?',
    helperText: 'Pule se não tiver uma meta',
    unitLabel: 'g',
    optional: true,
    minimum: MinimumMacroGrams,
    maximum: MaximumMacroGrams,
    unitScale: 1,
  },
];

/** Human-readable reason the current step's field can't be submitted yet, driven by RHF's own error state. */
export function getStepValidationMessage(step: OnboardingStep, hasError: boolean): string | null {
  if (!hasError) {
    return null;
  }

  if (step.kind === 'text') {
    return 'Preencha um valor.';
  }

  if (step.kind === 'select') {
    return 'Escolha uma opção.';
  }

  return `Digite um valor entre ${step.minimum} e ${step.maximum}.`;
}

/** Parses the text typed in a number step's (possibly scaled) display unit into the stored unit. */
export function parseDisplayValue(text: string, unitScale: number): number | null {
  if (text.trim().length === 0) {
    return null;
  }

  const parsedDisplayValue = Number(text);
  return Number.isNaN(parsedDisplayValue) ? null : Math.round(parsedDisplayValue * unitScale);
}
