import { toDescriptionRequest } from './description-rules';
import type { EstimateMealRequest, MealEstimate, MealEstimateInput, PhotoUploadSlot } from './meal-estimate.types';

export type EstimateMealDependencies = {
  createUploadSlot: () => Promise<PhotoUploadSlot>;
  uploadPhoto: (slot: PhotoUploadSlot, photoUri: string) => Promise<void>;
  requestEstimate: (request: EstimateMealRequest) => Promise<MealEstimate>;
};

/**
 * Runs one estimate. A new photo is uploaded first, through its own upload slot; a photo that
 * already has a capture (a re-run) is not uploaded again; a description alone needs no upload.
 */
export async function estimateMeal(input: MealEstimateInput, dependencies: EstimateMealDependencies): Promise<MealEstimate> {
  const description = toDescriptionRequest(input.description);
  const captureId = await resolveCaptureId(input, dependencies);

  return dependencies.requestEstimate({ captureId, description });
}

async function resolveCaptureId(input: MealEstimateInput, dependencies: EstimateMealDependencies): Promise<string | null> {
  if (input.captureId !== null) {
    return input.captureId;
  }

  if (input.photoUri === null) {
    return null;
  }

  const slot = await dependencies.createUploadSlot();
  await dependencies.uploadPhoto(slot, input.photoUri);
  return slot.captureId;
}
