import { useQueries } from '@tanstack/react-query';

import { useSession } from '@/entities/session';
import { ApiError, getJson } from '@/shared/api/http-client';

import type { Food } from './food.types';

const NotFoundStatus = 404;
const MaxRetryAttempts = 3;

/** Looks up several foods by id in parallel -- e.g. to label each item on a meal by name. */
export function useFoodsByIdsQuery(ids: readonly string[]) {
  const session = useSession();
  const isSignedIn = session.status === 'signed-in';

  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: ['foods', 'detail', id],
      queryFn: () => getJson<Food>(`/foods/${id}`),
      enabled: isSignedIn,
      // A 404 here means the food is gone for good (e.g. its cache entry was deleted) --
      // retrying won't make it reappear, so don't pile on 3 more requests for nothing.
      retry: (failureCount: number, error: unknown) =>
        !(error instanceof ApiError && error.status === NotFoundStatus) && failureCount < MaxRetryAttempts,
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
