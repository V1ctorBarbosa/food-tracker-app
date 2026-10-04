const MillisecondsPerDay = 24 * 60 * 60 * 1000;

/** Formats a Date as the API's DateOnly wire format, e.g. "2026-09-04". */
export function formatDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** The local midnight a DateOnly string ("2026-09-04") starts, in the device's time zone. */
export function parseDateOnly(dateOnly: string): Date {
  const [year, month, day] = dateOnly.split('-').map(Number);

  return new Date(year, month - 1, day);
}

export function daysBefore(date: Date, dayCount: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - dayCount);
  return result;
}

/** Whole calendar days from `from` to `to` (positive when `to` is later), ignoring daylight saving shifts. */
export function daysBetween(from: string, to: string): number {
  const fromUtc = Date.UTC(...toUtcParts(from));
  const toUtc = Date.UTC(...toUtcParts(to));

  return Math.round((toUtc - fromUtc) / MillisecondsPerDay);
}

function toUtcParts(dateOnly: string): [number, number, number] {
  const [year, month, day] = dateOnly.split('-').map(Number);

  return [year, month - 1, day];
}

/** The device's UTC offset in minutes at `date` (e.g. -180 for Brasilia), the sign API clients send. */
export function utcOffsetMinutes(date: Pick<Date, 'getTimezoneOffset'>): number {
  // Date reports the offset with the opposite sign ("minutes to add to local time to get UTC").
  // Adding 0 turns the -0 that a UTC device would produce into a plain 0.
  return -date.getTimezoneOffset() + 0;
}
