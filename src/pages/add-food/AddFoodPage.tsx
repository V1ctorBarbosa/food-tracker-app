import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Food } from '@/entities/food';
import { calculateNutritionForQuantity, getMeasurementUnitLabel, useCreateCustomFoodMutation, useFoodSearchQuery } from '@/entities/food';
import {
  getMealTypeLabel,
  useCreateMealMutation,
  useMealQuery,
  useUpdateMealMutation,
  toMealItemRequest,
  type MealItemRequest,
  type MealType,
} from '@/entities/meal';
import { buildLoggedAt, useSelectedDay } from '@/entities/selected-day';
import { CustomFoodForm, EmptyCustomFoodFields, type CustomFoodFormFields, type CustomFoodValues } from '@/features/custom-food-form';
import { filterFoodsByKind, getFoodKindView, parseFoodKind } from '@/pages/add-food/model/food-kind';
import { isSelectedFoodMissingFromResults } from '@/pages/add-food/model/selected-food-row';
import { FoodRow } from '@/pages/add-food/ui/FoodRow';
import { QuantityPanel } from '@/shared/ui/QuantityPanel';
import { useThemeColors } from '@/shared/config/theme';
import type { NutritionPreview } from '@/shared/lib/nutrition-preview-labels';
import { MotionDurationMs } from '@/shared/lib/motion';
import { parseDecimalInput } from '@/shared/lib/parse-decimal';
import { BackPill } from '@/shared/ui/BackPill';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { LoadingBar } from '@/shared/ui/LoadingBar';

const BackLabel = 'Voltar';
const QuantityStep = 10;
const MinimumQuantity = 1;

const AppearTransition = FadeIn.duration(MotionDurationMs.listEnter);
const DisappearTransition = FadeOut.duration(MotionDurationMs.listExit);
const ReflowTransition = LinearTransition.duration(MotionDurationMs.listReflow);

export function AddFoodPage() {
  const router = useRouter();
  const colors = useThemeColors();
  const { day } = useSelectedDay();
  const { mealType, mealId, kind } = useLocalSearchParams<{ mealType: MealType; mealId?: string; kind?: string }>();
  const foodKind = parseFoodKind(kind);
  const foodKindView = getFoodKindView(foodKind);
  const [searchText, setSearchText] = useState('');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState(100);
  const [isCustomFoodFormVisible, setIsCustomFoodFormVisible] = useState(false);

  const foodSearchQuery = useFoodSearchQuery(searchText);
  const existingMealQuery = useMealQuery(mealId);
  const createMealMutation = useCreateMealMutation();
  const updateMealMutation = useUpdateMealMutation();
  const createCustomFoodMutation = useCreateCustomFoodMutation();

  const isAppendMode = mealId !== undefined;
  const isSaving = createMealMutation.isPending || updateMealMutation.isPending;
  const saveError = createMealMutation.isError || updateMealMutation.isError;

  if (isAppendMode && existingMealQuery.isPending) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-ft-bg">
        <LoadingBar />
      </SafeAreaView>
    );
  }

  if (isAppendMode && existingMealQuery.isError) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-ft-bg px-7">
        <ErrorMessage />
      </SafeAreaView>
    );
  }

  function handleChangeSearchText(text: string) {
    setSearchText(text);
    setSelectedFood(null);
  }

  function handleSelectFood(food: Food) {
    Keyboard.dismiss();
    setSelectedFood(food);
    setQuantity(food.baseUnitQuantity);
  }

  function handleAdjustQuantity(delta: number) {
    setQuantity((previousQuantity) => Math.max(MinimumQuantity, previousQuantity + delta));
  }

  function handleChangeQuantityText(text: string) {
    const parsedQuantity = parseDecimalInput(text);
    if (parsedQuantity === null) {
      return;
    }

    setQuantity(Math.max(MinimumQuantity, parsedQuantity));
  }

  async function handleSaveCustomFood(values: CustomFoodValues) {
    const createdFood = await createCustomFoodMutation.mutateAsync(values);

    handleSelectFood(createdFood);
    setIsCustomFoodFormVisible(false);
  }

  let customFoodErrorMessage: string | null = null;
  if (createCustomFoodMutation.isError) {
    customFoodErrorMessage = 'Não foi possível salvar esse alimento. Tente novamente.';
  }

  async function handlePressAdd() {
    if (selectedFood === null) {
      return;
    }

    const newItem: MealItemRequest = {
      foodId: selectedFood.id,
      quantity,
      unit: selectedFood.baseUnitType,
    };

    if (isAppendMode && mealId !== undefined && existingMealQuery.data !== undefined) {
      const existingItems = existingMealQuery.data.items.map(toMealItemRequest);

      await updateMealMutation.mutateAsync({
        id: mealId,
        request: { mealType: existingMealQuery.data.mealType, items: [...existingItems, newItem] },
      });
      // The meal's detail screen is already open underneath the add-meal choices: going back to it
      // reuses it (its query was just invalidated) instead of stacking another copy for every item added.
      router.dismissTo({ pathname: '/meal/[id]', params: { id: mealId } });
      return;
    }

    const createdMeal = await createMealMutation.mutateAsync({
      mealType,
      items: [newItem],
      loggedAt: buildLoggedAt(day, new Date()),
    });
    router.replace({ pathname: '/meal/[id]', params: { id: createdMeal.id } });
  }

  let preview: NutritionPreview | null = null;
  if (selectedFood !== null) {
    preview = calculateNutritionForQuantity(selectedFood, quantity);
  }

  let foodsOfKind: Food[] | undefined;
  if (foodSearchQuery.data !== undefined) {
    foodsOfKind = filterFoodsByKind(foodSearchQuery.data, foodKind);
  }

  const showSelectedFoodRow = isSelectedFoodMissingFromResults(selectedFood, foodsOfKind);
  const customFoodInitialFields: CustomFoodFormFields = { ...EmptyCustomFoodFields, baseUnitType: foodKindView.customFoodBaseUnit };

  let customFoodToggleLabel = 'Adicionar alimento personalizado';
  if (isCustomFoodFormVisible) {
    customFoodToggleLabel = 'Cancelar alimento personalizado';
  }

  const backLabel = BackLabel;

  return (
    <SafeAreaView className="flex-1 bg-ft-bg">
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <View className="flex-row items-center justify-between px-7 pt-4">
          <BackPill label={backLabel} onPress={() => router.back()} />
          <Text className="font-body-bold text-xs uppercase tracking-widest text-ft-muted">{getMealTypeLabel(mealType)}</Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-4 px-7 pt-4 pb-4"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Text className="font-display text-4xl uppercase text-ft-ink">{foodKindView.title}</Text>

          <TextInput
            autoFocus
            value={searchText}
            onChangeText={handleChangeSearchText}
            placeholder={foodKindView.searchPlaceholder}
            placeholderTextColor={colors.textMuted3}
            className="h-[54px] rounded-2xl border-0 bg-ft-card px-5 font-body-medium text-base text-ft-ink outline-none"
          />

          <Pressable onPress={() => setIsCustomFoodFormVisible((previous) => !previous)} hitSlop={8}>
            <Text className="font-body-semibold text-sm text-ft-ink">{customFoodToggleLabel}</Text>
          </Pressable>

          {isCustomFoodFormVisible && (
            <Animated.View entering={AppearTransition} exiting={DisappearTransition} layout={ReflowTransition}>
              <CustomFoodForm
                title="Novo alimento"
                initialFields={customFoodInitialFields}
                submitLabel="Salvar"
                isSaving={createCustomFoodMutation.isPending}
                errorMessage={customFoodErrorMessage}
                onSubmit={handleSaveCustomFood}
              />
            </Animated.View>
          )}

          {selectedFood !== null && showSelectedFoodRow && (
            <Animated.View entering={AppearTransition} exiting={DisappearTransition} layout={ReflowTransition} className="gap-2">
              <Text className="font-body-bold text-[10px] uppercase tracking-widest text-ft-muted-2">{foodKindView.selectedLabel}</Text>
              <FoodRow food={selectedFood} isSelected onPress={handleSelectFood} />
            </Animated.View>
          )}

          <Animated.View layout={ReflowTransition}>
            <FoodSearchResults
              query={foodSearchQuery}
              foods={foodsOfKind}
              searchText={searchText}
              selectedFoodId={selectedFood?.id ?? null}
              onSelectFood={handleSelectFood}
            />
          </Animated.View>
        </ScrollView>

        <View className="gap-3 px-7 pb-3 pt-2">
          {selectedFood !== null && preview !== null && (
            <Animated.View entering={AppearTransition} exiting={DisappearTransition} layout={ReflowTransition}>
              <QuantityPanel
                quantity={quantity}
                unitLabel={getMeasurementUnitLabel(selectedFood.baseUnitType)}
                preview={preview}
                step={QuantityStep}
                onAdjustQuantity={handleAdjustQuantity}
                onChangeQuantityText={handleChangeQuantityText}
              />
            </Animated.View>
          )}

          {saveError && (
            <Animated.View entering={AppearTransition} exiting={DisappearTransition} layout={ReflowTransition}>
              <ErrorMessage message="Não foi possível salvar essa refeição. Tente novamente." />
            </Animated.View>
          )}

          <Animated.View layout={ReflowTransition}>
            <Pressable
              onPress={handlePressAdd}
              disabled={selectedFood === null || isSaving}
              className="h-[54px] items-center justify-center rounded-2xl bg-ft-calories disabled:opacity-40">
              {isSaving && <ActivityIndicator color="white" />}
              {!isSaving && <Text className="font-body-bold text-base text-white">Adicionar em {getMealTypeLabel(mealType)}</Text>}
            </Pressable>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/** `foods` is the search's results already narrowed to the kind being searched (foods or drinks). */
function FoodSearchResults({
  query,
  foods,
  searchText,
  selectedFoodId,
  onSelectFood,
}: {
  query: ReturnType<typeof useFoodSearchQuery>;
  foods: Food[] | undefined;
  searchText: string;
  selectedFoodId: string | null;
  onSelectFood: (food: Food) => void;
}) {
  if (searchText.trim().length < 3) {
    return <Text className="font-body text-sm text-ft-muted-2">Continue digitando para buscar alimentos.</Text>;
  }

  if (query.isSearching) {
    return <LoadingBar />;
  }

  if (query.isError) {
    return <ErrorMessage message="Não foi possível buscar alimentos agora." />;
  }

  if (foods === undefined) {
    return null;
  }

  if (foods.length === 0) {
    return <Text className="font-body text-sm text-ft-muted-2">Nada encontrado para &quot;{searchText}&quot;.</Text>;
  }

  const resultCountLabel = `${foods.length} resultados`;

  return (
    <View className="gap-2">
      <Text className="font-body-bold text-[10px] uppercase tracking-widest text-ft-muted-2">{resultCountLabel}</Text>
      {foods.map((food) => (
        <FoodRow key={food.id} food={food} isSelected={food.id === selectedFoodId} onPress={onSelectFood} />
      ))}
    </View>
  );
}
