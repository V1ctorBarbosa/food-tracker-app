import { ProfileFormSchema, ProfileFormSteps, getStepValidationMessage, parseDisplayValue } from './profile-form-schema';
import type { ProfileFormValues } from './profile-form-schema';

const nameStep = ProfileFormSteps.find((step) => step.key === 'name')!;
const ageStep = ProfileFormSteps.find((step) => step.key === 'age')!;
const genderStep = ProfileFormSteps.find((step) => step.key === 'gender')!;

const validAnswers: ProfileFormValues = {
  name: '  Victor Barbosa  ',
  age: 30,
  heightCentimeters: 175,
  gender: 'Male',
  activityLevel: 'Moderate',
  targetWeightKilograms: 75,
  desiredCalorieDeficit: 500,
  dailyCalorieTarget: 2200,
  dailyWaterTargetMilliliters: null,
  dailyProteinTargetGrams: null,
  dailyCarbsTargetGrams: null,
  dailyFatTargetGrams: null,
};

describe('ProfileFormSchema', () => {
  it('accepts a complete, valid set of answers and trims the name', () => {
    const result = ProfileFormSchema.safeParse(validAnswers);

    expect(result.success).toBe(true);
    expect(result.data?.name).toBe('Victor Barbosa');
  });

  it.each([
    ['age', null, false],
    ['age', 12, false],
    ['age', 13, true],
    ['age', 120, true],
    ['age', 121, false],
  ] as const)('required number field %s = %p is valid: %p', (field, value, expected) => {
    const result = ProfileFormSchema.safeParse({ ...validAnswers, [field]: value });

    expect(result.success).toBe(expected);
  });

  it.each([
    [null, true],
    [29, false],
    [75, true],
    [301, false],
  ])('optional, backend-nullable field targetWeightKilograms = %p is valid: %p', (value, expected) => {
    const result = ProfileFormSchema.safeParse({ ...validAnswers, targetWeightKilograms: value });

    expect(result.success).toBe(expected);
  });

  it('rejects a missing gender', () => {
    const result = ProfileFormSchema.safeParse({ ...validAnswers, gender: null });

    expect(result.success).toBe(false);
  });

  it('resolves a blank desiredCalorieDeficit to its default (maintenance, 0) instead of failing', () => {
    const result = ProfileFormSchema.safeParse({ ...validAnswers, desiredCalorieDeficit: null });

    expect(result.success).toBe(true);
    expect(result.data?.desiredCalorieDeficit).toBe(0);
  });

  it('resolves a blank dailyCalorieTarget to its default instead of failing', () => {
    const result = ProfileFormSchema.safeParse({ ...validAnswers, dailyCalorieTarget: null });

    expect(result.success).toBe(true);
    expect(result.data?.dailyCalorieTarget).toBe(2000);
  });

  it('still enforces the range on desiredCalorieDeficit when a value is provided', () => {
    const result = ProfileFormSchema.safeParse({ ...validAnswers, desiredCalorieDeficit: 2000 });

    expect(result.success).toBe(false);
  });
});

describe('getStepValidationMessage', () => {
  it('returns null when there is no error', () => {
    expect(getStepValidationMessage(ageStep, false)).toBeNull();
  });

  it('asks for a value on a required text step', () => {
    expect(getStepValidationMessage(nameStep, true)).toBe('Preencha um valor.');
  });

  it('asks to choose an option on a select step', () => {
    expect(getStepValidationMessage(genderStep, true)).toBe('Escolha uma opção.');
  });

  it('reports the valid range on a number step', () => {
    expect(getStepValidationMessage(ageStep, true)).toBe('Digite um valor entre 13 e 120.');
  });

  it('reports the water step range in liters, not the stored milliliters', () => {
    const waterStep = ProfileFormSteps.find((step) => step.key === 'dailyWaterTargetMilliliters')!;

    expect(getStepValidationMessage(waterStep, true)).toBe('Digite um valor entre 0 e 10.');
  });
});

describe('parseDisplayValue', () => {
  it('returns null for blank input', () => {
    expect(parseDisplayValue('', 1)).toBeNull();
    expect(parseDisplayValue('   ', 1000)).toBeNull();
  });

  it('passes the value through unchanged when unitScale is 1', () => {
    expect(parseDisplayValue('30', 1)).toBe(30);
  });

  it('converts liters typed by the user into the stored milliliters', () => {
    expect(parseDisplayValue('4', 1000)).toBe(4000);
    expect(parseDisplayValue('2.5', 1000)).toBe(2500);
  });

  it('returns null for non-numeric input', () => {
    expect(parseDisplayValue('abc', 1000)).toBeNull();
  });
});
