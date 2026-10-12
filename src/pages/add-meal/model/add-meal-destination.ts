import type { MealType } from '@/entities/meal';

import type { AddMealOptionId } from './add-meal-options';

export const AddFoodPathname = '/add-food';
export const MealEstimatePathname = '/meal-estimate';

/** Which list the add-food screen searches: foods measured in grams, or drinks in milliliters. */
export type FoodKind = 'food' | 'drink';

/** What an estimate starts from: a photo (with an optional description) or a description alone. */
export type EstimateSource = 'photo' | 'description';

type MealParams = { mealType: MealType; mealId?: string };

export type AddMealDestination =
  | { pathname: typeof AddFoodPathname; params: MealParams & { kind: FoodKind } }
  | { pathname: typeof MealEstimatePathname; params: MealParams & { source: EstimateSource } };

/** Where each option leads, carrying the meal being added to (when there is one) along. */
export function buildAddMealDestination(optionId: AddMealOptionId, mealType: MealType, mealId: string | undefined): AddMealDestination {
  const mealParams = buildMealParams(mealType, mealId);

  if (optionId === 'food' || optionId === 'drink') {
    return { pathname: AddFoodPathname, params: { ...mealParams, kind: optionId } };
  }

  return { pathname: MealEstimatePathname, params: { ...mealParams, source: optionId } };
}

/** Leaves mealId out when starting a new meal, so it never reaches the next screen as the text "undefined". */
function buildMealParams(mealType: MealType, mealId: string | undefined): MealParams {
  if (mealId === undefined) {
    return { mealType };
  }

  return { mealType, mealId };
}
