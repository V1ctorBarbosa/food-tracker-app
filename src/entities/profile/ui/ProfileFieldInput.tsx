import { Controller, type Control } from 'react-hook-form';
import { Pressable, Text, TextInput, View } from 'react-native';

import type { ProfileFormStep, ProfileFormValues } from '@/entities/profile/model/profile-form-schema';
import { parseDisplayValue } from '@/entities/profile/model/profile-form-schema';
import { theme } from '@/shared/config/theme';

/** Renders the text/select/number input for one profile field, wired to a shared react-hook-form control. */
export function ProfileFieldInput({
  step,
  control,
  autoFocus = false,
  onSubmitEditing,
}: {
  step: ProfileFormStep;
  control: Control<ProfileFormValues>;
  /** Focuses the input as soon as it renders -- useful for a one-field-at-a-time wizard, not a multi-field form. */
  autoFocus?: boolean;
  onSubmitEditing: () => void;
}) {
  if (step.kind === 'text') {
    return (
      <Controller
        control={control}
        name={step.key}
        render={({ field }) => (
          <TextInput
            autoFocus={autoFocus}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            placeholder={step.placeholder}
            placeholderTextColor={theme.light.textMuted3}
            onSubmitEditing={onSubmitEditing}
            returnKeyType="next"
            className="h-[58px] rounded-2xl border-0 bg-ft-card px-5 font-body-medium text-lg text-ft-calories outline-none"
          />
        )}
      />
    );
  }

  if (step.kind === 'select') {
    return (
      <Controller
        control={control}
        name={step.key}
        render={({ field }) => (
          <View className="gap-2.5">
            {step.options.map((option) => {
              const isSelected = field.value === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => field.onChange(option.value)}
                  className={`h-[54px] justify-center rounded-2xl px-5 ${isSelected ? 'bg-ft-calories' : 'bg-ft-card'}`}>
                  <Text className={`font-body-semibold text-base ${isSelected ? 'text-white' : 'text-ft-calories'}`}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      />
    );
  }

  return (
    <Controller
      control={control}
      name={step.key}
      render={({ field }) => (
        <View className="gap-2">
          <View className="h-[58px] flex-row items-center rounded-2xl bg-ft-card px-5">
            <TextInput
              autoFocus={autoFocus}
              value={field.value === null ? '' : String(field.value / step.unitScale)}
              onChangeText={(text) => field.onChange(parseDisplayValue(text, step.unitScale))}
              onBlur={field.onBlur}
              placeholderTextColor={theme.light.textMuted3}
              keyboardType="numeric"
              onSubmitEditing={onSubmitEditing}
              returnKeyType="next"
              className="flex-1 border-0 font-body-medium text-lg text-ft-calories outline-none"
            />
            <Text className="font-body-semibold text-sm text-ft-muted-2">{step.unitLabel}</Text>
          </View>
          {step.helperText !== null && <Text className="font-body text-xs text-ft-muted-2">{step.helperText}</Text>}
        </View>
      )}
    />
  );
}
