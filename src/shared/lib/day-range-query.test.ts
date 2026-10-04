import { parseDateOnly, utcOffsetMinutes } from './date';
import { buildDayRangeQuery } from './day-range-query';

describe('buildDayRangeQuery', () => {
  test('lists the range and the device offset for the first day', () => {
    const expectedOffset = utcOffsetMinutes(parseDateOnly('2026-09-01'));

    expect(buildDayRangeQuery('2026-09-01', '2026-09-07')).toBe(
      `from=2026-09-01&to=2026-09-07&utcOffsetMinutes=${expectedOffset}`,
    );
  });

  test('always carries an integer offset', () => {
    expect(buildDayRangeQuery('2026-09-04', '2026-09-04')).toMatch(/^from=2026-09-04&to=2026-09-04&utcOffsetMinutes=-?\d+$/);
  });
});
