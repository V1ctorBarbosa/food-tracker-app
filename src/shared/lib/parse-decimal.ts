/**
 * Reads a number typed by the user in either pt-BR ("0,7") or plain ("0.7") notation. The
 * Brazilian keyboard types a comma, which `Number()` alone rejects. Returns null for blank or
 * non-numeric text.
 */
export function parseDecimalInput(text: string): number | null {
  const normalizedText = text.trim().replace(',', '.');

  if (normalizedText.length === 0) {
    return null;
  }

  const parsedValue = Number(normalizedText);

  if (Number.isNaN(parsedValue)) {
    return null;
  }

  return parsedValue;
}
