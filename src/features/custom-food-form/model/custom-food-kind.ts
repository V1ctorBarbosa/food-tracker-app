import { getMeasurementUnitLabel, type CustomFoodBaseUnit } from '@/entities/food';

const BaseQuantity = 100;

export type CustomFoodKindOption = {
  baseUnitType: CustomFoodBaseUnit;
  label: string;
};

/** What the user picks between: a food is measured per 100 g, a drink per 100 ml. */
export const CustomFoodKindOptions: readonly CustomFoodKindOption[] = [
  { baseUnitType: 'Gram', label: 'Comida' },
  { baseUnitType: 'Milliliter', label: 'Bebida' },
];

/** "Novo alimento · por 100 ml": the form's title followed by the unit its values are per. */
export function formatCustomFoodFormTitle(title: string, baseUnitType: CustomFoodBaseUnit): string {
  return `${title} · por ${BaseQuantity} ${getMeasurementUnitLabel(baseUnitType)}`;
}
