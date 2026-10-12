import type { MeasurementUnit } from '@/entities/food';
import type { EstimatedFood } from '@/entities/meal';

export type PhotoUploadSlot = {
  captureId: string;
  uploadUrl: string;
  /** Sent exactly as given with the upload, or the storage rejects it. */
  headers: Record<string, string>;
  expiresAt: string;
};

export type EstimateMealRequest = {
  captureId: string | null;
  description: string | null;
};

/** An item ready to be saved: sent back as a meal item with quantity, unit and estimatedFood unchanged. */
export type EstimatedMealItem = {
  quantity: number;
  unit: MeasurementUnit;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  estimatedFood: EstimatedFood;
};

export type MealEstimate = {
  /** Saved as the meal's capture; a description-only estimate gets a new one from the API. */
  captureId: string;
  hasPhoto: boolean;
  description: string | null;
  items: EstimatedMealItem[];
};

/**
 * What an estimate is asked from. A photo not uploaded yet has no captureId; once it has one (a
 * re-run with an edited description), the same uploaded photo is estimated again.
 */
export type MealEstimateInput = {
  photoUri: string | null;
  captureId: string | null;
  description: string;
};
