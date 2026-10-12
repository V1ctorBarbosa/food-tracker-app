import { buildAddMealOptions, resolveAddMealFootnote } from './add-meal-options';

describe('buildAddMealOptions', () => {
  test('offers the four options, in order, when the account can estimate meals', () => {
    const optionIds = buildAddMealOptions(true).map((option) => option.id);

    expect(optionIds).toEqual(['food', 'drink', 'photo', 'description']);
  });

  test('offers only foods and drinks when the account cannot estimate meals', () => {
    const optionIds = buildAddMealOptions(false).map((option) => option.id);

    expect(optionIds).toEqual(['food', 'drink']);
  });

  test('marks only the photo and description options as estimated by AI', () => {
    const aiOptionIds = buildAddMealOptions(true)
      .filter((option) => option.isEstimatedByAi)
      .map((option) => option.id);

    expect(aiOptionIds).toEqual(['photo', 'description']);
  });
});

describe('resolveAddMealFootnote', () => {
  test('explains the AI options when they are offered', () => {
    expect(resolveAddMealFootnote(true)).toBe('Foto e descrição geram uma estimativa. Você revisa os itens antes de salvar.');
  });

  test('has no note when they are not', () => {
    expect(resolveAddMealFootnote(false)).toBeNull();
  });
});
