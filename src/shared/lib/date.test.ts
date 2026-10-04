import { daysBefore, daysBetween, formatDateOnly, parseDateOnly, utcOffsetMinutes } from './date';

describe('formatDateOnly', () => {
  test('pads single-digit month and day with a leading zero', () => {
    expect(formatDateOnly(new Date(2026, 0, 4))).toBe('2026-01-04');
  });

  test('does not pad double-digit month and day', () => {
    expect(formatDateOnly(new Date(2026, 8, 30))).toBe('2026-09-30');
  });
});

describe('daysBefore', () => {
  test('subtracts the given number of days', () => {
    const result = daysBefore(new Date(2026, 8, 4), 6);

    expect(formatDateOnly(result)).toBe('2026-08-29');
  });

  test('does not mutate the input date', () => {
    const original = new Date(2026, 8, 4);

    daysBefore(original, 6);

    expect(formatDateOnly(original)).toBe('2026-09-04');
  });
});

describe('parseDateOnly', () => {
  test('returns the local midnight of the day', () => {
    const result = parseDateOnly('2026-09-04');

    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(8);
    expect(result.getDate()).toBe(4);
    expect(result.getHours()).toBe(0);
  });

  test('round-trips through formatDateOnly', () => {
    expect(formatDateOnly(parseDateOnly('2026-01-04'))).toBe('2026-01-04');
  });
});

describe('daysBetween', () => {
  test.each([
    ['2026-09-04', '2026-09-04', 0],
    ['2026-09-03', '2026-09-04', 1],
    ['2026-09-04', '2026-09-03', -1],
    ['2026-08-29', '2026-09-04', 6],
    ['2025-12-31', '2026-01-01', 1],
    ['2026-02-27', '2026-03-02', 3],
  ])('from %p to %p is %p days', (from, to, expected) => {
    expect(daysBetween(from, to)).toBe(expected);
  });
});

describe('utcOffsetMinutes', () => {
  test('flips the sign of the offset Date reports', () => {
    expect(utcOffsetMinutes({ getTimezoneOffset: () => 180 })).toBe(-180);
    expect(utcOffsetMinutes({ getTimezoneOffset: () => -330 })).toBe(330);
  });

  test('returns a plain zero for a device already on UTC', () => {
    expect(Object.is(utcOffsetMinutes({ getTimezoneOffset: () => 0 }), 0)).toBe(true);
  });
});
