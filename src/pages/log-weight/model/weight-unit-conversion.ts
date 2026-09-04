export type WeightUnit = 'Kilograms' | 'Pounds';

const KilogramsToPoundsFactor = 2.20462;

export function kilogramsToPounds(kilograms: number): number {
  return kilograms * KilogramsToPoundsFactor;
}

export function poundsToKilograms(pounds: number): number {
  return pounds / KilogramsToPoundsFactor;
}

/** Converts a value stored in kilograms into whichever unit the user chose to display. */
export function convertKilogramsToDisplayUnit(kilograms: number, unit: WeightUnit): number {
  return unit === 'Kilograms' ? kilograms : kilogramsToPounds(kilograms);
}

/** Converts a value the user typed in the displayed unit back into kilograms for the backend. */
export function convertDisplayUnitToKilograms(displayValue: number, unit: WeightUnit): number {
  return unit === 'Kilograms' ? displayValue : poundsToKilograms(displayValue);
}
