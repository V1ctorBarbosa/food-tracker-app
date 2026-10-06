import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getMeasurementUnitLabel, useFoodsByIdsQuery } from '@/entities/food';
import {
  getMealTypeLabel,
  useDeleteMealMutation,
  useMealQuery,
  useUpdateMealMutation,
  type MealItem,
  type MealItemRequest,
} from '@/entities/meal';
import {
  calculateMacroSharePercents,
  formatItemCalories,
  formatItemCountLabel,
  formatMealItemMacros,
} from '@/pages/meal-detail/model/meal-item-view';
import { formatWholeNumber } from '@/shared/lib/format';
import { AnimatedNumber } from '@/shared/ui/AnimatedNumber';
import { BackPill } from '@/shared/ui/BackPill';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { LoadingBar } from '@/shared/ui/LoadingBar';
import { ProgressBarFill } from '@/shared/ui/ProgressBar';
import { SwipeToDeleteRow } from '@/shared/ui/SwipeToDeleteRow';

const HomeBackLabel = 'Hoje';
const HomeHref = '/today';

const DateTimeLabelFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

export function MealDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isEditingItems, setIsEditingItems] = useState(false);
  const [wasMealDeleted, setWasMealDeleted] = useState(false);
  const mealQuery = useMealQuery(id);
  const updateMealMutation = useUpdateMealMutation();
  const deleteMealMutation = useDeleteMealMutation();
  const itemFoodIds = mealQuery.data?.items.map((item) => item.foodId) ?? [];
  const foodsQuery = useFoodsByIdsQuery(itemFoodIds);

  function handlePressBack() {
    router.dismissTo(HomeHref);
  }

  if (wasMealDeleted) {
    return (
      <SafeAreaView className="flex-1 bg-ft-bg">
        <View className="flex-row px-7 pt-4">
          <BackPill label={HomeBackLabel} onPress={handlePressBack} />
        </View>
        <View className="flex-1 items-center justify-center px-7">
          <Text className="text-center font-body-semibold text-sm text-ft-muted-2">Refeição excluída.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (mealQuery.isPending || foodsQuery.isPending) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-ft-bg">
        <LoadingBar />
      </SafeAreaView>
    );
  }

  if (mealQuery.isError) {
    return (
      <SafeAreaView className="flex-1 bg-ft-bg">
        <View className="flex-row px-7 pt-4">
          <BackPill label={HomeBackLabel} onPress={handlePressBack} />
        </View>
        <View className="flex-1 items-center justify-center px-7">
          <ErrorMessage />
        </View>
      </SafeAreaView>
    );
  }

  const meal = mealQuery.data;
  const itemCountLabel = formatItemCountLabel(meal.items.length);

  let editButtonLabel = 'Editar';
  let editButtonClassName = 'bg-white';
  let editButtonTextClassName = 'text-ft-carbs-ink';
  if (isEditingItems) {
    editButtonLabel = 'Concluído';
    editButtonClassName = 'bg-ft-card';
    editButtonTextClassName = 'text-ft-ink';
  }

  async function handleRemoveItem(itemToRemove: MealItem) {
    const remainingItems: MealItemRequest[] = meal.items
      .filter((item) => item.id !== itemToRemove.id)
      .map((item) => ({ foodId: item.foodId, quantity: item.quantity, unit: item.unit, foodServingId: null, servingCount: null }));

    if (remainingItems.length === 0) {
      await deleteMealMutation.mutateAsync(meal.id);
      setWasMealDeleted(true);
      return;
    }

    await updateMealMutation.mutateAsync({ id: meal.id, request: { mealType: meal.mealType, items: remainingItems } });
  }

  return (
    <SafeAreaView className="flex-1 bg-ft-bg">
      <View className="flex-row items-center justify-between px-7 pt-4">
        <BackPill label={HomeBackLabel} onPress={handlePressBack} />
        <Pressable
          onPress={() => setIsEditingItems((previous) => !previous)}
          hitSlop={12}
          className={`rounded-full px-4 py-1.5 ${editButtonClassName}`}>
          <Text className={`font-body-bold text-sm ${editButtonTextClassName}`}>{editButtonLabel}</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="gap-4 px-7 pt-4 pb-8" showsVerticalScrollIndicator={false}>
        <Text className="font-body-bold text-xs uppercase tracking-widest text-ft-muted">
          {DateTimeLabelFormatter.format(new Date(meal.loggedAt))}
        </Text>
        <Text className="font-display text-4xl uppercase text-ft-ink">{getMealTypeLabel(meal.mealType)}</Text>

        <View className="flex-row items-baseline gap-2">
          <AnimatedNumber value={meal.totalCalories} format={formatWholeNumber} className="font-display text-5xl text-ft-ink" />
          <Text className="font-body-semibold text-base text-ft-muted-2">kcal</Text>
        </View>

        <MacroBar protein={meal.totalProtein} carbs={meal.totalCarbs} fat={meal.totalFat} />

        <View className="flex-row items-center justify-between">
          <Text className="font-body-bold text-[10px] uppercase tracking-widest text-ft-muted-2">{itemCountLabel}</Text>
          {isEditingItems && (
            <Text className="font-body-semibold text-[10px] text-ft-ink">Deslize para a esquerda para apagar</Text>
          )}
        </View>

        <View className="gap-2.5">
          {meal.items.map((item) => {
            const foodName = foodsQuery.foodsById.get(item.foodId)?.name ?? '—';

            if (!isEditingItems) {
              return <MealItemRow key={item.id} item={item} foodName={foodName} />;
            }

            return (
              <SwipeToDeleteRow key={item.id} animateEntry={false} onDelete={() => handleRemoveItem(item)}>
                <MealItemRow item={item} foodName={foodName} />
              </SwipeToDeleteRow>
            );
          })}
        </View>

        {(updateMealMutation.isError || deleteMealMutation.isError) && (
          <ErrorMessage message="Não foi possível atualizar essa refeição. Tente novamente." />
        )}

        <Pressable
          onPress={() => router.push({ pathname: '/add-food', params: { mealType: meal.mealType, mealId: meal.id } })}
          className="h-[54px] items-center justify-center rounded-2xl border border-ft-ink bg-transparent">
          <Text className="font-body-bold text-sm text-ft-ink">Adicionar item</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function MacroBar({ protein, carbs, fat }: { protein: number; carbs: number; fat: number }) {
  const { proteinPercent, carbsPercent, fatPercent } = calculateMacroSharePercents(protein, carbs, fat);

  return (
    <View className="gap-2">
      <View className="h-2.5 flex-row overflow-hidden rounded-sm bg-ft-card">
        <ProgressBarFill percent={proteinPercent} fillClassName="bg-ft-protein" />
        <ProgressBarFill percent={carbsPercent} fillClassName="bg-ft-carbs" />
        <ProgressBarFill percent={fatPercent} fillClassName="bg-ft-fat" />
      </View>
      <View className="flex-row gap-4">
        <Text className="font-body-bold text-[10px] text-ft-protein-ink">
          <AnimatedNumber value={protein} format={formatWholeNumber} />G PROTEÍNA
        </Text>
        <Text className="font-body-bold text-[10px] text-ft-carbs-ink">
          <AnimatedNumber value={carbs} format={formatWholeNumber} />G CARBOIDRATO
        </Text>
        <Text className="font-body-bold text-[10px] text-ft-fat-ink">
          <AnimatedNumber value={fat} format={formatWholeNumber} />G GORDURA
        </Text>
      </View>
    </View>
  );
}

function MealItemRow({ item, foodName }: { item: MealItem; foodName: string }) {
  const macroSummaryLabel = formatMealItemMacros({
    quantity: item.quantity,
    unitLabel: getMeasurementUnitLabel(item.unit),
    protein: item.protein,
    carbs: item.carbs,
    fat: item.fat,
  });
  const caloriesLabel = formatItemCalories(item.calories);

  return (
    <View className="flex-row items-center justify-between rounded-2xl bg-ft-card px-4 py-3">
      <View className="flex-1 gap-0.5">
        <Text className="font-body-semibold text-sm text-ft-ink">{foodName}</Text>
        <Text className="font-body text-xs text-ft-muted-2">{macroSummaryLabel}</Text>
      </View>
      <Text className="ml-3 font-body-bold text-sm text-ft-ink">{caloriesLabel}</Text>
    </View>
  );
}
