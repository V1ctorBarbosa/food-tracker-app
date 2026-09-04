import { daysBefore, formatDateOnly } from './date';

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
