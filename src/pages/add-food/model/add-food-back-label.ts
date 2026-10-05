const MealBackLabel = 'Refeição';
const DefaultBackLabel = 'Voltar';

/** Back goes to the meal being extended when there is one, otherwise it is a plain "Voltar". */
export function resolveAddFoodBackLabel(isAppendMode: boolean): string {
  if (isAppendMode) {
    return MealBackLabel;
  }

  return DefaultBackLabel;
}
