import type { MeasurementUnit } from '@/entities/food';

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export type MealItem = {
  id: string;
  foodId: string;
  quantity: number;
  unit: MeasurementUnit;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
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
};

export type MealItemRequest = {
  foodId: string;
  quantity: number | null;
  unit: MeasurementUnit | null;
  foodServingId: string | null;
  servingCount: number | null;
};

export type CreateMealRequest = {
  mealType: MealType;
  items: MealItemRequest[];
  /** When the meal was eaten; omitted means now. Lets a forgotten day be filled in later. */
  loggedAt?: string;
};

export type UpdateMealRequest = {
  mealType: MealType;
  items: MealItemRequest[];
};
