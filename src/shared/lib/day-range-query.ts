import { parseDateOnly, utcOffsetMinutes } from '@/shared/lib/date';

/**
 * The query string for any endpoint that lists a range of days. It includes the device's UTC
 * offset so the server groups entries by the user's own calendar day instead of UTC's, which
 * would push an entry logged at 22:00 in Brasilia onto the next day.
 */
export function buildDayRangeQuery(from: string, to: string): string {
  const offsetMinutes = utcOffsetMinutes(parseDateOnly(from));

  return `from=${from}&to=${to}&utcOffsetMinutes=${offsetMinutes}`;
}
