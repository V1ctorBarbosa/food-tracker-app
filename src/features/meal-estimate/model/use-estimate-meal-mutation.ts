import { useMutation } from '@tanstack/react-query';

import { postJson } from '@/shared/api/http-client';
import { uploadFileToSignedUrl } from '@/shared/api/signed-upload';

import { estimateMeal, type EstimateMealDependencies } from './estimate-meal';
import type { EstimateMealRequest, MealEstimate, MealEstimateInput, PhotoUploadSlot } from './meal-estimate.types';

const UploadSlotsPath = '/meal-estimates/upload-slots';
const EstimatesPath = '/meal-estimates';

const ApiDependencies: EstimateMealDependencies = {
  createUploadSlot: () => postJson<Record<string, never>, PhotoUploadSlot>(UploadSlotsPath, {}),
  uploadPhoto: (slot, photoUri) => uploadFileToSignedUrl(slot.uploadUrl, slot.headers, photoUri),
  requestEstimate: (request) => postJson<EstimateMealRequest, MealEstimate>(EstimatesPath, request),
};

/** Nothing is cached or invalidated: an estimate saves nothing until its items are added to a meal. */
export function useEstimateMealMutation() {
  return useMutation({
    mutationFn: (input: MealEstimateInput) => estimateMeal(input, ApiDependencies),
  });
}
