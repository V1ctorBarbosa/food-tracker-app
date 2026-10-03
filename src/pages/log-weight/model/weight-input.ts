import { parseDecimalInput } from '@/shared/lib/parse-decimal';

import { convertDisplayUnitToKilograms, type WeightUnit } from './weight-unit-conversion';

export const MinimumWeightInDisplayUnit = 0.1;
const DisplayDecimalPlaces = 1;

/**
 * The text the weight field shows. While the user is typing it is exactly what they typed;
 * reformatting on every keystroke would turn "86" into "8.0" and then "8.1". Once editing ends
 * (`editingText` is null) it falls back to the stored weight with one decimal place.
 */
export function resolveWeightInputText(editingText: string | null, displayValue: number): string {
  if (editingText !== null) {
    return editingText;
  }

  return displayValue.toFixed(DisplayDecimalPlaces);
}

/**
 * The weight in kilograms for what the user typed in the displayed unit (comma or dot decimals),
 * never below the minimum; null while the text is not a number yet.
 */
export function convertTypedWeightToKilograms(text: string, unit: WeightUnit): number | null {
  const typedValue = parseDecimalInput(text);

  if (typedValue === null) {
    return null;
  }

  return convertDisplayUnitToKilograms(Math.max(MinimumWeightInDisplayUnit, typedValue), unit);
}
