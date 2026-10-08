import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatCustomFoodSummary, useCustomFoodsQuery } from '@/entities/food';
import { MotionDurationMs } from '@/shared/lib/motion';
import { BackPill } from '@/shared/ui/BackPill';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { LoadingBar } from '@/shared/ui/LoadingBar';
import { PressableScale } from '@/shared/ui/PressableScale';

const BackLabel = 'Você';
const EmptyListMessage = 'Você ainda não criou nenhum alimento. Crie um em "Adicionar alimento personalizado" ao registrar uma refeição.';

export function CustomFoodsPage() {
  const router = useRouter();
  const customFoodsQuery = useCustomFoodsQuery();

  if (customFoodsQuery.isPending) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-ft-bg">
        <LoadingBar />
      </SafeAreaView>
    );
  }

  if (customFoodsQuery.isError) {
    return (
      <SafeAreaView className="flex-1 bg-ft-bg">
        <View className="flex-row px-7 pt-4">
          <BackPill label={BackLabel} onPress={() => router.back()} />
        </View>
        <View className="flex-1 items-center justify-center px-7">
          <ErrorMessage />
        </View>
      </SafeAreaView>
    );
  }

  const customFoods = customFoodsQuery.data;

  return (
    <SafeAreaView className="flex-1 bg-ft-bg">
      <View className="flex-row px-7 pt-4">
        <BackPill label={BackLabel} onPress={() => router.back()} />
      </View>

      <ScrollView className="flex-1" contentContainerClassName="gap-4 px-7 pt-4 pb-8" showsVerticalScrollIndicator={false}>
        <View className="gap-1">
          <Text className="font-display text-4xl uppercase text-ft-ink">Meus alimentos</Text>
          <Text className="font-body text-sm text-ft-muted-2">Valores por 100 g. Toque em um alimento para editar.</Text>
        </View>

        {customFoods.length === 0 && <Text className="font-body text-sm text-ft-muted-2">{EmptyListMessage}</Text>}

        <View className="gap-2.5">
          {customFoods.map((food) => (
            <Animated.View
              key={food.id}
              entering={FadeIn.duration(MotionDurationMs.listEnter)}
              layout={LinearTransition.duration(MotionDurationMs.listReflow)}>
              <PressableScale
                onPress={() => router.push({ pathname: '/edit-custom-food', params: { id: food.id } })}
                accessibilityLabel={`Editar ${food.name}`}
                className="gap-1 rounded-[18px] bg-ft-card px-4 py-3.5">
                <Text className="font-body-semibold text-sm text-ft-ink">{food.name}</Text>
                <Text className="font-body text-xs text-ft-muted-2">{formatCustomFoodSummary(food)}</Text>
              </PressableScale>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
