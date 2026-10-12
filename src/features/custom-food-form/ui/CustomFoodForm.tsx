import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';

import type { CustomFoodBaseUnit } from '@/entities/food';
import { useThemeColors } from '@/shared/config/theme';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { SelectionChip } from '@/shared/ui/SelectionChip';

import { parseCustomFoodFields, type CustomFoodFormFields, type CustomFoodValues } from '../model/custom-food-form';
import { CustomFoodKindOptions, formatCustomFoodFormTitle } from '../model/custom-food-kind';

/**
 * The name, kind (food per 100 g or drink per 100 ml) and nutrition fields shared by
 * "new custom food" and "edit custom food".
 */
export function CustomFoodForm({
  title,
  initialFields,
  submitLabel,
  isSaving,
  errorMessage,
  onSubmit,
}: {
  title: string;
  initialFields: CustomFoodFormFields;
  submitLabel: string;
  isSaving: boolean;
  errorMessage: string | null;
  onSubmit: (values: CustomFoodValues) => void | Promise<void>;
}) {
  const colors = useThemeColors();
  const [fields, setFields] = useState(initialFields);
  const parsedValues = parseCustomFoodFields(fields);
  const canSubmit = parsedValues !== null && !isSaving;

  const formTitle = formatCustomFoodFormTitle(title, fields.baseUnitType);

  function handleChangeField(fieldName: Exclude<keyof CustomFoodFormFields, 'baseUnitType'>, text: string) {
    setFields((previous) => ({ ...previous, [fieldName]: text }));
  }

  function handleSelectBaseUnit(baseUnitType: CustomFoodBaseUnit) {
    setFields((previous) => ({ ...previous, baseUnitType }));
  }

  function handlePressSubmit() {
    if (parsedValues === null) {
      return;
    }

    void onSubmit(parsedValues);
  }

  return (
    <View className="gap-3 rounded-[22px] bg-ft-card p-5">
      <Text className="font-body-bold text-xs uppercase tracking-widest text-ft-muted-2">{formTitle}</Text>
      <View className="flex-row gap-2" accessibilityRole="radiogroup">
        {CustomFoodKindOptions.map((option) => (
          <SelectionChip
            key={option.baseUnitType}
            label={option.label}
            color={colors.calories}
            isSelected={option.baseUnitType === fields.baseUnitType}
            onPress={() => handleSelectBaseUnit(option.baseUnitType)}
          />
        ))}
      </View>
      <TextInput
        value={fields.name}
        onChangeText={(text) => handleChangeField('name', text)}
        placeholder="Nome"
        placeholderTextColor={colors.textMuted3}
        className="h-[50px] rounded-xl border-0 bg-ft-bg px-4 font-body-medium text-base text-ft-ink outline-none"
      />
      <View className="flex-row gap-2.5">
        <CustomFoodField label="Kcal" value={fields.calories} onChangeText={(text) => handleChangeField('calories', text)} />
        <CustomFoodField label="Proteína (g)" value={fields.protein} onChangeText={(text) => handleChangeField('protein', text)} />
      </View>
      <View className="flex-row gap-2.5">
        <CustomFoodField label="Carboidrato (g)" value={fields.carbs} onChangeText={(text) => handleChangeField('carbs', text)} />
        <CustomFoodField label="Gordura (g)" value={fields.fat} onChangeText={(text) => handleChangeField('fat', text)} />
      </View>
      {errorMessage !== null && <ErrorMessage message={errorMessage} />}
      <Pressable
        onPress={handlePressSubmit}
        disabled={!canSubmit}
        accessibilityRole="button"
        accessibilityState={{ busy: isSaving }}
        className="h-[50px] items-center justify-center rounded-xl bg-ft-calories disabled:opacity-40">
        {isSaving && <ActivityIndicator color="white" />}
        {!isSaving && <Text className="font-body-bold text-sm text-white">{submitLabel}</Text>}
      </Pressable>
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
