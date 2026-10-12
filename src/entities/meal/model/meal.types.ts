import type { CustomFoodBaseUnit, MeasurementUnit } from '@/entities/food';

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

/**
 * A food the AI recognized, carried by the item itself instead of a catalog food. Nutrition is per
 * 100 of baseUnit, so the item's quantity can change and be recalculated like a catalog item.
 */
export type EstimatedFood = {
  name: string;
  captureId: string;
  baseUnit: CustomFoodBaseUnit;
  caloriesPerBaseUnit: number;
  proteinPerBaseUnit: number;
  carbsPerBaseUnit: number;
  fatPerBaseUnit: number;
};

/** Exactly one of foodId (a catalog item) or estimatedFood (an AI-estimated item) is set. */
export type MealItem = {
  id: string;
  foodId: string | null;
  quantity: number;
  unit: MeasurementUnit;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  estimatedFood: EstimatedFood | null;
};

/** What one AI estimate was made from. photoUrl is short-lived: it expires about an hour after the meal is read. */
export type MealCapture = {
  id: string;
  hasPhoto: boolean;
  description: string | null;
  photoUrl: string | null;
};

export type Meal = {
  id: string;
  loggedAt: string;
  mealType: MealType;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  items: MealItem[];
  captures: MealCapture[];
};

/** A meal as listed for a day: its totals, without the items (those come from the single-meal endpoint). */
export type MealSummary = Omit<Meal, 'items' | 'captures'>;

/** Send exactly one of foodId or estimatedFood. */
export type MealItemRequest = {
  foodId: string | null;
  quantity: number;
  unit: MeasurementUnit;
  estimatedFood?: EstimatedFood | null;
};

export type MealCaptureRequest = {
  id: string;
  hasPhoto: boolean;
  description: string | null;
};

export type CreateMealRequest = {
  mealType: MealType;
  items: MealItemRequest[];
  /** When the meal was eaten; omitted means now. Lets a forgotten day be filled in later. */
  loggedAt?: string;
  /** The estimates the meal's AI items came from. */
  captures?: MealCaptureRequest[];
};

/** Omitting captures keeps the ones the meal already has; sending them replaces the list. */
export type UpdateMealRequest = {
  mealType: MealType;
  items: MealItemRequest[];
  captures?: MealCaptureRequest[];
};
