import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { useDashboardQuery } from '@/entities/dashboard';
import {
  buildMetricSeries,
  formatMetricValue,
  MetricDefinitions,
  type ChartPoint,
  type MetricDefinition,
  type MetricId,
} from '@/pages/charts/model/chart-series';
import { buildLineChartPath } from '@/pages/charts/model/line-chart-geometry';
import { useThemeColors } from '@/shared/config/theme';
import { daysBefore, formatDateOnly } from '@/shared/lib/date';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { LoadingBar } from '@/shared/ui/LoadingBar';

const ChartsRangeDays = 30;
const ChartWidth = 320;
const ChartHeight = 120;
const ChartPadding = 12;
const ChartStrokeWidth = 2.5;
const DefaultSelectedMetricIds: MetricId[] = ['calories'];

const ChartDateFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' });

export function ChartsPage() {
  const today = new Date();
  const todayDate = formatDateOnly(today);
  const rangeStartDate = formatDateOnly(daysBefore(today, ChartsRangeDays - 1));

  const dashboardQuery = useDashboardQuery(rangeStartDate, todayDate);
  const [selectedMetricIds, setSelectedMetricIds] = useState<MetricId[]>(DefaultSelectedMetricIds);
  const themeColors = useThemeColors();

  if (dashboardQuery.isPending) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-ft-bg">
        <LoadingBar />
      </SafeAreaView>
    );
  }

  if (dashboardQuery.isError) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-ft-bg px-7">
        <ErrorMessage />
      </SafeAreaView>
    );
  }

  const seriesByMetricId = buildMetricSeries(dashboardQuery.data);
  const selectedDefinitions = MetricDefinitions.filter((definition) => selectedMetricIds.includes(definition.id));

  function toggleMetric(metricId: MetricId) {
    setSelectedMetricIds((currentIds) =>
      currentIds.includes(metricId) ? currentIds.filter((id) => id !== metricId) : [...currentIds, metricId],
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-ft-bg">
      <ScrollView className="flex-1" contentContainerClassName="gap-4 px-6 pt-5 pb-8" showsVerticalScrollIndicator={false}>
        <Text className="font-display text-5xl uppercase text-ft-calories">Gráficos</Text>

        <View className="flex-row flex-wrap gap-2">
          {MetricDefinitions.map((definition) => (
            <MetricToggleChip
              key={definition.id}
              label={definition.label}
              color={themeColors[definition.colorKey]}
              isSelected={selectedMetricIds.includes(definition.id)}
              onPress={() => toggleMetric(definition.id)}
            />
          ))}
        </View>

        {selectedDefinitions.length === 0 && (
          <Text className="font-body-semibold text-sm text-ft-muted-2">Selecione ao menos um dado para ver o gráfico.</Text>
        )}

        {selectedDefinitions.map((definition) => (
          <MetricChartCard
            key={definition.id}
            definition={definition}
            points={seriesByMetricId[definition.id]}
            color={themeColors[definition.colorKey]}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function MetricToggleChip({
  label,
  color,
  isSelected,
  onPress,
}: {
  label: string;
  color: string;
  isSelected: boolean;
  onPress: () => void;
}) {
  const backgroundColor = isSelected ? color : 'transparent';
  const textColorClassName = isSelected ? 'text-white' : 'text-ft-muted-2';

  return (
    <Pressable onPress={onPress} className="rounded-full border border-ft-muted-3/40 px-3.5 py-1.5" style={{ backgroundColor }}>
      <Text className={`font-body-bold text-[11px] uppercase tracking-widest ${textColorClassName}`}>{label}</Text>
    </Pressable>
  );
}

function MetricChartCard({ definition, points, color }: { definition: MetricDefinition; points: ChartPoint[]; color: string }) {
  const latestPoint = points.length > 0 ? points[points.length - 1] : null;
  const latestValueLabel = latestPoint === null ? '—' : formatMetricValue(definition, latestPoint.value);
  const pathData = buildLineChartPath(
    points.map((point) => point.value),
    ChartWidth,
    ChartHeight,
    ChartPadding,
  );
  const firstDateLabel = points.length > 0 ? ChartDateFormatter.format(new Date(`${points[0].date}T00:00:00`)) : null;
  const lastDateLabel = points.length > 0 ? ChartDateFormatter.format(new Date(`${points[points.length - 1].date}T00:00:00`)) : null;
  const emptyStateLabel = points.length === 0 ? 'Sem dados no período.' : 'Registre mais dias para ver a tendência.';

  return (
    <View className="gap-2.5 rounded-[20px] bg-ft-card px-4 py-3.5">
      <View className="flex-row items-baseline justify-between">
        <Text className="font-body-bold text-[10px] uppercase tracking-widest text-ft-muted-2">{definition.label}</Text>
        <View className="flex-row items-baseline gap-1">
          <Text className="font-display text-lg" style={{ color }}>
            {latestValueLabel}
          </Text>
          <Text className="font-body-semibold text-[10px] text-ft-muted-3">{definition.unit}</Text>
        </View>
      </View>

      {pathData === null ? (
        <Text className="py-6 text-center font-body-semibold text-xs text-ft-muted-3">{emptyStateLabel}</Text>
      ) : (
        <>
          <Svg width="100%" height={ChartHeight} viewBox={`0 0 ${ChartWidth} ${ChartHeight}`} preserveAspectRatio="none">
            <Path d={pathData} stroke={color} strokeWidth={ChartStrokeWidth} fill="none" />
          </Svg>
          <View className="flex-row justify-between">
            <Text className="font-body-semibold text-[9px] text-ft-muted-3">{firstDateLabel}</Text>
            <Text className="font-body-semibold text-[9px] text-ft-muted-3">{lastDateLabel}</Text>
          </View>
        </>
      )}
    </View>
  );
}
