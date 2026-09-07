import type { Dashboard } from '@/entities/dashboard';

import { buildMetricSeries, formatMetricValue, MetricDefinitions } from './chart-series';

function findDefinition(id: string) {
  const definition = MetricDefinitions.find((candidate) => candidate.id === id);
  if (definition === undefined) {
    throw new Error(`No metric definition for id: ${id}`);
  }
  return definition;
}

describe('buildMetricSeries', () => {
  const dashboard: Pick<Dashboard, 'nutritionHistory' | 'weightHistory'> = {
    nutritionHistory: [
      { date: '2026-09-01', calories: 1800, protein: 120, carbs: 200, fat: 60, waterMilliliters: 1500 },
      { date: '2026-09-02', calories: 2000, protein: 140, carbs: 220, fat: 65, waterMilliliters: 2200 },
    ],
    weightHistory: [
      { date: '2026-09-02', weightKilograms: 87.2 },
      { date: '2026-09-01', weightKilograms: 88 },
    ],
  };

  test('maps each nutrition history row to a calories point, in the given order', () => {
    expect(buildMetricSeries(dashboard).calories).toEqual([
      { date: '2026-09-01', value: 1800 },
      { date: '2026-09-02', value: 2000 },
    ]);
  });

  test('converts water from milliliters to liters', () => {
    expect(buildMetricSeries(dashboard).water).toEqual([
      { date: '2026-09-01', value: 1.5 },
      { date: '2026-09-02', value: 2.2 },
    ]);
  });

  test('sorts weight history by date, regardless of input order', () => {
    expect(buildMetricSeries(dashboard).weight).toEqual([
      { date: '2026-09-01', value: 88 },
      { date: '2026-09-02', value: 87.2 },
    ]);
  });
});

describe('formatMetricValue', () => {
  test('rounds calories to a whole number', () => {
    expect(formatMetricValue(findDefinition('calories'), 1999.6)).toBe('2.000');
  });

  test('rounds grams-based metrics to one decimal place', () => {
    expect(formatMetricValue(findDefinition('protein'), 14.819999999999999)).toBe('14,8');
  });

  test('trims a trailing zero decimal for a whole gram value', () => {
    expect(formatMetricValue(findDefinition('carbs'), 71)).toBe('71');
  });
});
