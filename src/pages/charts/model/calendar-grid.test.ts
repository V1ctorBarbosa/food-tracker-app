import {
  applyCalendarSelection,
  buildMonthGrid,
  formatMonthLabel,
  getCalendarCellState,
  groupIntoWeeks,
  isCurrentOrFutureMonth,
  isDateSelectable,
  shiftMonth,
} from './calendar-grid';

describe('buildMonthGrid', () => {
  test('pads leading blanks so the 1st lands on its real weekday, and pads trailing blanks to a full week', () => {
    // September 2026 starts on a Tuesday (weekday 2) and has 30 days: 2 leading blanks,
    // 30 day cells, then 3 trailing blanks to reach 35 (5 full weeks of 7).
    const grid = buildMonthGrid(2026, 8);

    expect(grid).toHaveLength(35);
    expect(grid.slice(0, 2)).toEqual([null, null]);
    expect(grid[2]).toEqual({ date: '2026-09-01' });
    expect(grid[31]).toEqual({ date: '2026-09-30' });
    expect(grid.slice(32)).toEqual([null, null, null]);
  });

  test('adds no padding when the month starts on Sunday and spans exactly whole weeks', () => {
    // February 2026 starts on a Sunday and has 28 days -- exactly 4 weeks, no blanks needed.
    const grid = buildMonthGrid(2026, 1);

    expect(grid).toHaveLength(28);
    expect(grid.every((cell) => cell !== null)).toBe(true);
  });
});

describe('groupIntoWeeks', () => {
  test('chunks a grid into rows of 7', () => {
    const grid = buildMonthGrid(2026, 8);

    const weeks = groupIntoWeeks(grid);

    expect(weeks).toHaveLength(5);
    expect(weeks.every((week) => week.length === 7)).toBe(true);
    expect(weeks[0][2]).toEqual({ date: '2026-09-01' });
  });
});

describe('getCalendarCellState', () => {
  test('returns unselected for every date when there is no selection', () => {
    expect(getCalendarCellState('2026-09-05', null)).toBe('unselected');
  });

  test('returns single for the one selected date of an in-progress single-day selection', () => {
    const selection = { from: '2026-09-05', to: '2026-09-05' };

    expect(getCalendarCellState('2026-09-05', selection)).toBe('single');
    expect(getCalendarCellState('2026-09-06', selection)).toBe('unselected');
  });

  test('labels the range endpoints and every date strictly between them', () => {
    const selection = { from: '2026-09-05', to: '2026-09-10' };

    expect(getCalendarCellState('2026-09-05', selection)).toBe('start');
    expect(getCalendarCellState('2026-09-10', selection)).toBe('end');
    expect(getCalendarCellState('2026-09-07', selection)).toBe('in-range');
    expect(getCalendarCellState('2026-09-11', selection)).toBe('unselected');
  });
});

describe('applyCalendarSelection', () => {
  test('starts a new single-day selection when there is none yet', () => {
    expect(applyCalendarSelection('2026-09-05', null)).toEqual({ from: '2026-09-05', to: '2026-09-05' });
  });

  test('completes an in-progress single-day selection into a range, ordering the dates', () => {
    const inProgress = { from: '2026-09-10', to: '2026-09-10' };

    expect(applyCalendarSelection('2026-09-15', inProgress)).toEqual({ from: '2026-09-10', to: '2026-09-15' });
    expect(applyCalendarSelection('2026-09-05', inProgress)).toEqual({ from: '2026-09-05', to: '2026-09-10' });
  });

  test('starts a fresh selection when tapping again after a range is already complete', () => {
    const completeRange = { from: '2026-09-05', to: '2026-09-15' };

    expect(applyCalendarSelection('2026-09-20', completeRange)).toEqual({ from: '2026-09-20', to: '2026-09-20' });
  });
});

describe('shiftMonth', () => {
  test('moves forward across a year boundary', () => {
    expect(shiftMonth(2026, 11, 1)).toEqual({ year: 2027, monthIndex: 0 });
  });

  test('moves backward across a year boundary', () => {
    expect(shiftMonth(2026, 0, -1)).toEqual({ year: 2025, monthIndex: 11 });
  });
});

describe('formatMonthLabel', () => {
  test('formats the full month name and year', () => {
    expect(formatMonthLabel(2026, 8)).toBe('setembro de 2026');
  });
});

describe('isDateSelectable', () => {
  test('allows a date on or before the maximum', () => {
    expect(isDateSelectable('2026-09-07', '2026-09-07')).toBe(true);
    expect(isDateSelectable('2026-09-06', '2026-09-07')).toBe(true);
  });

  test('rejects a date after the maximum', () => {
    expect(isDateSelectable('2026-09-08', '2026-09-07')).toBe(false);
  });
});

describe('isCurrentOrFutureMonth', () => {
  const referenceDate = new Date(2026, 8, 7);

  test('is true for the month the reference date falls in', () => {
    expect(isCurrentOrFutureMonth(2026, 8, referenceDate)).toBe(true);
  });

  test('is true for a later month in the same year, and for a later year entirely', () => {
    expect(isCurrentOrFutureMonth(2026, 9, referenceDate)).toBe(true);
    expect(isCurrentOrFutureMonth(2027, 0, referenceDate)).toBe(true);
  });

  test('is false for an earlier month', () => {
    expect(isCurrentOrFutureMonth(2026, 7, referenceDate)).toBe(false);
    expect(isCurrentOrFutureMonth(2025, 11, referenceDate)).toBe(false);
  });
});
