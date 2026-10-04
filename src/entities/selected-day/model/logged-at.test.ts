import { buildLoggedAt, dayFromDaysBack, daysBackFromDay, isFutureDay } from './logged-at';

const now = new Date(2026, 9, 3, 22, 15, 30, 250);

describe('dayFromDaysBack', () => {
  test.each([
    [0, '2026-10-03'],
    [1, '2026-10-02'],
    [3, '2026-09-30'],
  ])('%p days back is %p', (daysBack, expected) => {
    expect(dayFromDaysBack(daysBack, now)).toBe(expected);
  });
});

describe('daysBackFromDay', () => {
  test.each([
    ['2026-10-03', 0],
    ['2026-10-02', 1],
    ['2026-09-30', 3],
  ])('%p is %p days back', (day, expected) => {
    expect(daysBackFromDay(day, now)).toBe(expected);
  });

  test('counts a day in the future as today', () => {
    expect(daysBackFromDay('2026-10-09', now)).toBe(0);
  });

  test('round-trips with dayFromDaysBack', () => {
    expect(daysBackFromDay(dayFromDaysBack(12, now), now)).toBe(12);
  });
});

describe('isFutureDay', () => {
  test('is false for today and the past', () => {
    expect(isFutureDay('2026-10-03', now)).toBe(false);
    expect(isFutureDay('2026-10-02', now)).toBe(false);
  });

  test('is true after today', () => {
    expect(isFutureDay('2026-10-04', now)).toBe(true);
  });
});

describe('buildLoggedAt', () => {
  test('stamps a past day at the current time of day', () => {
    const loggedAt = new Date(buildLoggedAt('2026-09-03', now));

    expect(loggedAt.getFullYear()).toBe(2026);
    expect(loggedAt.getMonth()).toBe(8);
    expect(loggedAt.getDate()).toBe(3);
    expect(loggedAt.getHours()).toBe(22);
    expect(loggedAt.getMinutes()).toBe(15);
    expect(loggedAt.getSeconds()).toBe(30);
  });

  test('is exactly now when the day is today', () => {
    expect(buildLoggedAt('2026-10-03', now)).toBe(now.toISOString());
  });

  test('is an ISO instant the API can read', () => {
    expect(buildLoggedAt('2026-09-03', now)).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });
});
