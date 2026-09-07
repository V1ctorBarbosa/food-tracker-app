import { daysBefore, formatDateOnly } from '@/shared/lib/date';

export type DateRangePresetId = 'last7' | 'last15' | 'last30' | 'custom';

export type DateRangePresetDefinition = {
  id: DateRangePresetId;
  label: string;
  dayCount: number | null;
};

export const DateRangePresetDefinitions: DateRangePresetDefinition[] = [
  { id: 'last7', label: '7 dias', dayCount: 7 },
  { id: 'last15', label: '15 dias', dayCount: 15 },
  { id: 'last30', label: '30 dias', dayCount: 30 },
  { id: 'custom', label: 'Personalizado', dayCount: null },
];

const FallbackRangeDayCount = 30;

export type DateRange = {
  from: string;
  to: string;
};

export function buildLastNDaysRange(dayCount: number, referenceDate: Date): DateRange {
  return {
    from: formatDateOnly(daysBefore(referenceDate, dayCount - 1)),
    to: formatDateOnly(referenceDate),
  };
}

/** The range the dashboard should be queried for: the active preset's last-N-days span, or the confirmed custom range. */
export function resolveActiveDateRange(presetId: DateRangePresetId, customRange: DateRange | null, referenceDate: Date): DateRange {
  const presetDefinition = findPresetDefinition(presetId);

  if (presetDefinition.dayCount !== null) {
    return buildLastNDaysRange(presetDefinition.dayCount, referenceDate);
  }

  if (customRange !== null) {
    return customRange;
  }

  return buildLastNDaysRange(FallbackRangeDayCount, referenceDate);
}

function findPresetDefinition(presetId: DateRangePresetId): DateRangePresetDefinition {
  const presetDefinition = DateRangePresetDefinitions.find((definition) => definition.id === presetId);
  if (presetDefinition === undefined) {
    throw new Error(`No date range preset definition for id: ${presetId}`);
  }

  return presetDefinition;
}

const DateRangeLabelFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' });

export function formatDateRangeLabel(range: DateRange): string {
  const fromLabel = DateRangeLabelFormatter.format(new Date(`${range.from}T00:00:00`));
  const toLabel = DateRangeLabelFormatter.format(new Date(`${range.to}T00:00:00`));

  return `${fromLabel} – ${toLabel}`;
}
