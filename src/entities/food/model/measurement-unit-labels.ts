import type { MeasurementUnit } from './food.types';

const GramUnit: MeasurementUnit = 'Gram';

/** "Gram" abbreviates to "g"; every other unit is shown as its lowercased name. */
export function getMeasurementUnitLabel(unit: MeasurementUnit): string {
  return unit === GramUnit ? 'g' : unit.toLowerCase();
}
