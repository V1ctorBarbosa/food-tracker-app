import {
  InitialOnboardingAnswers,
  OnboardingSteps,
  buildUpsertProfileRequest,
  getStepValidationMessage,
  isStepAnswerValid,
  resolveAnswersForStep,
} from './onboarding-steps';
import type { OnboardingAnswers } from './onboarding-steps';

const nameStep = OnboardingSteps.find((step) => step.key === 'name')!;
const ageStep = OnboardingSteps.find((step) => step.key === 'age')!;
const targetWeightStep = OnboardingSteps.find((step) => step.key === 'targetWeightKilograms')!;
const genderStep = OnboardingSteps.find((step) => step.key === 'gender')!;
const desiredCalorieDeficitStep = OnboardingSteps.find((step) => step.key === 'desiredCalorieDeficit')!;

describe('isStepAnswerValid', () => {
  it.each([
    ['', false],
    ['   ', false],
    ['Victor', true],
  ])('text step with name %p is valid: %p', (name, expected) => {
    expect(isStepAnswerValid(nameStep, { ...InitialOnboardingAnswers, name })).toBe(expected);
  });

  it.each([
    [null, false],
    [12, false],
    [13, true],
    [30, true],
    [120, true],
    [121, false],
  ])('required number step with age %p is valid: %p', (age, expected) => {
    expect(isStepAnswerValid(ageStep, { ...InitialOnboardingAnswers, age })).toBe(expected);
  });

  it.each([
    [null, true],
    [29, false],
    [75, true],
    [301, false],
  ])('optional number step with targetWeightKilograms %p is valid: %p', (targetWeightKilograms, expected) => {
    expect(isStepAnswerValid(targetWeightStep, { ...InitialOnboardingAnswers, targetWeightKilograms })).toBe(expected);
  });

  it.each([
    [null, false],
    ['Male', true],
    ['Nonbinary', true],
  ])('select step with gender %p is valid: %p', (gender, expected) => {
    expect(isStepAnswerValid(genderStep, { ...InitialOnboardingAnswers, gender: gender as OnboardingAnswers['gender'] })).toBe(
      expected,
    );
  });
});

describe('buildUpsertProfileRequest', () => {
  const completeAnswers: OnboardingAnswers = {
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

  it('trims the name and passes required fields through', () => {
    const request = buildUpsertProfileRequest(completeAnswers);

    expect(request).toEqual({
      name: 'Victor Barbosa',
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
    });
  });

  it('throws when a required field is still missing', () => {
    const incompleteAnswers = { ...completeAnswers, gender: null };

    expect(() => buildUpsertProfileRequest(incompleteAnswers)).toThrow('Onboarding answers are incomplete.');
  });
});

describe('getStepValidationMessage', () => {
  it('returns null when the answer is already valid', () => {
    expect(getStepValidationMessage(ageStep, { ...InitialOnboardingAnswers, age: 30 })).toBeNull();
  });

  it('asks for a value on an empty required text step', () => {
    expect(getStepValidationMessage(nameStep, { ...InitialOnboardingAnswers, name: '' })).toBe('Please enter a value.');
  });

  it('asks to choose an option on an empty select step', () => {
    expect(getStepValidationMessage(genderStep, InitialOnboardingAnswers)).toBe('Please choose one option.');
  });

  it('has no message for an empty optional number step -- an empty answer is already valid there', () => {
    expect(getStepValidationMessage(targetWeightStep, InitialOnboardingAnswers)).toBeNull();
  });

  it('asks for a value on an empty required number step (no skip offered)', () => {
    expect(getStepValidationMessage(ageStep, InitialOnboardingAnswers)).toBe('Please enter a value.');
  });

  it('reports the valid range when the number is out of bounds', () => {
    expect(getStepValidationMessage(ageStep, { ...InitialOnboardingAnswers, age: 200 })).toBe('Enter a value between 13 and 120.');
  });
});

describe('resolveAnswersForStep', () => {
  it('leaves the answers untouched when the current step already has a value', () => {
    const answers = { ...InitialOnboardingAnswers, targetWeightKilograms: 75 };

    expect(resolveAnswersForStep(targetWeightStep, answers)).toBe(answers);
  });

  it('leaves the answers untouched for a required step', () => {
    expect(resolveAnswersForStep(ageStep, InitialOnboardingAnswers)).toBe(InitialOnboardingAnswers);
  });

  it("fills in the step's skip value when an optional numeric step was left empty", () => {
    const resolved = resolveAnswersForStep(desiredCalorieDeficitStep, InitialOnboardingAnswers);

    expect(resolved.desiredCalorieDeficit).toBe(0);
  });
});
