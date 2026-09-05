import type { WeightEntry } from '@/entities/weight-entry';

import { buildWeightHistoryRows, calculateWeightDelta } from './weight-history-view';

const sortedHistory: WeightEntry[] = [
  { id: 'w1', loggedAt: '2026-09-01T07:00:00Z', weightKilograms: 88 },
  { id: 'w2', loggedAt: '2026-09-03T07:00:00Z', weightKilograms: 87.2 },
  { id: 'w3', loggedAt: '2026-09-05T07:00:00Z', weightKilograms: 86.5 },
];

describe('buildWeightHistoryRows', () => {
  test('returns rows newest first', () => {
    const rows = buildWeightHistoryRows(sortedHistory);

    expect(rows.map((row) => row.entry.id)).toEqual(['w3', 'w2', 'w1']);
  });

  test('computes each row change from the entry immediately before it', () => {
    const rows = buildWeightHistoryRows(sortedHistory);

    expect(rows.find((row) => row.entry.id === 'w3')?.deltaKilograms).toBeCloseTo(-0.7, 5);
    expect(rows.find((row) => row.entry.id === 'w2')?.deltaKilograms).toBeCloseTo(-0.8, 5);
  });

  test('the oldest entry has no delta', () => {
    const rows = buildWeightHistoryRows(sortedHistory);

    expect(rows.find((row) => row.entry.id === 'w1')?.deltaKilograms).toBeNull();
  });

  test('returns an empty list for an empty history', () => {
    expect(buildWeightHistoryRows([])).toEqual([]);
  });
});

describe('calculateWeightDelta', () => {
  test('returns the change from the previous entry to the current weight', () => {
    expect(calculateWeightDelta(sortedHistory, 86.5)).toBeCloseTo(-0.7, 5);
  });

  test('returns null when there is no previous entry', () => {
    expect(calculateWeightDelta([sortedHistory[2]], 86.5)).toBeNull();
  });

  test('returns null when there is no current weight', () => {
    expect(calculateWeightDelta(sortedHistory, null)).toBeNull();
  });
});
