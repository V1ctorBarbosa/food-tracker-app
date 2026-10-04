import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getMealTypeLabel, useDayMealsQuery, type MealType } from '@/entities/meal';
import { formatLogLabel, useSelectedDay } from '@/entities/selected-day';
import { findNextPendingMealType } from '@/pages/today/model/dashboard-view';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { LoadingBar } from '@/shared/ui/LoadingBar';
import { PressableScale } from '@/shared/ui/PressableScale';

const AllMealTypes: readonly MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export function LogMealTypePage() {
  const router = useRouter();
  const { day, daysBack } = useSelectedDay();
  const dayMealsQuery = useDayMealsQuery(day);

  if (dayMealsQuery.isPending) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-ft-bg">
        <LoadingBar />
      </SafeAreaView>
    );
  }

  if (dayMealsQuery.isError) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-ft-bg px-7">
        <ErrorMessage />
      </SafeAreaView>
    );
  }

  const dayMeals = dayMealsQuery.data;
  const logLabel = formatLogLabel(daysBack, day);
  const loggedMealTypes = dayMeals.map((meal) => meal.mealType);
  const pendingMealType = findNextPendingMealType(loggedMealTypes);

  function handlePressMealType(mealType: MealType) {
    const existingMeal = dayMeals.find((meal) => meal.mealType === mealType);
    if (existingMeal !== undefined) {
      router.push({ pathname: '/meal/[id]', params: { id: existingMeal.id } });
      return;
    }

    router.push({ pathname: '/add-food', params: { mealType } });
  }

  return (
    <SafeAreaView className="flex-1 bg-ft-bg">
      <View className="flex-1 justify-center gap-8 px-7">
        <View className="gap-2">
          <Text className="font-body-bold text-xs uppercase tracking-widest text-ft-muted">{logLabel}</Text>
          <Text className="font-display text-4xl uppercase leading-tight text-ft-ink">O que você vai registrar?</Text>
        </View>

        <View className="gap-3">
          {AllMealTypes.map((mealType) => {
            const isPending = mealType === pendingMealType;
            return (
              <PressableScale
                key={mealType}
                onPress={() => handlePressMealType(mealType)}
                className={`h-[58px] flex-row items-center justify-between rounded-2xl px-5 ${isPending ? 'bg-ft-calories' : 'bg-ft-card'}`}>
                <Text className={`font-body-bold text-lg ${isPending ? 'text-white' : 'text-ft-ink'}`}>{getMealTypeLabel(mealType)}</Text>
                {isPending && <Text className="font-body-semibold text-xs uppercase tracking-widest text-blue-200">Pendente</Text>}
              </PressableScale>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}
