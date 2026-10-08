import type { Food } from '@/entities/food';

/**
 * Whether the chosen food needs a row of its own on the page: it does when it is not among the
 * rows already listed, e.g. right after creating a custom food while the search box is empty, when
 * there is no list to show it in.
 */
export function isSelectedFoodMissingFromResults(selectedFood: Food | null, results: readonly Food[] | undefined): boolean {
  if (selectedFood === null) {
    return false;
  }

  if (results === undefined) {
    return true;
  }

  return !results.some((food) => food.id === selectedFood.id);
}
