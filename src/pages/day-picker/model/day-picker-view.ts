export type DayCellState = 'selected' | 'today' | 'future' | 'default';

/**
 * How a day in the picker's calendar looks. A day after today can never be chosen, and the
 * selected day wins over today's ring when they are the same day.
 */
export function resolveDayCellState(date: string, selectedDay: string, today: string): DayCellState {
  if (date > today) {
    return 'future';
  }

  if (date === selectedDay) {
    return 'selected';
  }

  if (date === today) {
    return 'today';
  }

  return 'default';
}
