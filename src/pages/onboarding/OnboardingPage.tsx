import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm, type Control } from 'react-hook-form';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useUpsertProfileMutation } from '@/entities/profile';
import {
  OnboardingDefaultValues,
  OnboardingFormSchema,
  OnboardingSteps,
  getStepValidationMessage,
  parseDisplayValue,
  type OnboardingFormOutput,
  type OnboardingFormValues,
  type OnboardingStep,
} from '@/pages/onboarding/model/onboarding-form-schema';
import { theme } from '@/shared/config/theme';
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
  } = useForm<OnboardingFormValues, unknown, OnboardingFormOutput>({
    resolver: zodResolver(OnboardingFormSchema),
    defaultValues: OnboardingDefaultValues,
  });

  const currentStep = OnboardingSteps[currentStepIndex];
  const isLastStep = currentStepIndex === OnboardingSteps.length - 1;
  const progressPercent = ((currentStepIndex + 1) / OnboardingSteps.length) * 100;
  const validationMessage = getStepValidationMessage(currentStep, errors[currentStep.key] !== undefined);

  async function submitProfile(profile: OnboardingFormOutput) {
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
    // editing (see OnboardingFormValues), the schema resolves what "skipped" means per field.
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
              Passo {currentStepIndex + 1} de {OnboardingSteps.length}
            </Text>
            <Text className="font-display text-3xl uppercase leading-tight text-ft-calories">{currentStep.question}</Text>
            <View className="mt-6 gap-2">
              <StepInput step={currentStep} control={control} onSubmitEditing={handlePressNext} />
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

function StepInput({
  step,
  control,
  onSubmitEditing,
}: {
  step: OnboardingStep;
  control: Control<OnboardingFormValues>;
  onSubmitEditing: () => void;
}) {
  if (step.kind === 'text') {
    return (
      <Controller
        control={control}
        name={step.key}
        render={({ field }) => (
          <TextInput
            autoFocus
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
              autoFocus
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
