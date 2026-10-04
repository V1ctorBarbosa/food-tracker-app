import { daysBefore, daysBetween, formatDateOnly, parseDateOnly } from '@/shared/lib/date';

/** The calendar day that is `daysBack` days before `now` (0 is today). */
export function dayFromDaysBack(daysBack: number, now: Date): string {
  return formatDateOnly(daysBefore(now, daysBack));
}

/** How many days before `now` a day falls; a day in the future counts as today, never as negative. */
export function daysBackFromDay(day: string, now: Date): number {
  return Math.max(0, daysBetween(day, formatDateOnly(now)));
}

export function isFutureDay(day: string, now: Date): boolean {
  return day > formatDateOnly(now);
}

/**
 * When to stamp an entry the user is logging for `day`: that day at the current time of day, so
 * entries keep a sensible order and show a believable time. For today it is simply now.
 */
export function buildLoggedAt(day: string, now: Date): string {
  const loggedAt = parseDateOnly(day);
  loggedAt.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());

  return loggedAt.toISOString();
}
