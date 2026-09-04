/** Formats a Date as the API's DateOnly wire format, e.g. "2026-09-04". */
export function formatDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function daysBefore(date: Date, dayCount: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - dayCount);
  return result;
}
