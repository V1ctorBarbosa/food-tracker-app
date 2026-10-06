import type { DateRange } from '@/pages/charts/model/date-range';
import { daysBetween, formatDateOnly } from '@/shared/lib/date';

export type CalendarCell = { date: string } | null;

export type CalendarCellState = 'unselected' | 'single' | 'start' | 'end' | 'in-range';

const DaysPerWeek = 7;

export const WeekdayHeaderLabels: readonly string[] = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function getDaysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function getFirstWeekdayOfMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex, 1).getDay();
}

/** A 7-column grid of DateOnly cells for the given month, padded with null (blank) cells to align weekdays and fill whole weeks. */
export function buildMonthGrid(year: number, monthIndex: number): CalendarCell[] {
  const daysInMonth = getDaysInMonth(year, monthIndex);
  const leadingBlankCount = getFirstWeekdayOfMonth(year, monthIndex);

  const cells: CalendarCell[] = [];
  for (let blankIndex = 0; blankIndex < leadingBlankCount; blankIndex += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ date: formatDateOnly(new Date(year, monthIndex, day)) });
  }
  while (cells.length % DaysPerWeek !== 0) {
    cells.push(null);
  }

  return cells;
}

export function groupIntoWeeks(cells: CalendarCell[]): CalendarCell[][] {
  const weeks: CalendarCell[][] = [];
  for (let cellIndex = 0; cellIndex < cells.length; cellIndex += DaysPerWeek) {
    weeks.push(cells.slice(cellIndex, cellIndex + DaysPerWeek));
  }

  return weeks;
}

export function getCalendarCellState(date: string, selection: DateRange | null): CalendarCellState {
  if (selection === null) {
    return 'unselected';
  }

  if (selection.from === selection.to) {
    if (date === selection.from) {
      return 'single';
    }
    return 'unselected';
  }

  if (date === selection.from) {
    return 'start';
  }

  if (date === selection.to) {
    return 'end';
  }

  if (date > selection.from && date < selection.to) {
    return 'in-range';
  }

  return 'unselected';
}

/** Applies a tap on `tappedDate`: the first tap starts a single-day selection, the next completes it into a [min, max] range. */
export function applyCalendarSelection(tappedDate: string, currentSelection: DateRange | null): DateRange {
  if (currentSelection === null || currentSelection.from !== currentSelection.to) {
    return { from: tappedDate, to: tappedDate };
  }

  const existingDate = currentSelection.from;

  if (tappedDate < existingDate) {
    return { from: tappedDate, to: existingDate };
  }

  return { from: existingDate, to: tappedDate };
}

export function shiftMonth(year: number, monthIndex: number, monthDelta: number): { year: number; monthIndex: number } {
  const shiftedDate = new Date(year, monthIndex + monthDelta, 1);

  return { year: shiftedDate.getFullYear(), monthIndex: shiftedDate.getMonth() };
}

/** Mirrors the API's limit on a history query: a range spans at most this many days, both ends included. */
export const MaximumCustomRangeDayCount = 366;

/**
 * Whether tapping `date` is allowed: never after `maxSelectableDate`, and while a range is half
 * picked, never so far from its first day that the finished range would exceed
 * {@link MaximumCustomRangeDayCount}.
 */
export function isDateSelectable(date: string, maxSelectableDate: string, selection: DateRange | null): boolean {
  if (date > maxSelectableDate) {
    return false;
  }

  const isRangeHalfPicked = selection !== null && selection.from === selection.to;
  if (!isRangeHalfPicked) {
    return true;
  }

  return isWithinMaximumRangeOf(date, selection.from);
}

function isWithinMaximumRangeOf(date: string, firstPickedDate: string): boolean {
  const spannedDayCount = Math.abs(daysBetween(firstPickedDate, date)) + 1;

  return spannedDayCount <= MaximumCustomRangeDayCount;
}

/** Whether the given month is the one `referenceDate` falls in, or a later one -- there is nothing selectable beyond it. */
export function isCurrentOrFutureMonth(year: number, monthIndex: number, referenceDate: Date): boolean {
  if (year !== referenceDate.getFullYear()) {
    return year > referenceDate.getFullYear();
  }

  return monthIndex >= referenceDate.getMonth();
}

const MonthLabelFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });

export function formatMonthLabel(year: number, monthIndex: number): string {
  return MonthLabelFormatter.format(new Date(year, monthIndex, 1));
}
