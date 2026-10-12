import { Text, TextInput, View } from 'react-native';

import { formatDescriptionCounter, MaximumDescriptionLength } from '@/features/meal-estimate';
import { useThemeColors } from '@/shared/config/theme';

export function DescriptionField({
  value,
  placeholder,
  hint,
  onChangeText,
}: {
  value: string;
  placeholder: string;
  hint: string;
  onChangeText: (text: string) => void;
}) {
  const colors = useThemeColors();
  const counterLabel = formatDescriptionCounter(value);

  return (
    <View className="gap-2">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted3}
        maxLength={MaximumDescriptionLength}
        multiline
        textAlignVertical="top"
        className="min-h-[120px] rounded-2xl border-0 bg-ft-card px-5 py-4 font-body-medium text-base text-ft-ink outline-none"
      />
      <View className="flex-row justify-between gap-3">
        <Text className="flex-1 font-body-medium text-xs leading-5 text-ft-muted-2">{hint}</Text>
        <Text className="font-body-semibold text-xs text-ft-muted-2">{counterLabel}</Text>
      </View>
    </View>
  );
}
