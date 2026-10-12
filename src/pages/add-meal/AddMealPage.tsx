import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getMealTypeLabel, type MealType } from '@/entities/meal';
import { useProfileQuery } from '@/entities/profile';
import { buildAddMealDestination } from '@/pages/add-meal/model/add-meal-destination';
import { buildAddMealOptions, resolveAddMealFootnote, type AddMealOption } from '@/pages/add-meal/model/add-meal-options';
import { resolveAddMealBackLabel } from '@/pages/add-meal/model/add-meal-back-label';
import { MotionDurationMs } from '@/shared/lib/motion';
import { BackPill } from '@/shared/ui/BackPill';
import { PressableScale } from '@/shared/ui/PressableScale';

const AppearTransition = FadeIn.duration(MotionDurationMs.listEnter);
const DisappearTransition = FadeOut.duration(MotionDurationMs.listExit);
const ReflowTransition = LinearTransition.duration(MotionDurationMs.listReflow);

export function AddMealPage() {
  const router = useRouter();
  const { mealType, mealId } = useLocalSearchParams<{ mealType: MealType; mealId?: string }>();
  const profileQuery = useProfileQuery();

  const canEstimateMeals = profileQuery.data?.canEstimateMeals ?? false;
  const options = buildAddMealOptions(canEstimateMeals);
  const footnote = resolveAddMealFootnote(canEstimateMeals);
  const backLabel = resolveAddMealBackLabel(mealId !== undefined);

  function handlePressOption(option: AddMealOption) {
    router.push(buildAddMealDestination(option.id, mealType, mealId));
  }

  return (
    <SafeAreaView className="flex-1 bg-ft-bg">
      <View className="flex-row items-center justify-between px-7 pt-4">
        <BackPill label={backLabel} onPress={() => router.back()} />
        <Text className="font-body-bold text-xs uppercase tracking-widest text-ft-muted">{getMealTypeLabel(mealType)}</Text>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="gap-4 px-7 pt-4 pb-8" showsVerticalScrollIndicator={false}>
        <Text className="font-display text-4xl uppercase leading-tight text-ft-ink">Como quer registrar?</Text>

        <View className="gap-3">
          {options.map((option) => (
            <Animated.View key={option.id} entering={AppearTransition} exiting={DisappearTransition} layout={ReflowTransition}>
              <AddMealOptionCard option={option} onPress={() => handlePressOption(option)} />
            </Animated.View>
          ))}
        </View>

        {footnote !== null && (
          <Animated.Text
            entering={AppearTransition}
            exiting={DisappearTransition}
            className="font-body-medium text-xs leading-5 text-ft-muted-2">
            {footnote}
          </Animated.Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function AddMealOptionCard({ option, onPress }: { option: AddMealOption; onPress: () => void }) {
  return (
    <PressableScale onPress={onPress} accessibilityLabel={option.label} className={`gap-1 rounded-[22px] p-5 ${option.cardClassName}`}>
      <View className="flex-row items-center justify-between">
        <Text className={`font-body-bold text-[10px] uppercase tracking-widest opacity-80 ${option.textClassName}`}>{option.kicker}</Text>
        {option.isEstimatedByAi && (
          <View className="rounded-full bg-white/25 px-2.5 py-0.5">
            <Text className={`font-body-bold text-[10px] uppercase tracking-widest ${option.textClassName}`}>IA</Text>
          </View>
        )}
      </View>
      <Text className={`font-display text-2xl uppercase ${option.textClassName}`}>{option.label}</Text>
      <Text className={`font-body-medium text-sm opacity-90 ${option.textClassName}`}>{option.description}</Text>
    </PressableScale>
  );
}
