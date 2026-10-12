import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition, useAnimatedStyle, useReducedMotion, withTiming } from 'react-native-reanimated';

import { getMeasurementUnitLabel } from '@/entities/food';
import type { EstimatedMealItem, MealEstimate } from '@/features/meal-estimate';
import { MotionDurationMs, resolveMotionDuration } from '@/shared/lib/motion';
import { formatNutritionPreviewLabels, type NutritionPreview } from '@/shared/lib/nutrition-preview-labels';
import { MotionEasing } from '@/shared/ui/motion-easing';

import { formatEstimatedItemSummary, formatEstimateSourceLabel } from '../model/estimate-review';

const AppearTransition = FadeIn.duration(MotionDurationMs.listEnter);
const DisappearTransition = FadeOut.duration(MotionDurationMs.listExit);
const ReflowTransition = LinearTransition.duration(MotionDurationMs.listReflow);

const IncludedItemOpacity = 1;
const ExcludedItemOpacity = 0.4;

export function EstimateReview({
  estimate,
  excludedIndexes,
  totals,
  onToggleItem,
}: {
  estimate: MealEstimate;
  excludedIndexes: ReadonlySet<number>;
  totals: NutritionPreview;
  onToggleItem: (index: number) => void;
}) {
  const sourceLabel = formatEstimateSourceLabel(estimate.hasPhoto);
  const totalLabels = formatNutritionPreviewLabels(totals);

  return (
    <View className="gap-4">
      <View className="gap-2 rounded-[22px] bg-ft-calories p-5">
        <View className="flex-row items-center justify-between">
          <Text className="font-body-bold text-xs uppercase tracking-widest text-blue-200">Total</Text>
          <Text className="font-body-bold text-xs uppercase tracking-widest text-blue-200">{sourceLabel}</Text>
        </View>
        <View className="flex-row items-baseline gap-2">
          <Text className="font-display text-5xl text-white">{totalLabels.calories}</Text>
          <Text className="font-body-semibold text-base text-blue-200">kcal</Text>
        </View>
        <View className="flex-row gap-4">
          <Text className="font-body-bold text-xs text-white">Prot {totalLabels.protein}</Text>
          <Text className="font-body-bold text-xs text-white">Carb {totalLabels.carbs}</Text>
          <Text className="font-body-bold text-xs text-white">Gord {totalLabels.fat}</Text>
        </View>
      </View>

      <Text className="font-body-bold text-[10px] uppercase tracking-widest text-ft-muted-2">Toque para incluir ou tirar</Text>

      <View className="gap-2.5">
        {estimate.items.map((item, index) => (
          <Animated.View
            key={`${estimate.captureId}-${index}`}
            entering={AppearTransition}
            exiting={DisappearTransition}
            layout={ReflowTransition}>
            <EstimatedItemRow item={item} isIncluded={!excludedIndexes.has(index)} onPress={() => onToggleItem(index)} />
          </Animated.View>
        ))}
      </View>

      <Text className="font-body-medium text-xs leading-5 text-ft-muted-2">
        Valores estimados pela IA. Você pode ajustar cada item depois, na refeição.
      </Text>
    </View>
  );
}

function EstimatedItemRow({ item, isIncluded, onPress }: { item: EstimatedMealItem; isIncluded: boolean; onPress: () => void }) {
  const reduceMotion = useReducedMotion();
  const summary = formatEstimatedItemSummary(item, getMeasurementUnitLabel(item.unit));
  const toggleDuration = resolveMotionDuration(MotionDurationMs.chip, reduceMotion);

  let targetOpacity = ExcludedItemOpacity;
  let markLabel = '+';
  if (isIncluded) {
    targetOpacity = IncludedItemOpacity;
    markLabel = '✓';
  }

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(targetOpacity, { duration: toggleDuration, easing: MotionEasing }),
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isIncluded }}
        className="flex-row items-center justify-between rounded-2xl bg-ft-card px-4 py-3">
        <View className="flex-1 gap-0.5">
          <Text className="font-body-semibold text-sm text-ft-ink">{item.estimatedFood.name}</Text>
          <Text className="font-body text-xs text-ft-muted-2">{summary}</Text>
        </View>
        <Text className="ml-3 font-body-bold text-base text-ft-ink">{markLabel}</Text>
      </Pressable>
    </Animated.View>
  );
}
