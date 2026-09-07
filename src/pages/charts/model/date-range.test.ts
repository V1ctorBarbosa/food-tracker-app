import { buildLastNDaysRange, formatDateRangeLabel, resolveActiveDateRange } from './date-range';

describe('buildLastNDaysRange', () => {
  test('spans the given number of days ending on the reference date', () => {
    expect(buildLastNDaysRange(7, new Date(2026, 8, 7))).toEqual({ from: '2026-09-01', to: '2026-09-07' });
  });

  test('spans a single day when given a day count of 1', () => {
    expect(buildLastNDaysRange(1, new Date(2026, 8, 7))).toEqual({ from: '2026-09-07', to: '2026-09-07' });
  });
});

describe('resolveActiveDateRange', () => {
  const referenceDate = new Date(2026, 8, 7);

  test('returns the last N days for a day-count preset', () => {
    expect(resolveActiveDateRange('last15', null, referenceDate)).toEqual({ from: '2026-08-24', to: '2026-09-07' });
  });

  test('returns the confirmed custom range when the custom preset is active', () => {
    const customRange = { from: '2026-06-01', to: '2026-06-10' };
    expect(resolveActiveDateRange('custom', customRange, referenceDate)).toEqual(customRange);
  });

  test('falls back to the last 30 days when custom is active but no range has been confirmed yet', () => {
    expect(resolveActiveDateRange('custom', null, referenceDate)).toEqual({ from: '2026-08-09', to: '2026-09-07' });
  });
});

describe('formatDateRangeLabel', () => {
  test('formats both endpoints as day and abbreviated month', () => {
    expect(formatDateRangeLabel({ from: '2026-09-01', to: '2026-09-15' })).toBe('01 de set. – 15 de set.');
  });
});
