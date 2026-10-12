import { resolveAddMealBackLabel } from './add-meal-back-label';

describe('resolveAddMealBackLabel', () => {
  test('names the meal when foods are being added to an existing one', () => {
    expect(resolveAddMealBackLabel(true)).toBe('Refeição');
  });

  test('is a plain back label when starting a new meal', () => {
    expect(resolveAddMealBackLabel(false)).toBe('Voltar');
  });
});
