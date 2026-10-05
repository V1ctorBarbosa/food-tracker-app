import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Food } from '@/entities/food';
import { getFoodSourceLabel, getMeasurementUnitLabel, useCreateCustomFoodMutation, useFoodSearchQuery } from '@/entities/food';
import {
  getMealTypeLabel,
  useCreateMealMutation,
  useMealQuery,
  useUpdateMealMutation,
  type MealItemRequest,
  type MealType,
} from '@/entities/meal';
import { buildLoggedAt, useSelectedDay } from '@/entities/selected-day';
import { resolveAddFoodBackLabel } from '@/pages/add-food/model/add-food-back-label';
import { parseCustomFoodFields } from '@/pages/add-food/model/custom-food-form';
import { calculateNutritionForQuantity, type NutritionPreview } from '@/pages/add-food/model/nutrition-preview';
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
  const [customFoodName, setCustomFoodName] = useState('');
  const [customFoodCalories, setCustomFoodCalories] = useState('');
  const [customFoodProtein, setCustomFoodProtein] = useState('');
  const [customFoodCarbs, setCustomFoodCarbs] = useState('');
  const [customFoodFat, setCustomFoodFat] = useState('');

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

  const parsedCustomFood = parseCustomFoodFields({
    name: customFoodName,
    calories: customFoodCalories,
    protein: customFoodProtein,
    carbs: customFoodCarbs,
    fat: customFoodFat,
  });
  const canSaveCustomFood = parsedCustomFood !== null;

  async function handleSaveCustomFood() {
    if (parsedCustomFood === null) {
      return;
    }

    const createdFood = await createCustomFoodMutation.mutateAsync(parsedCustomFood);

    handleSelectFood(createdFood);
    setIsCustomFoodFormVisible(false);
    setCustomFoodName('');
    setCustomFoodCalories('');
    setCustomFoodProtein('');
    setCustomFoodCarbs('');
    setCustomFoodFat('');
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
      router.replace({ pathname: '/meal/[id]', params: { id: mealId } });
      return;
    }

    const createdMeal = await createMealMutation.mutateAsync({
      mealType,
      items: [newItem],
      loggedAt: buildLoggedAt(day, new Date()),
    });
    router.replace({ pathname: '/meal/[id]', params: { id: createdMeal.id } });
  }

  const preview = selectedFood !== null ? calculateNutritionForQuantity(selectedFood, quantityGrams) : null;
  const backLabel = resolveAddFoodBackLabel(isAppendMode);

  return (
    <SafeAreaView className="flex-1 bg-ft-bg">
      <View className="flex-row items-center justify-between px-7 pt-4">
        <BackPill label={backLabel} onPress={() => router.back()} />
        <Text className="font-body-bold text-xs uppercase tracking-widest text-ft-muted">{getMealTypeLabel(mealType)}</Text>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="gap-4 px-7 pt-4 pb-8" showsVerticalScrollIndicator={false}>
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
          <Text className="font-body-semibold text-sm text-ft-ink">
            {isCustomFoodFormVisible ? 'Cancelar alimento personalizado' : 'Adicionar alimento personalizado'}
          </Text>
        </Pressable>

        {isCustomFoodFormVisible && (
          <View className="gap-3 rounded-[22px] bg-ft-card p-5">
            <Text className="font-body-bold text-xs uppercase tracking-widest text-ft-muted-2">Novo alimento (por 100g)</Text>
            <TextInput
              value={customFoodName}
              onChangeText={setCustomFoodName}
              placeholder="Nome"
              placeholderTextColor={colors.textMuted3}
              className="h-[50px] rounded-xl border-0 bg-ft-bg px-4 font-body-medium text-base text-ft-ink outline-none"
            />
            <View className="flex-row gap-2.5">
              <CustomFoodField label="Kcal" value={customFoodCalories} onChangeText={setCustomFoodCalories} />
              <CustomFoodField label="Proteína (g)" value={customFoodProtein} onChangeText={setCustomFoodProtein} />
            </View>
            <View className="flex-row gap-2.5">
              <CustomFoodField label="Carboidrato (g)" value={customFoodCarbs} onChangeText={setCustomFoodCarbs} />
              <CustomFoodField label="Gordura (g)" value={customFoodFat} onChangeText={setCustomFoodFat} />
            </View>
            {createCustomFoodMutation.isError && <ErrorMessage message="Não foi possível salvar esse alimento. Tente novamente." />}
            <Pressable
              onPress={handleSaveCustomFood}
              disabled={!canSaveCustomFood || createCustomFoodMutation.isPending}
              className="h-[50px] items-center justify-center rounded-xl bg-ft-calories disabled:opacity-40">
              {createCustomFoodMutation.isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="font-body-bold text-sm text-white">Salvar</Text>
              )}
            </Pressable>
          </View>
        )}

        <FoodSearchResults
          query={foodSearchQuery}
          searchText={searchText}
          selectedFoodId={selectedFood?.id ?? null}
          onSelectFood={handleSelectFood}
        />

        {selectedFood !== null && preview !== null && (
          <View className="gap-4 rounded-[22px] bg-ft-calories p-5">
            <Text className="font-body-bold text-xs uppercase tracking-widest text-blue-200">Quantidade</Text>
            <View className="flex-row items-center justify-center gap-6">
              <Pressable
                onPress={() => handleAdjustQuantity(-QuantityStepGrams)}
                hitSlop={12}
                className="h-10 w-10 items-center justify-center rounded-full bg-ft-calories-dark">
                <Text className="font-display text-xl text-white">−</Text>
              </Pressable>
              <View className="flex-row items-baseline gap-1.5">
                <TextInput
                  value={String(quantityGrams)}
                  onChangeText={handleChangeQuantityText}
                  keyboardType="numeric"
                  selectTextOnFocus
                  className="w-20 border-0 text-center font-display text-4xl text-white outline-none"
                />
                <Text className="font-body-semibold text-sm text-blue-200">g</Text>
              </View>
              <Pressable
                onPress={() => handleAdjustQuantity(QuantityStepGrams)}
                hitSlop={12}
                className="h-10 w-10 items-center justify-center rounded-full bg-ft-calories-dark">
                <Text className="font-display text-xl text-white">+</Text>
              </Pressable>
            </View>

            <NutritionPreviewChips preview={preview} />
          </View>
        )}

        {saveError && <ErrorMessage message="Não foi possível salvar essa refeição. Tente novamente." />}

        <Pressable
          onPress={handlePressAdd}
          disabled={selectedFood === null || isSaving}
          className="h-[58px] items-center justify-center rounded-2xl bg-ft-calories disabled:opacity-40">
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="font-body-bold text-base text-white">Adicionar em {getMealTypeLabel(mealType)}</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function NutritionPreviewChips({ preview }: { preview: NutritionPreview }) {
  const caloriesLabel = String(preview.calories);
  const proteinLabel = `${Math.round(preview.protein)}g`;
  const carbsLabel = `${Math.round(preview.carbs)}g`;
  const fatLabel = `${Math.round(preview.fat)}g`;

  return (
    <View className="flex-row gap-2">
      <MacroPreviewChip label="Kcal" value={caloriesLabel} className="bg-ft-card" textClassName="text-ft-ink" />
      <MacroPreviewChip label="Prot" value={proteinLabel} className="bg-ft-protein" textClassName="text-white" />
      <MacroPreviewChip label="Carb" value={carbsLabel} className="bg-ft-carbs" textClassName="text-white" />
      <MacroPreviewChip label="Gord" value={fatLabel} className="bg-ft-fat" textClassName="text-ft-ink" />
    </View>
  );
}

function MacroPreviewChip({
  label,
  value,
  className,
  textClassName,
}: {
  label: string;
  value: string;
  className: string;
  textClassName: string;
}) {
  return (
    <View className={`flex-1 items-center gap-1 rounded-xl py-2.5 ${className}`}>
      <Text className={`font-body-bold text-[9px] uppercase tracking-widest opacity-80 ${textClassName}`}>{label}</Text>
      <Text className={`font-body-bold text-sm ${textClassName}`}>{value}</Text>
    </View>
  );
}

function CustomFoodField({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
}) {
  const colors = useThemeColors();

  return (
    <View className="flex-1 gap-1.5">
      <Text className="font-body-semibold text-[10px] uppercase tracking-widest text-ft-muted-2">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType="numeric"
        placeholder="0"
        placeholderTextColor={colors.textMuted3}
        className="h-[46px] rounded-xl border-0 bg-ft-bg px-3 text-center font-body-medium text-base text-ft-ink outline-none"
      />
    </View>
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
      {query.data.map((food) => {
        const isSelected = food.id === selectedFoodId;
        const baseUnitLabel = getMeasurementUnitLabel(food.baseUnitType);
        return (
          <Pressable
            key={food.id}
            onPress={() => onSelectFood(food)}
            className={`flex-row items-center justify-between rounded-2xl px-4 py-3 ${isSelected ? 'bg-ft-calories' : 'bg-ft-card'}`}>
            <View className="flex-1 gap-0.5">
              <View className="flex-row items-center gap-1.5">
                <Text className={`flex-shrink font-body-semibold text-sm ${isSelected ? 'text-white' : 'text-ft-ink'}`}>
                  {food.name}
                </Text>
                <View className={`rounded px-1.5 py-0.5 ${isSelected ? 'bg-ft-calories-dark' : 'bg-ft-bg'}`}>
                  <Text className={`font-body-bold text-[8px] uppercase tracking-wide ${isSelected ? 'text-blue-200' : 'text-ft-muted-2'}`}>
                    {getFoodSourceLabel(food.source)}
                  </Text>
                </View>
              </View>
              <Text className={`font-body text-xs ${isSelected ? 'text-blue-200' : 'text-ft-muted-2'}`}>
                {food.caloriesPerBaseUnit} kcal · {food.proteinPerBaseUnit}P / {food.carbsPerBaseUnit}C / {food.fatPerBaseUnit}G por{' '}
                {food.baseUnitQuantity} {baseUnitLabel}
              </Text>
            </View>
            {isSelected && <Text className="font-body-bold text-base text-white">✓</Text>}
          </Pressable>
        );
      })}
    </View>
  );
}
