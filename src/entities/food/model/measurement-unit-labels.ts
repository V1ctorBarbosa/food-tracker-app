import type { CustomFoodBaseUnit, MeasurementUnit } from './food.types';

const MeasurementUnitLabels: Record<MeasurementUnit, string> = {
  Gram: 'g',
  Kilogram: 'kg',
  Milliliter: 'ml',
  Liter: 'L',
};

const VolumeUnits: readonly MeasurementUnit[] = ['Milliliter', 'Liter'];

/** The unit symbol shown next to an amount: "g", "kg", "ml" or "L". */
export function getMeasurementUnitLabel(unit: MeasurementUnit): string {
  return MeasurementUnitLabels[unit];
}

/** Whether a food with this base unit is a drink (measured by volume) rather than a food (by mass). */
export function isDrinkUnit(unit: MeasurementUnit): boolean {
  return VolumeUnits.includes(unit);
}

/** The custom food kind matching a food's base unit: Milliliter for a drink, Gram for a food. */
export function toCustomFoodBaseUnit(unit: MeasurementUnit): CustomFoodBaseUnit {
  if (isDrinkUnit(unit)) {
    return 'Milliliter';
  }

  return 'Gram';
}
