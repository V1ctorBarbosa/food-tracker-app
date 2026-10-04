import {
  formatDayTitle,
  formatEntriesHeading,
  formatLogLabel,
  formatLongDate,
  formatMealsHeading,
  formatShortDate,
} from './day-labels';

describe('formatMealsHeading', () => {
  test('says today for today', () => {
    expect(formatMealsHeading(0)).toBe('Refeições de hoje');
  });

  test('says the day for any other day', () => {
    expect(formatMealsHeading(1)).toBe('Refeições do dia');
    expect(formatMealsHeading(9)).toBe('Refeições do dia');
  });
});

describe('formatEntriesHeading', () => {
  test('says today for today', () => {
    expect(formatEntriesHeading(0)).toBe('Registrado hoje');
  });

  test('says this day for any other day', () => {
    expect(formatEntriesHeading(2)).toBe('Registrado neste dia');
  });
});

describe('formatDayTitle', () => {
  test.each([
    [0, 'Hoje'],
    [1, 'Ontem'],
    [2, '2 dias atrás'],
    [30, '30 dias atrás'],
  ])('titles %p days back as %p', (daysBack, expected) => {
    expect(formatDayTitle(daysBack)).toBe(expected);
  });
});

describe('formatLongDate', () => {
  test('spells out the weekday, day and abbreviated month in Portuguese', () => {
    expect(formatLongDate('2026-09-03')).toMatch(/^quinta-feira, 3 de set\.?$/);
  });
});

describe('formatShortDate', () => {
  test('gives the day and abbreviated month', () => {
    expect(formatShortDate('2026-09-03')).toMatch(/^3 de set\.?$/);
  });

  test('does not shift to the neighbouring day', () => {
    expect(formatShortDate('2026-01-01')).toMatch(/^1 de jan\.?$/);
  });
});

describe('formatLogLabel', () => {
  test('is the plain heading for today', () => {
    expect(formatLogLabel(0, '2026-09-04')).toBe('Registrar refeição');
  });

  test('adds the chosen day for a past day', () => {
    expect(formatLogLabel(1, '2026-09-03')).toMatch(/^Registrar refeição · 3 de set\.?$/);
  });
});
