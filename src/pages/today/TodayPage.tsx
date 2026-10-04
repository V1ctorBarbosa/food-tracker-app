import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDashboardQuery } from '@/entities/dashboard';
import { getMealTypeLabel, useDayMealsQuery } from '@/entities/meal';
import { formatDayTitle, formatLongDate, formatMealsHeading, useSelectedDay } from '@/entities/selected-day';
import { ThemeToggleButton } from '@/features/theme';
import { resolveDayTitleSizeClassName } from '@/pages/today/model/day-header';
import {
  calculateProgressPercent,
  calculateWeightDelta,
  countDistinctMealTypes,
  findNextPendingMealType,
  formatCaloriesRemaining,
  formatLiters,
  formatMacroGrams,
  getTodayNutrition,
} from '@/pages/today/model/dashboard-view';
import { daysBefore, formatDateOnly, parseDateOnly } from '@/shared/lib/date';
import { formatSignedNumber, formatWholeNumber } from '@/shared/lib/format';
import { MotionDurationMs } from '@/shared/lib/motion';
import { AnimatedNumber } from '@/shared/ui/AnimatedNumber';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { LoadingBar } from '@/shared/ui/LoadingBar';
import { PressableScale } from '@/shared/ui/PressableScale';
import { ProgressBar } from '@/shared/ui/ProgressBar';
import { SegmentedProgressBar } from '@/shared/ui/SegmentedProgressBar';
import { useCountUp } from '@/shared/ui/use-count-up';

const DaysInWeek = 7;
const WaterBarSegmentCount = 16;
const WeightDeltaDecimalPlaces = 1;
const WeightDecimalPlaces = 1;

const WeekdayFormatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'narrow' });

function formatWeight(weightKilograms: number): string {
  return weightKilograms.toFixed(WeightDecimalPlaces);
}

export function TodayPage() {
  const router = useRouter();
  const { day, daysBack } = useSelectedDay();
  const rangeStartDate = formatDateOnly(daysBefore(parseDateOnly(day), DaysInWeek - 1));

  const dashboardQuery = useDashboardQuery(rangeStartDate, day);
  const dayMealsQuery = useDayMealsQuery(day);

  if (dashboardQuery.isPending || dayMealsQuery.isPending) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-ft-bg">
        <LoadingBar />
      </SafeAreaView>
    );
  }

  if (dashboardQuery.isError || dayMealsQuery.isError) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-ft-bg px-7">
        <ErrorMessage />
      </SafeAreaView>
    );
  }

  const dashboard = dashboardQuery.data;
  const dayMeals = dayMealsQuery.data;
  const { calories, protein, carbs, fat, waterMilliliters } = getTodayNutrition(dashboard.nutritionHistory, day);

  const calorieTargetLabel = dashboard.dailyCalorieTarget.toLocaleString('pt-BR');
  const longDateLabel = formatLongDate(day);
  const dayTitle = formatDayTitle(daysBack);
  const dayTitleSizeClassName = resolveDayTitleSizeClassName(daysBack);
  const mealsHeading = formatMealsHeading(daysBack);

  const loggedMealTypes = dayMeals.map((meal) => meal.mealType);
  const pendingMealType = findNextPendingMealType(loggedMealTypes);
  const pendingMealTypeLabel = pendingMealType === null ? 'Tudo registrado' : `${getMealTypeLabel(pendingMealType)} pendente`;

  const targetWeightLabel = dashboard.targetWeightKilograms?.toFixed(WeightDecimalPlaces) ?? '—';
  const weightDelta = calculateWeightDelta(dashboard.weightHistory, dashboard.currentWeightKilograms);
  const weightDeltaLabel = weightDelta === null ? null : formatSignedNumber(weightDelta, WeightDeltaDecimalPlaces);

  return (
    <SafeAreaView className="flex-1 bg-ft-bg">
      <ScrollView className="flex-1" contentContainerClassName="gap-3 px-6 pt-5" showsVerticalScrollIndicator={false}>
        <View className="gap-1">
          <Text className="font-body-bold text-xs uppercase tracking-widest text-ft-muted">
            {longDateLabel}
          </Text>
          <View className="flex-row items-center justify-between gap-3">
            <Pressable
              onPress={() => router.push('/day-picker')}
              accessibilityRole="button"
              accessibilityLabel="Escolher dia"
              hitSlop={8}
              className="min-w-0 flex-shrink flex-row items-center gap-2">
              <Text numberOfLines={1} className={`font-display uppercase text-ft-ink ${dayTitleSizeClassName}`}>
                {dayTitle}
              </Text>
              <ChevronDownIcon />
            </Pressable>
            <View className="flex-row gap-2">
              <ThemeToggleButton />
              <Pressable
                onPress={() => router.push('/log')}
                accessibilityRole="button"
                accessibilityLabel="Registrar refeição"
                className="h-[38px] w-[38px] items-center justify-center rounded-full bg-ft-calories">
                <PlusIcon />
              </Pressable>
            </View>
          </View>
        </View>

        <View className="gap-4 rounded-[22px] bg-ft-calories p-5">
          <View className="flex-row items-baseline justify-between">
            <Text className="font-body-bold text-xs uppercase tracking-widest text-blue-200">Calorias</Text>
            <CaloriesRemainingLabel calories={calories} calorieTarget={dashboard.dailyCalorieTarget} />
          </View>
          <View className="flex-row items-baseline gap-2">
            <AnimatedNumber value={calories} format={formatWholeNumber} className="font-display text-6xl text-white" />
            <Text className="font-display text-2xl text-blue-300">/ {calorieTargetLabel}</Text>
          </View>
          <ProgressBar
            progressPercent={calculateProgressPercent(calories, dashboard.dailyCalorieTarget)}
            fillClassName="bg-ft-fat"
            trackClassName="h-2.5 rounded-sm bg-ft-calories-dark"
            durationMs={MotionDurationMs.countUp}
          />
        </View>

        <View className="flex-row gap-2.5">
          <MacroCard label="Proteína" value={protein} target={dashboard.dailyProteinTargetGrams} colorClassName="text-ft-protein-ink" barColorClassName="bg-ft-protein" />
          <MacroCard label="Carb" value={carbs} target={dashboard.dailyCarbsTargetGrams} colorClassName="text-ft-carbs-ink" barColorClassName="bg-ft-carbs" />
          <MacroCard label="Gordura" value={fat} target={dashboard.dailyFatTargetGrams} colorClassName="text-ft-fat-ink" barColorClassName="bg-ft-fat" />
        </View>

        <PressableScale onPress={() => router.push('/log-water')} className="gap-3 rounded-[20px] bg-ft-water p-4">
          <View className="flex-row items-baseline justify-between">
            <Text className="font-body-bold text-xs uppercase tracking-widest text-sky-100">Água</Text>
            <Text className="font-display text-xl text-white">
              <AnimatedNumber value={waterMilliliters} format={formatLiters} />
              <Text className="font-body-semibold text-xs"> / {formatLiters(dashboard.dailyWaterTargetMilliliters ?? 0)} L</Text>
            </Text>
          </View>
          <SegmentedProgressBar
            segmentCount={WaterBarSegmentCount}
            progressPercent={calculateProgressPercent(waterMilliliters, dashboard.dailyWaterTargetMilliliters)}
            filledColorClassName="bg-ft-water-dark"
            durationMs={MotionDurationMs.countUp}
          />
        </PressableScale>

        <View className="flex-row gap-2.5">
          <PressableScale
            onPress={() => router.push('/log-weight')}
            className="flex-[1.15] gap-2 rounded-[18px] bg-ft-card px-4 py-3.5">
            <Text className="font-body-bold text-[10px] uppercase tracking-widest text-ft-muted-2">Peso</Text>
            <View className="flex-row items-baseline gap-1.5">
              <AnimatedNumber
                value={dashboard.currentWeightKilograms}
                format={formatWeight}
                className="font-display text-3xl text-ft-weight-ink"
              />
              <Text className="font-body-semibold text-xs text-ft-muted-2">kg</Text>
              {weightDeltaLabel !== null && (
                <Text className="rounded bg-ft-weight px-1.5 py-0.5 font-body-bold text-[11px] text-white">{weightDeltaLabel}</Text>
              )}
            </View>
            <Text className="font-body-semibold text-[10px] text-ft-muted-3">Meta {targetWeightLabel} kg</Text>
          </PressableScale>

          <View className="flex-1 gap-2 rounded-[18px] bg-ft-card px-4 py-3.5">
            <Text className="font-body-bold text-[10px] uppercase tracking-widest text-ft-muted-2">Refeições</Text>
            <Text className="font-display text-3xl text-ft-ink">
              <AnimatedNumber value={countDistinctMealTypes(loggedMealTypes)} format={formatWholeNumber} />
              <Text className="font-body text-base text-ft-muted-3"> / 4</Text>
            </Text>
            <Text className="font-body-semibold text-[10px] text-ft-muted-3">{pendingMealTypeLabel}</Text>
          </View>
        </View>

        {dayMeals.length > 0 && (
          <View className="gap-2">
            <Text className="font-body-bold text-[10px] uppercase tracking-widest text-ft-muted-2">{mealsHeading}</Text>
            {dayMeals.map((meal) => (
              <PressableScale
                key={meal.id}
                onPress={() => router.push({ pathname: '/meal/[id]', params: { id: meal.id } })}
                className="flex-row items-center justify-between rounded-[18px] bg-ft-card px-4 py-3">
                <Text className="font-body-semibold text-sm text-ft-ink">{getMealTypeLabel(meal.mealType)}</Text>
                <Text className="font-body-semibold text-sm text-ft-muted-2">{meal.totalCalories} kcal</Text>
              </PressableScale>
            ))}
          </View>
        )}

        <View className="gap-2.5 rounded-[20px] bg-ft-card px-4 py-3.5 pb-3">
          <Text className="font-body-bold text-[10px] uppercase tracking-widest text-ft-muted-2">Últimos 7 dias · Calorias</Text>
          <WeeklyCaloriesChart nutritionHistory={dashboard.nutritionHistory} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function CaloriesRemainingLabel({ calories, calorieTarget }: { calories: number; calorieTarget: number }) {
  const displayedCalories = useCountUp(calories);
  const label = formatCaloriesRemaining(calorieTarget - displayedCalories);

  return <Text className="font-body-semibold text-xs text-blue-200">{label}</Text>;
}

function ChevronDownIcon() {
  return (
    <View
      className="h-[9px] w-[9px] border-b-[2.5px] border-r-[2.5px] border-ft-ink"
      style={{ transform: [{ translateY: -3 }, { rotate: '45deg' }] }}
    />
  );
}

function PlusIcon() {
  return (
    <View className="h-3 w-3 items-center justify-center">
      <View className="absolute h-3 w-[2px] rounded-full bg-white" />
      <View className="absolute h-[2px] w-3 rounded-full bg-white" />
    </View>
  );
}

function MacroCard({
  label,
  value,
  target,
  colorClassName,
  barColorClassName,
}: {
  label: string;
  value: number;
  target: number | null;
  colorClassName: string;
  barColorClassName: string;
}) {
  return (
    <View className="flex-1 gap-2.5 rounded-[18px] bg-ft-card p-3.5">
      <Text numberOfLines={1} className={`font-body-bold text-[10px] uppercase tracking-wide ${colorClassName}`}>
        {label}
      </Text>
      <Text numberOfLines={1} className={`font-display text-2xl ${colorClassName}`}>
        <AnimatedNumber value={value} format={formatMacroGrams} />
        <Text className="text-xs">g</Text>
      </Text>
      {target !== null && <MacroTargetProgress value={value} target={target} barColorClassName={barColorClassName} />}
    </View>
  );
}

function MacroTargetProgress({ value, target, barColorClassName }: { value: number; target: number; barColorClassName: string }) {
  const targetLabel = `de ${target}g`;
  const progressPercent = calculateProgressPercent(value, target);

  return (
    <>
      <ProgressBar
        progressPercent={progressPercent}
        fillClassName={barColorClassName}
        trackClassName="h-[7px] rounded-sm bg-black/10"
        durationMs={MotionDurationMs.countUp}
      />
      <Text className="font-body-semibold text-[10px] text-ft-muted-3">{targetLabel}</Text>
    </>
  );
}

const MinimumCalorieBarHeightPercent = 4;

function WeeklyCaloriesChart({ nutritionHistory }: { nutritionHistory: { date: string; calories: number }[] }) {
  const maxCalories = Math.max(1, ...nutritionHistory.map((entry) => entry.calories));

  return (
    <View className="gap-2">
      <View className="h-[60px] flex-row items-end gap-1.5">
        {nutritionHistory.map((entry) => {
          const barHeightPercent = Math.max(MinimumCalorieBarHeightPercent, (entry.calories / maxCalories) * 100);
          return <View key={entry.date} className="flex-1 rounded-sm bg-ft-calories" style={{ height: `${barHeightPercent}%` }} />;
        })}
      </View>
      <View className="flex-row gap-1.5">
        {nutritionHistory.map((entry) => (
          <Text key={entry.date} className="flex-1 text-center font-body-semibold text-[9px] text-ft-muted-3">
            {WeekdayFormatter.format(new Date(`${entry.date}T00:00:00`))}
          </Text>
        ))}
      </View>
    </View>
  );
}
