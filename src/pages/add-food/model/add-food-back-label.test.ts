import { resolveAddFoodBackLabel } from './add-food-back-label';

describe('resolveAddFoodBackLabel', () => {
  test('names the meal when foods are being added to an existing one', () => {
    expect(resolveAddFoodBackLabel(true)).toBe('Refeição');
  });

  test('is a plain back label when starting a new meal', () => {
    expect(resolveAddFoodBackLabel(false)).toBe('Voltar');
  });
});
