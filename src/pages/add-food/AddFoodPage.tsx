import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Food } from '@/entities/food';
import { useCreateCustomFoodMutation, useFoodSearchQuery } from '@/entities/food';
import {
  getMealTypeLabel,
  useCreateMealMutation,
  useMealQuery,
  useUpdateMealMutation,
  type MealItemRequest,
  type MealType,
} from '@/entities/meal';
import { buildLoggedAt, useSelectedDay } from '@/entities/selected-day';
import { CustomFoodForm, EmptyCustomFoodFields, type CustomFoodValues } from '@/features/custom-food-form';
import { resolveAddFoodBackLabel } from '@/pages/add-food/model/add-food-back-label';
import { calculateNutritionForQuantity, type NutritionPreview } from '@/pages/add-food/model/nutrition-preview';
import { isSelectedFoodMissingFromResults } from '@/pages/add-food/model/selected-food-row';
import { FoodRow } from '@/pages/add-food/ui/FoodRow';
import { QuantityPanel } from '@/pages/add-food/ui/QuantityPanel';
import { useThemeColors } from '@/shared/config/theme';
import { parseDecimalInput } from '@/shared/lib/parse-decimal';
import { BackPill } from '@/shared/ui/BackPill';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { LoadingBar } from '@/shared/ui/LoadingBar';

const QuantityStepGrams = 10;
const MinimumQuantityGrams = 1;

export function AddFoodPage() {
  const router = useRouter();
  const colors = useThemeColors();
  const { day } = useSelectedDay();
  const { mealType, mealId } = useLocalSearchParams<{ mealType: MealType; mealId?: string }>();
  const [searchText, setSearchText] = useState('');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantityGrams, setQuantityGrams] = useState(100);
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
    setQuantityGrams(food.baseUnitQuantity);
  }

  function handleAdjustQuantity(deltaGrams: number) {
    setQuantityGrams((previousQuantity) => Math.max(MinimumQuantityGrams, previousQuantity + deltaGrams));
  }

  function handleChangeQuantityText(text: string) {
    const parsedQuantity = parseDecimalInput(text);
    if (parsedQuantity === null) {
      return;
    }

    setQuantityGrams(Math.max(MinimumQuantityGrams, parsedQuantity));
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
      quantity: quantityGrams,
      unit: 'Gram',
      foodServingId: null,
      servingCount: null,
    };

    if (isAppendMode && mealId !== undefined && existingMealQuery.data !== undefined) {
      const existingItems: MealItemRequest[] = existingMealQuery.data.items.map((item) => ({
        foodId: item.foodId,
        quantity: item.quantity,
        unit: item.unit,
        foodServingId: null,
        servingCount: null,
      }));

      await updateMealMutation.mutateAsync({
        id: mealId,
        request: { mealType: existingMealQuery.data.mealType, items: [...existingItems, newItem] },
      });
      // The meal's detail screen is already open underneath: going back reuses it (its query was
      // just invalidated) instead of stacking another copy of it for every item added.
      router.back();
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
    preview = calculateNutritionForQuantity(selectedFood, quantityGrams);
  }

  const showSelectedFoodRow = isSelectedFoodMissingFromResults(selectedFood, foodSearchQuery.data);

  let customFoodToggleLabel = 'Adicionar alimento personalizado';
  if (isCustomFoodFormVisible) {
    customFoodToggleLabel = 'Cancelar alimento personalizado';
  }

  const backLabel = resolveAddFoodBackLabel(isAppendMode);

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
          <Text className="font-display text-4xl uppercase text-ft-ink">Adicionar alimento</Text>

          <TextInput
            autoFocus
            value={searchText}
            onChangeText={handleChangeSearchText}
            placeholder="Buscar alimentos..."
            placeholderTextColor={colors.textMuted3}
            className="h-[54px] rounded-2xl border-0 bg-ft-card px-5 font-body-medium text-base text-ft-ink outline-none"
          />

          <Pressable onPress={() => setIsCustomFoodFormVisible((previous) => !previous)} hitSlop={8}>
            <Text className="font-body-semibold text-sm text-ft-ink">{customFoodToggleLabel}</Text>
          </Pressable>

          {isCustomFoodFormVisible && (
            <CustomFoodForm
              title="Novo alimento (por 100g)"
              initialFields={EmptyCustomFoodFields}
              submitLabel="Salvar"
              isSaving={createCustomFoodMutation.isPending}
              errorMessage={customFoodErrorMessage}
              onSubmit={handleSaveCustomFood}
            />
          )}

          {selectedFood !== null && showSelectedFoodRow && (
            <View className="gap-2">
              <Text className="font-body-bold text-[10px] uppercase tracking-widest text-ft-muted-2">Alimento selecionado</Text>
              <FoodRow food={selectedFood} isSelected onPress={handleSelectFood} />
            </View>
          )}

          <FoodSearchResults
            query={foodSearchQuery}
            searchText={searchText}
            selectedFoodId={selectedFood?.id ?? null}
            onSelectFood={handleSelectFood}
          />
        </ScrollView>

        <View className="gap-3 px-7 pb-3 pt-2">
          {selectedFood !== null && preview !== null && (
            <QuantityPanel
              quantityGrams={quantityGrams}
              preview={preview}
              stepGrams={QuantityStepGrams}
              onAdjustQuantity={handleAdjustQuantity}
              onChangeQuantityText={handleChangeQuantityText}
            />
          )}

          {saveError && <ErrorMessage message="Não foi possível salvar essa refeição. Tente novamente." />}

          <Pressable
            onPress={handlePressAdd}
            disabled={selectedFood === null || isSaving}
            className="h-[54px] items-center justify-center rounded-2xl bg-ft-calories disabled:opacity-40">
            {isSaving && <ActivityIndicator color="white" />}
            {!isSaving && <Text className="font-body-bold text-base text-white">Adicionar em {getMealTypeLabel(mealType)}</Text>}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function FoodSearchResults({
  query,
  searchText,
  selectedFoodId,
  onSelectFood,
}: {
  query: ReturnType<typeof useFoodSearchQuery>;
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

  if (query.data === undefined) {
    return null;
  }

  if (query.data.length === 0) {
    return <Text className="font-body text-sm text-ft-muted-2">Nenhum alimento encontrado para "{searchText}".</Text>;
  }

  return (
    <View className="gap-2">
      <Text className="font-body-bold text-[10px] uppercase tracking-widest text-ft-muted-2">{query.data.length} resultados</Text>
      {query.data.map((food) => (
        <FoodRow key={food.id} food={food} isSelected={food.id === selectedFoodId} onPress={onSelectFood} />
      ))}
    </View>
  );
}
