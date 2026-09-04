import { useQuery } from '@tanstack/react-query';

import { useSession } from '@/entities/session';
import { getJson } from '@/shared/api/http-client';

import type { Meal } from './meal.types';

export function useMealQuery(id: string | undefined) {
  const session = useSession();

  return useQuery({
    queryKey: ['meals', 'detail', id],
    queryFn: () => getJson<Meal>(`/meals/${id}`),
    enabled: session.status === 'signed-in' && id !== undefined,
  });
}
