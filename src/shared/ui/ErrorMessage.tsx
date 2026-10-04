import { Text, View } from 'react-native';

import { brandStripeColors } from '@/shared/config/theme';

const DefaultErrorMessage = 'Não foi possível buscar os dados';
const DimOpacity = 0.35;

export function ErrorMessage({ message = DefaultErrorMessage }: { message?: string }) {
  return (
    <View className="items-center gap-3">
      <View className="h-3 w-40 flex-row gap-1 self-center overflow-hidden rounded-full">
        {brandStripeColors.map((color) => (
          <View key={color} className="rounded-full" style={{ flex: 1, backgroundColor: color, opacity: DimOpacity }} />
        ))}
      </View>
      <Text className="text-center font-body-semibold text-sm text-ft-carbs-ink">{message}</Text>
    </View>
  );
}
