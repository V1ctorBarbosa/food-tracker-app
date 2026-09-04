import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getMealTypeLabel, useTodaysMealsQuery, type MealType } from '@/entities/meal';
import { findNextPendingMealType } from '@/pages/today/model/dashboard-view';
import { formatDateOnly } from '@/shared/lib/date';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { LoadingBar } from '@/shared/ui/LoadingBar';

const AllMealTypes: readonly MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export function LogMealTypePage() {
  const router = useRouter();
  const today = formatDateOnly(new Date());
  const todaysMealsQuery = useTodaysMealsQuery(today);

  if (todaysMealsQuery.isPending) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-ft-bg">
        <LoadingBar />
      </SafeAreaView>
    );
  }

  if (todaysMealsQuery.isError) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-ft-bg px-7">
        <ErrorMessage />
      </SafeAreaView>
    );
  }

  const todaysMeals = todaysMealsQuery.data;
  const loggedMealTypes = todaysMeals.map((meal) => meal.mealType);
  const pendingMealType = findNextPendingMealType(loggedMealTypes);

  function handlePressMealType(mealType: MealType) {
    const existingMeal = todaysMeals.find((meal) => meal.mealType === mealType);
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
          <Text className="font-body-bold text-xs uppercase tracking-widest text-ft-muted">Registrar refeição</Text>
          <Text className="font-display text-4xl uppercase leading-tight text-ft-calories">O que você vai registrar?</Text>
        </View>

        <View className="gap-3">
          {AllMealTypes.map((mealType) => {
            const isPending = mealType === pendingMealType;
            return (
              <Pressable
                key={mealType}
                onPress={() => handlePressMealType(mealType)}
                className={`h-[58px] flex-row items-center justify-between rounded-2xl px-5 ${isPending ? 'bg-ft-calories' : 'bg-ft-card'}`}>
                <Text className={`font-body-bold text-lg ${isPending ? 'text-white' : 'text-ft-calories'}`}>{getMealTypeLabel(mealType)}</Text>
                {isPending && <Text className="font-body-semibold text-xs uppercase tracking-widest text-blue-200">Pendente</Text>}
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}
