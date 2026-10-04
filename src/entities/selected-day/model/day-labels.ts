import { parseDateOnly } from '@/shared/lib/date';

const LongDateFormatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' });
const ShortDateFormatter = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' });

/** "Hoje", "Ontem", or "N dias atrás" for how far back the selected day is. */
export function formatDayTitle(daysBack: number): string {
  if (daysBack === 0) {
    return 'Hoje';
  }

  if (daysBack === 1) {
    return 'Ontem';
  }

  return `${daysBack} dias atrás`;
}

/** "quinta-feira, 4 de set." */
export function formatLongDate(day: string): string {
  return LongDateFormatter.format(parseDateOnly(day));
}

/** "4 de set." */
export function formatShortDate(day: string): string {
  return ShortDateFormatter.format(parseDateOnly(day));
}

/** The heading over the day's meals. */
export function formatMealsHeading(daysBack: number): string {
  if (daysBack === 0) {
    return 'Refeições de hoje';
  }

  return 'Refeições do dia';
}

/** The heading over the day's water or weight entries. */
export function formatEntriesHeading(daysBack: number): string {
  if (daysBack === 0) {
    return 'Registrado hoje';
  }

  return 'Registrado neste dia';
}

/** The Registrar heading: plain for today, with the chosen day spelled out otherwise. */
export function formatLogLabel(daysBack: number, day: string): string {
  if (daysBack === 0) {
    return 'Registrar refeição';
  }

  return `Registrar refeição · ${formatShortDate(day)}`;
}
