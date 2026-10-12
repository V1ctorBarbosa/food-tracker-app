import { toMealCaptureRequest, toMealItemRequest, type Meal, type UpdateMealRequest } from '@/entities/meal';
import { canRequestEstimate, type EstimatedMealItem, type MealEstimate } from '@/features/meal-estimate';

import { toEstimateCaptureRequest, toEstimatedItemRequests, type EstimateSource } from './estimate-review';

export type EstimateComposeView = {
  title: string;
  descriptionPlaceholder: string;
  descriptionHint: string;
};

const ComposeViews: Record<EstimateSource, EstimateComposeView> = {
  photo: {
    title: 'Foto do prato',
    descriptionPlaceholder: 'Algo que a foto não mostra? (opcional)',
    descriptionHint: 'Preparo, ingrediente escondido ou quantidade. Quando a descrição e a foto discordam, vale a descrição.',
  },
  description: {
    title: 'Descreva a refeição',
    descriptionPlaceholder: 'Ex.: 200 g de arroz integral e um peito de frango grelhado',
    descriptionHint: 'Quanto mais detalhe (quantidade, preparo, marca), melhor a estimativa.',
  },
};

export function getEstimateComposeView(source: EstimateSource): EstimateComposeView {
  return ComposeViews[source];
}

/** "Calcular com IA" is enabled once the photo option has its photo and the description fits the rules. */
export function isEstimateReady(source: EstimateSource, hasPhoto: boolean, description: string): boolean {
  if (source === 'photo' && !hasPhoto) {
    return false;
  }

  return canRequestEstimate(hasPhoto, description);
}

/**
 * Adds the reviewed items to a meal that already exists. Its own items and captures go back
 * unchanged, since an update replaces them all; the estimate's capture joins them.
 */
export function buildAppendEstimateRequest(
  existingMeal: Meal,
  estimate: MealEstimate,
  includedItems: readonly EstimatedMealItem[],
): UpdateMealRequest {
  return {
    mealType: existingMeal.mealType,
    items: [...existingMeal.items.map(toMealItemRequest), ...toEstimatedItemRequests(includedItems)],
    captures: [...existingMeal.captures.map(toMealCaptureRequest), toEstimateCaptureRequest(estimate)],
  };
}
