/** Formats a number with a fixed decimal count, prefixed with "+" when non-negative (e.g. a delta). */
export function formatSignedNumber(value: number, decimalPlaces: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimalPlaces)}`;
}
