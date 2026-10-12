import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getMealTypeLabel, useCreateMealMutation, useMealQuery, useUpdateMealMutation, type MealType } from '@/entities/meal';
import { buildLoggedAt, useSelectedDay } from '@/entities/selected-day';
import { resolveEstimateErrorMessage, useEstimateMealMutation, type MealEstimate } from '@/features/meal-estimate';
import { buildAppendEstimateRequest, getEstimateComposeView, isEstimateReady } from '@/pages/meal-estimate/model/estimate-compose';
import {
  formatAnalyzingMessage,
  parseEstimateSource,
  selectIncludedItems,
  sumEstimatedNutrition,
  toEstimateCaptureRequest,
  toEstimatedItemRequests,
  toggleExcludedItem,
} from '@/pages/meal-estimate/model/estimate-review';
import { DescriptionField } from '@/pages/meal-estimate/ui/DescriptionField';
import { EstimateReview } from '@/pages/meal-estimate/ui/EstimateReview';
import { PhotoPicker } from '@/pages/meal-estimate/ui/PhotoPicker';
import { photoCapture, type PhotoSource } from '@/shared/api/photo-capture';
import { MotionDurationMs } from '@/shared/lib/motion';
import { BackPill } from '@/shared/ui/BackPill';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { LoadingBar } from '@/shared/ui/LoadingBar';

const BackLabel = 'Voltar';
const PermissionDeniedMessage = 'Permita o acesso à câmera e às fotos nas configurações do celular para usar uma foto.';
const SaveErrorMessage = 'Não foi possível salvar essa refeição. Tente novamente.';

const AppearTransition = FadeIn.duration(MotionDurationMs.listEnter);
const DisappearTransition = FadeOut.duration(MotionDurationMs.listExit);
const ReflowTransition = LinearTransition.duration(MotionDurationMs.listReflow);

type EstimateStep = 'compose' | 'review';

/**
 * One screen for both AI options: compose the photo and/or description, wait for the estimate,
 * then review it. Going back from the review to adjust the description keeps the uploaded photo,
 * so a re-run never uploads it again.
 */
export function MealEstimatePage() {
  const router = useRouter();
  const { day } = useSelectedDay();
  const { mealType, mealId, source } = useLocalSearchParams<{ mealType: MealType; mealId?: string; source?: string }>();
  const estimateSource = parseEstimateSource(source);
  const composeView = getEstimateComposeView(estimateSource);

  const [step, setStep] = useState<EstimateStep>('compose');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [captureId, setCaptureId] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [estimate, setEstimate] = useState<MealEstimate | null>(null);
  const [excludedIndexes, setExcludedIndexes] = useState<ReadonlySet<number>>(new Set());
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);

  const estimateMealMutation = useEstimateMealMutation();
  const existingMealQuery = useMealQuery(mealId);
  const createMealMutation = useCreateMealMutation();
  const updateMealMutation = useUpdateMealMutation();

  const isPhotoSource = estimateSource === 'photo';
  const hasPhoto = photoUri !== null;
  const isEstimating = estimateMealMutation.isPending;
  const isSaving = createMealMutation.isPending || updateMealMutation.isPending;
  const canEstimate = isEstimateReady(estimateSource, hasPhoto, description) && !isEstimating;

  async function handlePickPhoto(photoSource: PhotoSource) {
    const result = await photoCapture.capture(photoSource);
    setIsPermissionDenied(result.status === 'permission-denied');
    if (result.status !== 'captured') {
      return;
    }

    setPhotoUri(result.photo.uri);
    setCaptureId(null);
  }

  function handlePressEstimate() {
    estimateMealMutation.mutate({ photoUri, captureId, description }, { onSuccess: handleEstimateReady });
  }

  /** A photo keeps its capture for re-runs; a description alone gets a fresh one on every run. */
  function handleEstimateReady(newEstimate: MealEstimate) {
    setEstimate(newEstimate);
    setExcludedIndexes(new Set());
    if (newEstimate.hasPhoto) {
      setCaptureId(newEstimate.captureId);
    }
    setStep('review');
  }

  function handlePressAdjust() {
    estimateMealMutation.reset();
    setStep('compose');
  }

  function handlePressBack() {
    if (step === 'review') {
      handlePressAdjust();
      return;
    }

    router.back();
  }

  async function handlePressAdd() {
    if (estimate === null) {
      return;
    }

    const includedItems = selectIncludedItems(estimate.items, excludedIndexes);

    if (mealId !== undefined && existingMealQuery.data !== undefined) {
      const request = buildAppendEstimateRequest(existingMealQuery.data, estimate, includedItems);
      await updateMealMutation.mutateAsync({ id: mealId, request });
      router.dismissTo({ pathname: '/meal/[id]', params: { id: mealId } });
      return;
    }

    const createdMeal = await createMealMutation.mutateAsync({
      mealType,
      items: toEstimatedItemRequests(includedItems),
      loggedAt: buildLoggedAt(day, new Date()),
      captures: [toEstimateCaptureRequest(estimate)],
    });
    router.replace({ pathname: '/meal/[id]', params: { id: createdMeal.id } });
  }

  let estimateErrorMessage: string | null = null;
  if (estimateMealMutation.isError) {
    estimateErrorMessage = resolveEstimateErrorMessage(estimateMealMutation.error);
  }

  let includedItemCount = 0;
  let totals = sumEstimatedNutrition([]);
  if (estimate !== null) {
    const includedItems = selectIncludedItems(estimate.items, excludedIndexes);
    includedItemCount = includedItems.length;
    totals = sumEstimatedNutrition(includedItems);
  }

  const analyzingMessage = formatAnalyzingMessage(hasPhoto);
  const addLabel = `Adicionar em ${getMealTypeLabel(mealType)}`;
  const showCompose = step === 'compose' && !isEstimating;
  const showDescription = !isPhotoSource || hasPhoto;
  const showReview = step === 'review' && estimate !== null;
  const isWaitingForExistingMeal = mealId !== undefined && existingMealQuery.isPending;

  return (
    <SafeAreaView className="flex-1 bg-ft-bg">
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <View className="flex-row items-center justify-between px-7 pt-4">
          <BackPill label={BackLabel} onPress={handlePressBack} />
          <Text className="font-body-bold text-xs uppercase tracking-widest text-ft-muted">{getMealTypeLabel(mealType)}</Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-4 px-7 pt-4 pb-4"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {showCompose && (
            <Animated.View entering={AppearTransition} exiting={DisappearTransition} layout={ReflowTransition} className="gap-4">
              <Text className="font-display text-4xl uppercase leading-tight text-ft-ink">{composeView.title}</Text>

              {isPhotoSource && <PhotoPicker photoUri={photoUri} onPickPhoto={handlePickPhoto} />}

              {isPermissionDenied && (
                <Animated.View entering={AppearTransition} exiting={DisappearTransition}>
                  <ErrorMessage message={PermissionDeniedMessage} />
                </Animated.View>
              )}

              {showDescription && (
                <Animated.View entering={AppearTransition} exiting={DisappearTransition} layout={ReflowTransition}>
                  <DescriptionField
                    value={description}
                    placeholder={composeView.descriptionPlaceholder}
                    hint={composeView.descriptionHint}
                    onChangeText={setDescription}
                  />
                </Animated.View>
              )}

              {estimateErrorMessage !== null && (
                <Animated.View entering={AppearTransition} exiting={DisappearTransition}>
                  <ErrorMessage message={estimateErrorMessage} />
                </Animated.View>
              )}
            </Animated.View>
          )}

          {isEstimating && (
            <Animated.View entering={AppearTransition} exiting={DisappearTransition} className="gap-3 pt-12">
              <Text className="font-display text-4xl uppercase text-ft-ink">Calculando…</Text>
              <Text className="font-body-medium text-sm text-ft-muted-2">{analyzingMessage}</Text>
              <LoadingBar />
            </Animated.View>
          )}

          {showReview && estimate !== null && (
            <Animated.View entering={AppearTransition} exiting={DisappearTransition} layout={ReflowTransition} className="gap-4">
              <Text className="font-display text-4xl uppercase text-ft-ink">Estimativa</Text>
              <EstimateReview
                estimate={estimate}
                excludedIndexes={excludedIndexes}
                totals={totals}
                onToggleItem={(index) => setExcludedIndexes((previous) => toggleExcludedItem(previous, index))}
              />
              <Pressable onPress={handlePressAdjust} hitSlop={8} accessibilityRole="button">
                <Text className="font-body-semibold text-sm text-ft-ink">Ajustar descrição e recalcular</Text>
              </Pressable>
            </Animated.View>
          )}
        </ScrollView>

        <View className="gap-3 px-7 pb-3 pt-2">
          {(createMealMutation.isError || updateMealMutation.isError) && (
            <Animated.View entering={AppearTransition} exiting={DisappearTransition}>
              <ErrorMessage message={SaveErrorMessage} />
            </Animated.View>
          )}

          {showCompose && (
            <Animated.View entering={AppearTransition} exiting={DisappearTransition}>
              <Pressable
                onPress={handlePressEstimate}
                disabled={!canEstimate}
                className="h-[54px] items-center justify-center rounded-2xl bg-ft-calories disabled:opacity-40">
                <Text className="font-body-bold text-base text-white">Calcular com IA</Text>
              </Pressable>
            </Animated.View>
          )}

          {showReview && (
            <Animated.View entering={AppearTransition} exiting={DisappearTransition}>
              <Pressable
                onPress={handlePressAdd}
                disabled={includedItemCount === 0 || isSaving || isWaitingForExistingMeal}
                className="h-[54px] items-center justify-center rounded-2xl bg-ft-calories disabled:opacity-40">
                {isSaving && <ActivityIndicator color="white" />}
                {!isSaving && <Text className="font-body-bold text-base text-white">{addLabel}</Text>}
              </Pressable>
            </Animated.View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
