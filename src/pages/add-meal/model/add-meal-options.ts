export type AddMealOptionId = 'food' | 'drink' | 'photo' | 'description';

export type AddMealOption = {
  id: AddMealOptionId;
  kicker: string;
  label: string;
  description: string;
  /** The option is estimated by AI: it shows the "IA" tag and needs access to estimates. */
  isEstimatedByAi: boolean;
  cardClassName: string;
  textClassName: string;
};

const AllAddMealOptions: readonly AddMealOption[] = [
  {
    id: 'food',
    kicker: 'Buscar',
    label: 'Alimentos',
    description: 'Pratos, ingredientes e marcas',
    isEstimatedByAi: false,
    cardClassName: 'bg-ft-calories',
    textClassName: 'text-white',
  },
  {
    id: 'drink',
    kicker: 'Buscar',
    label: 'Bebidas',
    description: 'Café, sucos, leite, refrigerante',
    isEstimatedByAi: false,
    cardClassName: 'bg-ft-water',
    textClassName: 'text-white',
  },
  {
    id: 'photo',
    kicker: 'Câmera',
    label: 'Foto do prato',
    description: 'Tire uma foto e a IA calcula',
    isEstimatedByAi: true,
    cardClassName: 'bg-ft-protein',
    textClassName: 'text-white',
  },
  {
    id: 'description',
    kicker: 'Texto',
    label: 'Descrever',
    description: 'Escreva o que comeu e a IA calcula',
    isEstimatedByAi: true,
    cardClassName: 'bg-ft-fat',
    textClassName: 'text-ft-on-fat',
  },
];

/** The ways to add to a meal this account can use: the AI ones only when the API allows estimates. */
export function buildAddMealOptions(canEstimateMeals: boolean): AddMealOption[] {
  if (canEstimateMeals) {
    return [...AllAddMealOptions];
  }

  return AllAddMealOptions.filter((option) => !option.isEstimatedByAi);
}

/** The note under the options, explaining the AI ones; none when they are not offered. */
export function resolveAddMealFootnote(canEstimateMeals: boolean): string | null {
  if (!canEstimateMeals) {
    return null;
  }

  return 'Foto e descrição geram uma estimativa. Você revisa os itens antes de salvar.';
}
