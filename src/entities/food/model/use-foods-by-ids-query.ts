import { useQueries } from '@tanstack/react-query';

import { useSession } from '@/entities/session';
import { getJson } from '@/shared/api/http-client';

import type { Food } from './food.types';

/** Looks up several foods by id in parallel -- e.g. to label each item on a meal by name. */
export function useFoodsByIdsQuery(ids: readonly string[]) {
  const session = useSession();
  const isSignedIn = session.status === 'signed-in';

  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: ['foods', 'detail', id],
      queryFn: () => getJson<Food>(`/foods/${id}`),
      enabled: isSignedIn,
    })),
  });

  const isPending = results.some((result) => result.isPending);
  const foodsById = new Map<string, Food>();
  for (const result of results) {
    if (result.data !== undefined) {
      foodsById.set(result.data.id, result.data);
    }
  }

  return { isPending, foodsById };
}
