import { resolveDayTitleSizeClassName } from './day-header';

describe('resolveDayTitleSizeClassName', () => {
  test.each([[0], [1]])('uses the large heading for %p days back', (daysBack) => {
    expect(resolveDayTitleSizeClassName(daysBack)).toBe('text-4xl');
  });

  test.each([[2], [7], [365]])('steps down to the compact heading for %p days back', (daysBack) => {
    expect(resolveDayTitleSizeClassName(daysBack)).toBe('text-[28px]');
  });
});
