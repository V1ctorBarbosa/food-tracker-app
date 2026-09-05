import type { WeightEntry } from '@/entities/weight-entry';

export type WeightHistoryRow = { entry: WeightEntry; deltaKilograms: number | null };

/**
 * Turns an oldest-to-newest weight history into newest-first display rows, each carrying its
 * change from the entry immediately before it (null for the oldest entry, which has none).
 */
export function buildWeightHistoryRows(sortedHistory: WeightEntry[]): WeightHistoryRow[] {
  const rowsOldestFirst = sortedHistory.map((entry, index) => ({
    entry,
    deltaKilograms: index === 0 ? null : entry.weightKilograms - sortedHistory[index - 1].weightKilograms,
  }));

  return [...rowsOldestFirst].reverse();
}

/** Change from the previous recorded weight, or null when there's no earlier entry to compare against. */
export function calculateWeightDelta(sortedHistory: WeightEntry[], currentWeightKilograms: number | null): number | null {
  const previousWeightKilograms = sortedHistory.length >= 2 ? sortedHistory[sortedHistory.length - 2].weightKilograms : null;

  if (previousWeightKilograms === null || currentWeightKilograms === null) {
    return null;
  }

  return currentWeightKilograms - previousWeightKilograms;
}
