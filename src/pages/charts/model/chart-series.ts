import type { Dashboard } from '@/entities/dashboard';
import type { ThemeColors } from '@/shared/config/theme';
import { formatMaxDecimals } from '@/shared/lib/format';

export type MetricId = 'calories' | 'protein' | 'carbs' | 'fat' | 'water' | 'weight';

export type ChartPoint = {
  date: string;
  value: number;
};

export type MetricDefinition = {
  id: MetricId;
  label: string;
  unit: string;
  colorKey: keyof ThemeColors;
  decimalPlaces: number;
  /** Spacing between y-axis gridlines, in the metric's own unit. */
  yAxisStep: number;
};

const MillilitersPerLiter = 1000;

export const MetricDefinitions: MetricDefinition[] = [
  { id: 'calories', label: 'Calorias', unit: 'kcal', colorKey: 'calories', decimalPlaces: 0, yAxisStep: 500 },
  { id: 'protein', label: 'Proteína', unit: 'g', colorKey: 'protein', decimalPlaces: 1, yAxisStep: 40 },
  { id: 'carbs', label: 'Carboidrato', unit: 'g', colorKey: 'carbs', decimalPlaces: 1, yAxisStep: 40 },
  { id: 'fat', label: 'Gordura', unit: 'g', colorKey: 'fat', decimalPlaces: 1, yAxisStep: 40 },
  { id: 'water', label: 'Água', unit: 'L', colorKey: 'water', decimalPlaces: 1, yAxisStep: 1 },
  { id: 'weight', label: 'Peso', unit: 'kg', colorKey: 'weight', decimalPlaces: 1, yAxisStep: 10 },
];

/** Builds each metric's chart series from the dashboard's daily nutrition rows and sparse weight entries. */
export function buildMetricSeries(dashboard: Pick<Dashboard, 'nutritionHistory' | 'weightHistory'>): Record<MetricId, ChartPoint[]> {
  const sortedWeightHistory = [...dashboard.weightHistory].sort((a, b) => a.date.localeCompare(b.date));

  return {
    calories: dashboard.nutritionHistory.map((entry) => ({ date: entry.date, value: entry.calories })),
    protein: dashboard.nutritionHistory.map((entry) => ({ date: entry.date, value: entry.protein })),
    carbs: dashboard.nutritionHistory.map((entry) => ({ date: entry.date, value: entry.carbs })),
    fat: dashboard.nutritionHistory.map((entry) => ({ date: entry.date, value: entry.fat })),
    water: dashboard.nutritionHistory.map((entry) => ({ date: entry.date, value: entry.waterMilliliters / MillilitersPerLiter })),
    weight: sortedWeightHistory.map((entry) => ({ date: entry.date, value: entry.weightKilograms })),
  };
}

export function formatMetricValue(definition: MetricDefinition, value: number): string {
  return formatMaxDecimals(value, definition.decimalPlaces);
}
