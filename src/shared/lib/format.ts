/** Formats a number with a fixed decimal count, prefixed with "+" when non-negative (e.g. a delta). */
export function formatSignedNumber(value: number, decimalPlaces: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimalPlaces)}`;
}

/** Rounds to a whole number with pt-BR thousands grouping (e.g. 2000 becomes "2.000"). */
export function formatWholeNumber(value: number): string {
  return formatMaxDecimals(value, 0);
}

/** Formats a number in pt-BR grouping, capped to at most `maximumFractionDigits` decimals (trims a trailing zero). */
export function formatMaxDecimals(value: number, maximumFractionDigits: number): string {
  return value.toLocaleString('pt-BR', { maximumFractionDigits });
}
