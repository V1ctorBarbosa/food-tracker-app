import { Pressable, Text, TextInput, View } from 'react-native';

import { formatNutritionPreviewLabels } from '@/pages/add-food/model/nutrition-preview-labels';
import type { NutritionPreview } from '@/pages/add-food/model/nutrition-preview';

/**
 * The quantity stepper and live nutrition preview for the selected food. It is rendered outside the
 * page's scroll area so it stays in view, right above the keyboard, while the amount is being typed.
 */
export function QuantityPanel({
  quantityGrams,
  preview,
  onAdjustQuantity,
  onChangeQuantityText,
  stepGrams,
}: {
  quantityGrams: number;
  preview: NutritionPreview;
  onAdjustQuantity: (deltaGrams: number) => void;
  onChangeQuantityText: (text: string) => void;
  stepGrams: number;
}) {
  return (
    <View className="gap-3 rounded-[22px] bg-ft-calories p-4">
      <View className="flex-row items-center justify-between">
        <Text className="font-body-bold text-xs uppercase tracking-widest text-blue-200">Quantidade</Text>
        <View className="flex-row items-center gap-5">
          <Pressable
            onPress={() => onAdjustQuantity(-stepGrams)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Diminuir quantidade"
            className="h-10 w-10 items-center justify-center rounded-full bg-ft-calories-dark">
            <Text className="font-display text-xl text-white">−</Text>
          </Pressable>
          <View className="flex-row items-baseline gap-1.5">
            <TextInput
              value={String(quantityGrams)}
              onChangeText={onChangeQuantityText}
              keyboardType="numeric"
              selectTextOnFocus
              className="w-20 border-0 text-center font-display text-4xl text-white outline-none"
            />
            <Text className="font-body-semibold text-sm text-blue-200">g</Text>
          </View>
          <Pressable
            onPress={() => onAdjustQuantity(stepGrams)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Aumentar quantidade"
            className="h-10 w-10 items-center justify-center rounded-full bg-ft-calories-dark">
            <Text className="font-display text-xl text-white">+</Text>
          </Pressable>
        </View>
      </View>

      <NutritionPreviewChips preview={preview} />
    </View>
  );
}

function NutritionPreviewChips({ preview }: { preview: NutritionPreview }) {
  const labels = formatNutritionPreviewLabels(preview);

  return (
    <View className="flex-row gap-2">
      <MacroPreviewChip label="Kcal" value={labels.calories} className="bg-ft-card" textClassName="text-ft-ink" />
      <MacroPreviewChip label="Prot" value={labels.protein} className="bg-ft-protein" textClassName="text-white" />
      <MacroPreviewChip label="Carb" value={labels.carbs} className="bg-ft-carbs" textClassName="text-white" />
      <MacroPreviewChip label="Gord" value={labels.fat} className="bg-ft-fat" textClassName="text-ft-ink" />
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
    <View className={`flex-1 items-center gap-1 rounded-xl py-2 ${className}`}>
      <Text className={`font-body-bold text-[9px] uppercase tracking-widest opacity-80 ${textClassName}`}>{label}</Text>
      <Text className={`font-body-bold text-sm ${textClassName}`}>{value}</Text>
    </View>
  );
}
