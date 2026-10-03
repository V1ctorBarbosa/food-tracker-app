import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutUp, LinearTransition } from 'react-native-reanimated';
import Svg, { Line, Text as SvgText } from 'react-native-svg';

import { useDashboardQuery } from '@/entities/dashboard';
import { AnimatedChartLine } from '@/pages/charts/AnimatedChartLine';
import { DateRangeCalendarPanel } from '@/pages/charts/DateRangeCalendarPanel';
import {
  buildMetricSeries,
  formatMetricValue,
  MetricDefinitions,
  type ChartPoint,
  type MetricDefinition,
  type MetricId,
} from '@/pages/charts/model/chart-series';
import {
  DateRangePresetDefinitions,
  formatDateRangeLabel,
  resolveActiveDateRange,
  type DateRange,
  type DateRangePresetId,
} from '@/pages/charts/model/date-range';
import { SelectionChip } from '@/pages/charts/SelectionChip';
import {
  buildAxisTicks,
  buildLineChartCoordinates,
  buildLineChartPath,
  mapValueToY,
  type PlotArea,
} from '@/pages/charts/model/line-chart-geometry';
import { useThemeColors } from '@/shared/config/theme';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { LoadingBar } from '@/shared/ui/LoadingBar';

const ChartWidth = 320;
const ChartHeight = 120;
const ChartLeftAxisWidth = 32;
const ChartRightPadding = 6;
const ChartVerticalPadding = 10;
const ChartStrokeWidth = 2.5;
const GridlineColor = 'rgba(0, 0, 0, 0.08)';
const AxisLabelFontSize = 8;
const AxisLabelGap = 4;
const AxisLabelBaselineOffset = 3;
const DefaultSelectedMetricIds: MetricId[] = ['calories'];
const DefaultPresetId: DateRangePresetId = 'last30';
const CardEnteringDuration = 260;
const CardExitingDuration = 180;

const ChartDateFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' });

const DayCountPresetDefinitions = DateRangePresetDefinitions.filter((definition) => definition.dayCount !== null);

export function ChartsPage() {
  const today = new Date();

  const [selectedPresetId, setSelectedPresetId] = useState<DateRangePresetId>(DefaultPresetId);
  const [customRange, setCustomRange] = useState<DateRange | null>(null);
  const [isCalendarPanelOpen, setIsCalendarPanelOpen] = useState(false);
  const [selectedMetricIds, setSelectedMetricIds] = useState<MetricId[]>(DefaultSelectedMetricIds);
  const themeColors = useThemeColors();

  const activeDateRange = resolveActiveDateRange(selectedPresetId, customRange, today);
  const dashboardQuery = useDashboardQuery(activeDateRange.from, activeDateRange.to);

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

  let calendarChipLabel: string | null = null;
  if (selectedPresetId === 'custom' && customRange !== null) {
    calendarChipLabel = formatDateRangeLabel(customRange);
  }

  function selectPreset(presetId: DateRangePresetId) {
    setSelectedPresetId(presetId);
    setIsCalendarPanelOpen(false);
  }

  function openCalendarPanel() {
    setIsCalendarPanelOpen(true);
  }

  function handleConfirmCustomRange(range: DateRange) {
    setCustomRange(range);
    setSelectedPresetId('custom');
    setIsCalendarPanelOpen(false);
  }

  function handleCancelCustomRange() {
    setIsCalendarPanelOpen(false);
  }

  function toggleMetric(metricId: MetricId) {
    setSelectedMetricIds((currentIds) =>
      currentIds.includes(metricId) ? currentIds.filter((id) => id !== metricId) : [...currentIds, metricId],
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-ft-bg">
      <ScrollView className="flex-1" contentContainerClassName="gap-4 px-6 pt-5 pb-8" showsVerticalScrollIndicator={false}>
        <Text className="font-display text-4xl uppercase text-ft-calories">Gráficos</Text>

        <View className="gap-2">
          <Text className="font-body-bold text-[10px] uppercase tracking-widest text-ft-muted-2">Período</Text>
          <View className="flex-row flex-wrap gap-2">
            {DayCountPresetDefinitions.map((definition) => (
              <SelectionChip
                key={definition.id}
                label={definition.label}
                color={themeColors.calories}
                isSelected={selectedPresetId === definition.id}
                onPress={() => selectPreset(definition.id)}
              />
            ))}
            <Animated.View layout={LinearTransition.duration(200)}>
              <SelectionChip
                label={calendarChipLabel ?? 'Personalizado'}
                color={themeColors.calories}
                isSelected={selectedPresetId === 'custom'}
                onPress={openCalendarPanel}
              />
            </Animated.View>
          </View>
        </View>

        {isCalendarPanelOpen && (
          <DateRangeCalendarPanel
            initialRange={customRange}
            today={today}
            onConfirm={handleConfirmCustomRange}
            onCancel={handleCancelCustomRange}
          />
        )}

        <View className="gap-2">
          <Text className="font-body-bold text-[10px] uppercase tracking-widest text-ft-muted-2">Dados</Text>
          <View className="flex-row flex-wrap gap-2">
            {MetricDefinitions.map((definition) => (
              <SelectionChip
                key={definition.id}
                label={definition.label}
                color={themeColors[definition.colorKey]}
                isSelected={selectedMetricIds.includes(definition.id)}
                onPress={() => toggleMetric(definition.id)}
              />
            ))}
          </View>
        </View>

        {selectedDefinitions.length === 0 && (
          <Animated.Text
            entering={FadeIn.duration(180)}
            exiting={FadeOut.duration(140)}
            className="font-body-semibold text-sm text-ft-muted-2">
            Selecione ao menos um dado para ver o gráfico.
          </Animated.Text>
        )}

        {selectedDefinitions.map((definition) => (
          <MetricChartCard
            key={definition.id}
            definition={definition}
            points={seriesByMetricId[definition.id]}
            color={themeColors[definition.colorKey]}
            mutedColor={themeColors.textMuted3}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function MetricChartCard({
  definition,
  points,
  color,
  mutedColor,
}: {
  definition: MetricDefinition;
  points: ChartPoint[];
  color: string;
  mutedColor: string;
}) {
  const latestPoint = points.length > 0 ? points[points.length - 1] : null;
  const latestValueLabel = latestPoint === null ? '—' : formatMetricValue(definition, latestPoint.value);

  const values = points.map((point) => point.value);
  const axisTicks = buildAxisTicks(values, definition.yAxisStep);
  const plotArea: PlotArea = {
    x: ChartLeftAxisWidth,
    y: ChartVerticalPadding,
    width: ChartWidth - ChartLeftAxisWidth - ChartRightPadding,
    height: ChartHeight - 2 * ChartVerticalPadding,
  };
  const pathData = buildLineChartPath(values, axisTicks.domainMin, axisTicks.domainMax, plotArea);
  const coordinates = buildLineChartCoordinates(values, axisTicks.domainMin, axisTicks.domainMax, plotArea);

  const firstDateLabel = points.length > 0 ? ChartDateFormatter.format(new Date(`${points[0].date}T00:00:00`)) : null;
  const lastDateLabel = points.length > 0 ? ChartDateFormatter.format(new Date(`${points[points.length - 1].date}T00:00:00`)) : null;
  const emptyStateLabel = points.length === 0 ? 'Sem dados no período.' : 'Registre mais dias para ver a tendência.';

  return (
    <Animated.View
      entering={FadeInDown.duration(CardEnteringDuration)}
      exiting={FadeOutUp.duration(CardExitingDuration)}
      layout={LinearTransition.duration(220)}
      className="gap-2.5 rounded-[20px] bg-ft-card px-4 py-3.5">
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
            {axisTicks.values.map((tickValue) => (
              <AxisGridline
                key={tickValue}
                tickValue={tickValue}
                domainMin={axisTicks.domainMin}
                domainMax={axisTicks.domainMax}
                plotArea={plotArea}
                label={formatMetricValue(definition, tickValue)}
                labelColor={mutedColor}
              />
            ))}
            <AnimatedChartLine pathData={pathData} coordinates={coordinates} color={color} strokeWidth={ChartStrokeWidth} />
          </Svg>
          <View className="flex-row justify-between" style={{ paddingLeft: ChartLeftAxisWidth }}>
            <Text className="font-body-semibold text-[9px] text-ft-muted-3">{firstDateLabel}</Text>
            <Text className="font-body-semibold text-[9px] text-ft-muted-3">{lastDateLabel}</Text>
          </View>
        </>
      )}
    </Animated.View>
  );
}

function AxisGridline({
  tickValue,
  domainMin,
  domainMax,
  plotArea,
  label,
  labelColor,
}: {
  tickValue: number;
  domainMin: number;
  domainMax: number;
  plotArea: PlotArea;
  label: string;
  labelColor: string;
}) {
  const y = mapValueToY(tickValue, domainMin, domainMax, plotArea);

  return (
    <>
      <Line x1={plotArea.x} y1={y} x2={plotArea.x + plotArea.width} y2={y} stroke={GridlineColor} strokeWidth={1} />
      <SvgText x={plotArea.x - AxisLabelGap} y={y + AxisLabelBaselineOffset} fontSize={AxisLabelFontSize} fill={labelColor} textAnchor="end">
        {label}
      </SvgText>
    </>
  );
}
