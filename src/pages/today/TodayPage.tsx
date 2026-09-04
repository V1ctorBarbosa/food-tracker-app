import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDashboardQuery } from '@/entities/dashboard';
import { useTodaysMealsQuery } from '@/entities/meal';
import {
  calculateProgressPercent,
  countDistinctMealTypes,
  findNextPendingMealType,
  formatLiters,
} from '@/pages/today/model/dashboard-view';
import { daysBefore, formatDateOnly } from '@/shared/lib/date';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { LoadingBar } from '@/shared/ui/LoadingBar';

const DaysInWeek = 7;
const WaterBarSegmentCount = 16;

const DateLabelFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
const WeekdayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'narrow' });

export function TodayPage() {
  const router = useRouter();
  const today = new Date();
  const todayDate = formatDateOnly(today);
  const rangeStartDate = formatDateOnly(daysBefore(today, DaysInWeek - 1));

  const dashboardQuery = useDashboardQuery(rangeStartDate, todayDate);
  const todaysMealsQuery = useTodaysMealsQuery(todayDate);

  if (dashboardQuery.isPending || todaysMealsQuery.isPending) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-ft-bg">
        <LoadingBar />
      </SafeAreaView>
    );
  }

  if (dashboardQuery.isError || todaysMealsQuery.isError) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-ft-bg px-7">
        <ErrorMessage />
      </SafeAreaView>
    );
  }

  const dashboard = dashboardQuery.data;
  const todaysMeals = todaysMealsQuery.data;
  const todayNutrition = dashboard.nutritionHistory.find((entry) => entry.date === todayDate);
  const calories = todayNutrition?.calories ?? 0;
  const protein = todayNutrition?.protein ?? 0;
  const carbs = todayNutrition?.carbs ?? 0;
  const fat = todayNutrition?.fat ?? 0;
  const waterMilliliters = todayNutrition?.waterMilliliters ?? 0;

  const caloriesRemaining = dashboard.dailyCalorieTarget - calories;
  const loggedMealTypes = todaysMeals.map((meal) => meal.mealType);
  const pendingMealType = findNextPendingMealType(loggedMealTypes);
  const weightHistory = [...dashboard.weightHistory].sort((a, b) => a.date.localeCompare(b.date));
  const previousWeight = weightHistory.length >= 2 ? weightHistory[weightHistory.length - 2].weightKilograms : null;
  const weightDelta =
    previousWeight !== null && dashboard.currentWeightKilograms !== null
      ? dashboard.currentWeightKilograms - previousWeight
      : null;

  return (
    <SafeAreaView className="flex-1 bg-ft-bg">
      <ScrollView className="flex-1" contentContainerClassName="gap-3 px-6 pt-5" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-end justify-between">
          <View>
            <Text className="font-body-bold text-xs uppercase tracking-widest text-ft-muted">
              {DateLabelFormatter.format(today)}
            </Text>
            <Text className="font-display text-5xl uppercase text-ft-calories">Today</Text>
          </View>
          <Pressable
            onPress={() => router.push('/log')}
            className="h-[38px] w-[38px] items-center justify-center rounded-full bg-ft-calories">
            <Text className="pb-0.5 text-xl text-white">+</Text>
          </Pressable>
        </View>

        <View className="gap-4 rounded-[22px] bg-ft-calories p-5">
          <View className="flex-row items-baseline justify-between">
            <Text className="font-body-bold text-xs uppercase tracking-widest text-blue-200">Calories</Text>
            <Text className="font-body-semibold text-xs text-blue-200">
              {caloriesRemaining >= 0 ? `${caloriesRemaining} left` : `${Math.abs(caloriesRemaining)} over`}
            </Text>
          </View>
          <View className="flex-row items-baseline gap-2">
            <Text className="font-display text-6xl text-white">{calories.toLocaleString('en-US')}</Text>
            <Text className="font-display text-2xl text-blue-300">/ {dashboard.dailyCalorieTarget.toLocaleString('en-US')}</Text>
          </View>
          <View className="h-2.5 flex-row overflow-hidden rounded-sm bg-ft-calories-dark">
            <View
              className="bg-ft-fat"
              style={{ width: `${calculateProgressPercent(calories, dashboard.dailyCalorieTarget)}%` }}
            />
          </View>
        </View>

        <View className="flex-row gap-2.5">
          <MacroCard label="Protein" value={protein} target={dashboard.dailyProteinTargetGrams} colorClassName="text-ft-protein" barColorClassName="bg-ft-protein" />
          <MacroCard label="Carbs" value={carbs} target={dashboard.dailyCarbsTargetGrams} colorClassName="text-ft-carbs" barColorClassName="bg-ft-carbs" />
          <MacroCard label="Fat" value={fat} target={dashboard.dailyFatTargetGrams} colorClassName="text-ft-fat" barColorClassName="bg-ft-fat" />
        </View>

        <View className="gap-3 rounded-[20px] bg-ft-water p-4">
          <View className="flex-row items-baseline justify-between">
            <Text className="font-body-bold text-xs uppercase tracking-widest text-sky-100">Water</Text>
            <Text className="font-display text-xl text-white">
              {formatLiters(waterMilliliters)}
              <Text className="font-body-semibold text-xs"> / {formatLiters(dashboard.dailyWaterTargetMilliliters ?? 0)} L</Text>
            </Text>
          </View>
          <View className="h-[26px] flex-row gap-1">
            {Array.from({ length: WaterBarSegmentCount }, (_, segmentIndex) => {
              const segmentThreshold = ((segmentIndex + 1) / WaterBarSegmentCount) * 100;
              const isFilled = calculateProgressPercent(waterMilliliters, dashboard.dailyWaterTargetMilliliters) >= segmentThreshold;
              return <View key={segmentIndex} className={`flex-1 rounded-sm ${isFilled ? 'bg-ft-water-dark' : 'bg-ft-card'}`} />;
            })}
          </View>
        </View>

        <View className="flex-row gap-2.5">
          <View className="flex-[1.15] gap-2 rounded-[18px] bg-ft-card px-4 py-3.5">
            <Text className="font-body-bold text-[10px] uppercase tracking-widest text-ft-muted-2">Weight</Text>
            <View className="flex-row items-baseline gap-1.5">
              <Text className="font-display text-3xl text-ft-weight">
                {dashboard.currentWeightKilograms?.toFixed(1) ?? '—'}
              </Text>
              <Text className="font-body-semibold text-xs text-ft-muted-2">kg</Text>
              {weightDelta !== null && (
                <Text className="rounded bg-ft-weight px-1.5 py-0.5 font-body-bold text-[11px] text-white">
                  {weightDelta >= 0 ? '+' : ''}
                  {weightDelta.toFixed(1)}
                </Text>
              )}
            </View>
            <Text className="font-body-semibold text-[10px] text-ft-muted-3">
              Target {dashboard.targetWeightKilograms?.toFixed(1) ?? '—'} kg
            </Text>
          </View>

          <View className="flex-1 gap-2 rounded-[18px] bg-ft-card px-4 py-3.5">
            <Text className="font-body-bold text-[10px] uppercase tracking-widest text-ft-muted-2">Meals</Text>
            <Text className="font-display text-3xl text-ft-calories">
              {countDistinctMealTypes(loggedMealTypes)}
              <Text className="font-body text-base text-ft-muted-3"> / 4</Text>
            </Text>
            <Text className="font-body-semibold text-[10px] text-ft-muted-3">
              {pendingMealType !== null ? `${pendingMealType} pending` : 'All logged'}
            </Text>
          </View>
        </View>

        <View className="gap-2.5 rounded-[20px] bg-ft-card px-4 py-3.5 pb-3">
          <Text className="font-body-bold text-[10px] uppercase tracking-widest text-ft-muted-2">Last 7 days · Calories</Text>
          <WeeklyCaloriesChart nutritionHistory={dashboard.nutritionHistory} />
        </View>
      </ScrollView>
    </SafeAreaView>
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
      <Text className={`font-body-bold text-[10px] uppercase tracking-widest ${colorClassName}`}>{label}</Text>
      <Text className={`font-display text-[28px] ${colorClassName}`}>
        {value}
        <Text className="text-sm">g</Text>
      </Text>
      <View className="h-[7px] overflow-hidden rounded-sm bg-black/10">
        <View className={barColorClassName} style={{ width: `${calculateProgressPercent(value, target)}%` }} />
      </View>
      <Text className="font-body-semibold text-[10px] text-ft-muted-3">{target !== null ? `of ${target}g` : 'no target'}</Text>
    </View>
  );
}

function WeeklyCaloriesChart({ nutritionHistory }: { nutritionHistory: { date: string; calories: number }[] }) {
  const maxCalories = Math.max(1, ...nutritionHistory.map((entry) => entry.calories));

  return (
    <View className="gap-2">
      <View className="h-[60px] flex-row items-end gap-1.5">
        {nutritionHistory.map((entry) => (
          <View
            key={entry.date}
            className="flex-1 rounded-sm bg-ft-calories"
            style={{ height: `${Math.max(4, (entry.calories / maxCalories) * 100)}%` }}
          />
        ))}
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
