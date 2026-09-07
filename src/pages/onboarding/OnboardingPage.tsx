import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ProfileFieldInput,
  ProfileFormDefaultValues,
  ProfileFormSchema,
  ProfileFormSteps,
  getStepValidationMessage,
  useUpsertProfileMutation,
  type ProfileFormOutput,
  type ProfileFormValues,
} from '@/entities/profile';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';

const StepEntranceDurationMs = 320;

export function OnboardingPage() {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const upsertProfileMutation = useUpsertProfileMutation();

  const {
    control,
    trigger,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues, unknown, ProfileFormOutput>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: ProfileFormDefaultValues,
  });

  const currentStep = ProfileFormSteps[currentStepIndex];
  const isLastStep = currentStepIndex === ProfileFormSteps.length - 1;
  const progressPercent = ((currentStepIndex + 1) / ProfileFormSteps.length) * 100;
  const validationMessage = getStepValidationMessage(currentStep, errors[currentStep.key] !== undefined);

  async function submitProfile(profile: ProfileFormOutput) {
    await upsertProfileMutation.mutateAsync(profile);
    router.replace('/today');
  }

  async function handlePressNext() {
    if (isLastStep) {
      await handleSubmit(submitProfile)();
      return;
    }

    const isCurrentStepValid = await trigger(currentStep.key);
    if (isCurrentStepValid) {
      setCurrentStepIndex((previousIndex) => previousIndex + 1);
    }
  }

  async function handlePressSkip() {
    if (currentStep.kind !== 'number' || !currentStep.optional) {
      return;
    }

    // Casting past the union-of-keys type: every number step's value type accepts `null` while
    // editing (see ProfileFormValues), the schema resolves what "skipped" means per field.
    setValue(currentStep.key, null as never, { shouldValidate: false });
    await handlePressNext();
  }

  function handlePressBack() {
    setCurrentStepIndex((previousIndex) => Math.max(0, previousIndex - 1));
  }

  const isSaving = upsertProfileMutation.isPending;
  const canSkipCurrentStep = currentStep.kind === 'number' && currentStep.optional;

  return (
    <SafeAreaView className="flex-1 bg-ft-bg">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="gap-4 px-7 pt-4">
          <View className="h-1.5 overflow-hidden rounded-full bg-ft-card">
            <View className="h-full rounded-full bg-ft-calories" style={{ width: `${progressPercent}%` }} />
          </View>
          {currentStepIndex > 0 && (
            <Pressable onPress={handlePressBack} hitSlop={12} className="self-start">
              <Text className="font-body-semibold text-xs uppercase tracking-widest text-ft-muted">← Voltar</Text>
            </Pressable>
          )}
        </View>

        <View className="flex-1 justify-center px-7">
          <Animated.View key={currentStepIndex} entering={FadeInDown.duration(StepEntranceDurationMs)} className="gap-2">
            <Text className="font-body-bold text-xs uppercase tracking-widest text-ft-muted">
              Passo {currentStepIndex + 1} de {ProfileFormSteps.length}
            </Text>
            <Text className="font-display text-3xl uppercase leading-tight text-ft-calories">{currentStep.question}</Text>
            <View className="mt-6 gap-2">
              <ProfileFieldInput step={currentStep} control={control} autoFocus onSubmitEditing={handlePressNext} />
              {validationMessage !== null && <Text className="font-body text-xs text-ft-carbs">{validationMessage}</Text>}
            </View>
          </Animated.View>
        </View>

        <View className="gap-3 px-7 pb-8">
          {upsertProfileMutation.isError && <ErrorMessage message="Não foi possível salvar seu perfil. Tente novamente." />}

          <Pressable
            onPress={handlePressNext}
            disabled={isSaving}
            className="h-[58px] items-center justify-center rounded-2xl bg-ft-calories disabled:opacity-40">
            {isSaving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="font-body-bold text-base text-white">{isLastStep ? 'Concluir' : 'Próximo'}</Text>
            )}
          </Pressable>

          {canSkipCurrentStep && !isSaving && (
            <Pressable onPress={handlePressSkip} hitSlop={12} className="items-center">
              <Text className="font-body-semibold text-xs uppercase tracking-widest text-ft-muted">Pular por agora</Text>
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
