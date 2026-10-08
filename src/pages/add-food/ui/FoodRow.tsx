import { Pressable, Text, View } from 'react-native';

import type { Food } from '@/entities/food';
import { getFoodSourceLabel, getMeasurementUnitLabel } from '@/entities/food';
import { resolveFoodRowStyle } from '@/pages/add-food/model/food-row-style';

/** One food in the search results, or the food just chosen: name, where it comes from and its macros per base unit. */
export function FoodRow({ food, isSelected, onPress }: { food: Food; isSelected: boolean; onPress: (food: Food) => void }) {
  const style = resolveFoodRowStyle(isSelected);
  const baseUnitLabel = getMeasurementUnitLabel(food.baseUnitType);

  return (
    <Pressable
      onPress={() => onPress(food)}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      className={`flex-row items-center justify-between rounded-2xl px-4 py-3 ${style.containerClassName}`}>
      <View className="flex-1 gap-0.5">
        <View className="flex-row items-center gap-1.5">
          <Text className={`flex-shrink font-body-semibold text-sm ${style.nameClassName}`}>{food.name}</Text>
          <View className={`rounded px-1.5 py-0.5 ${style.tagClassName}`}>
            <Text className={`font-body-bold text-[8px] uppercase tracking-wide ${style.tagTextClassName}`}>
              {getFoodSourceLabel(food.source)}
            </Text>
          </View>
        </View>
        <Text className={`font-body text-xs ${style.detailClassName}`}>
          {food.caloriesPerBaseUnit} kcal · {food.proteinPerBaseUnit}P / {food.carbsPerBaseUnit}C / {food.fatPerBaseUnit}G por{' '}
          {food.baseUnitQuantity} {baseUnitLabel}
        </Text>
      </View>
      {isSelected && <Text className="font-body-bold text-base text-white">✓</Text>}
    </Pressable>
  );
}
