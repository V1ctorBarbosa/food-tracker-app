import type { ActivityLevel, Gender, UpsertUserProfileRequest } from '@/entities/profile';

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

/** A reasonable, editable-later guess used when the calorie target step is skipped. */
const DefaultDailyCalorieTargetWhenSkipped = 2000;

const GenderOptions: readonly { value: Gender; label: string }[] = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'TransMale', label: 'Trans male' },
  { value: 'TransFemale', label: 'Trans female' },
  { value: 'Nonbinary', label: 'Nonbinary' },
  { value: 'Other', label: 'Other' },
];

const ActivityLevelOptions: readonly { value: ActivityLevel; label: string }[] = [
  { value: 'Sedentary', label: 'Sedentary — little to no exercise' },
  { value: 'Light', label: 'Light — 1-3 days/week' },
  { value: 'Moderate', label: 'Moderate — 3-5 days/week' },
  { value: 'Active', label: 'Active — 6-7 days/week' },
  { value: 'VeryActive', label: 'Very active — hard daily exercise' },
];

export type OnboardingAnswers = {
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

export const InitialOnboardingAnswers: OnboardingAnswers = {
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

type TextStep = { kind: 'text'; key: 'name'; question: string; placeholder: string };

type NumberFieldKey = Exclude<keyof OnboardingAnswers, 'name' | 'gender' | 'activityLevel'>;

type RequiredNumberStep = {
  kind: 'number';
  optional: false;
  key: NumberFieldKey;
  question: string;
  helperText: string;
  unitLabel: string;
  minimum: number;
  maximum: number;
};

type OptionalNumberStep = {
  kind: 'number';
  optional: true;
  key: NumberFieldKey;
  question: string;
  helperText: string;
  unitLabel: string;
  minimum: number;
  maximum: number;
  /** Value written to the answer when the user skips this step instead of typing one. */
  skipValue: number | null;
};

type NumberStep = RequiredNumberStep | OptionalNumberStep;

type SelectStep = {
  kind: 'select';
  key: 'gender' | 'activityLevel';
  question: string;
  options: readonly { value: string; label: string }[];
};

export type OnboardingStep = TextStep | NumberStep | SelectStep;

export const OnboardingSteps: readonly OnboardingStep[] = [
  { kind: 'text', key: 'name', question: 'What should we call you?', placeholder: 'Your name' },
  {
    kind: 'number',
    key: 'age',
    question: 'How old are you?',
    helperText: 'years',
    unitLabel: 'yrs',
    optional: false,
    minimum: MinimumAge,
    maximum: MaximumAge,
  },
  {
    kind: 'number',
    key: 'heightCentimeters',
    question: 'How tall are you?',
    helperText: 'centimeters',
    unitLabel: 'cm',
    optional: false,
    minimum: MinimumHeightCentimeters,
    maximum: MaximumHeightCentimeters,
  },
  { kind: 'select', key: 'gender', question: 'What is your gender?', options: GenderOptions },
  { kind: 'select', key: 'activityLevel', question: 'How active are you?', options: ActivityLevelOptions },
  {
    kind: 'number',
    key: 'targetWeightKilograms',
    question: "What's your target weight?",
    helperText: "kilograms — skip if you're not sure yet",
    unitLabel: 'kg',
    optional: true,
    minimum: MinimumWeightKilograms,
    maximum: MaximumWeightKilograms,
    skipValue: null,
  },
  {
    kind: 'number',
    key: 'desiredCalorieDeficit',
    question: 'What daily calorie deficit are you aiming for?',
    helperText: "kcal/day below maintenance — skip if you don't have one in mind",
    unitLabel: 'kcal',
    optional: true,
    minimum: MinimumCalorieDeficit,
    maximum: MaximumCalorieDeficit,
    skipValue: 0,
  },
  {
    kind: 'number',
    key: 'dailyCalorieTarget',
    question: "What's your daily calorie target?",
    helperText: "kcal/day — skip if you're not sure, you can change it later",
    unitLabel: 'kcal',
    optional: true,
    minimum: MinimumDailyCalorieTarget,
    maximum: MaximumDailyCalorieTarget,
    skipValue: DefaultDailyCalorieTargetWhenSkipped,
  },
  {
    kind: 'number',
    key: 'dailyWaterTargetMilliliters',
    question: "What's your daily water goal?",
    helperText: "milliliters — skip if you don't have one",
    unitLabel: 'mL',
    optional: true,
    minimum: MinimumWaterTargetMilliliters,
    maximum: MaximumWaterTargetMilliliters,
    skipValue: null,
  },
  {
    kind: 'number',
    key: 'dailyProteinTargetGrams',
    question: "What's your daily protein target?",
    helperText: "grams — skip if you don't have one",
    unitLabel: 'g',
    optional: true,
    minimum: MinimumMacroGrams,
    maximum: MaximumMacroGrams,
    skipValue: null,
  },
  {
    kind: 'number',
    key: 'dailyCarbsTargetGrams',
    question: "What's your daily carb target?",
    helperText: "grams — skip if you don't have one",
    unitLabel: 'g',
    optional: true,
    minimum: MinimumMacroGrams,
    maximum: MaximumMacroGrams,
    skipValue: null,
  },
  {
    kind: 'number',
    key: 'dailyFatTargetGrams',
    question: "What's your daily fat target?",
    helperText: "grams — skip if you don't have one",
    unitLabel: 'g',
    optional: true,
    minimum: MinimumMacroGrams,
    maximum: MaximumMacroGrams,
    skipValue: null,
  },
];

export function isStepAnswerValid(step: OnboardingStep, answers: OnboardingAnswers): boolean {
  if (step.kind === 'text') {
    return answers[step.key].trim().length > 0;
  }

  if (step.kind === 'select') {
    return answers[step.key] !== null;
  }

  const value = answers[step.key];
  if (value === null) {
    return step.optional;
  }

  return value >= step.minimum && value <= step.maximum;
}

/** Human-readable reason the current step's answer can't be submitted yet, or null when it's valid. */
export function getStepValidationMessage(step: OnboardingStep, answers: OnboardingAnswers): string | null {
  if (isStepAnswerValid(step, answers)) {
    return null;
  }

  if (step.kind === 'text') {
    return 'Please enter a value.';
  }

  if (step.kind === 'select') {
    return 'Please choose one option.';
  }

  // An empty answer is already valid whenever the step is optional (caught above), so reaching
  // here with a null value only happens for a required step left blank.
  if (answers[step.key] === null) {
    return 'Please enter a value.';
  }

  return `Enter a value between ${step.minimum} and ${step.maximum}.`;
}

/**
 * An optional numeric step left empty is a valid answer (`null`), but some of those fields are
 * non-nullable on the backend (e.g. `dailyCalorieTarget`) -- their `skipValue` is the concrete
 * default sent instead. Advancing past a step (Next or Skip) always goes through this so a blank
 * answer never reaches `buildUpsertProfileRequest` as `null` for one of those fields.
 */
export function resolveAnswersForStep(step: OnboardingStep, answers: OnboardingAnswers): OnboardingAnswers {
  if (step.kind !== 'number' || !step.optional || answers[step.key] !== null) {
    return answers;
  }

  return { ...answers, [step.key]: step.skipValue };
}

export function buildUpsertProfileRequest(answers: OnboardingAnswers): UpsertUserProfileRequest {
  if (
    answers.age === null ||
    answers.heightCentimeters === null ||
    answers.gender === null ||
    answers.activityLevel === null ||
    answers.desiredCalorieDeficit === null ||
    answers.dailyCalorieTarget === null
  ) {
    throw new Error('Onboarding answers are incomplete.');
  }

  return {
    name: answers.name.trim(),
    age: answers.age,
    heightCentimeters: answers.heightCentimeters,
    gender: answers.gender,
    activityLevel: answers.activityLevel,
    targetWeightKilograms: answers.targetWeightKilograms,
    desiredCalorieDeficit: answers.desiredCalorieDeficit,
    dailyCalorieTarget: answers.dailyCalorieTarget,
    dailyWaterTargetMilliliters: answers.dailyWaterTargetMilliliters,
    dailyProteinTargetGrams: answers.dailyProteinTargetGrams,
    dailyCarbsTargetGrams: answers.dailyCarbsTargetGrams,
    dailyFatTargetGrams: answers.dailyFatTargetGrams,
  };
}
