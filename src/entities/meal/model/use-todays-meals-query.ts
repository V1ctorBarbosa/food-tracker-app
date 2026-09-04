import { useQuery } from '@tanstack/react-query';

import type { Meal } from '@/entities/meal/model/meal.types';
import { useSession } from '@/entities/session';
import { getJson } from '@/shared/api/http-client';

export function useTodaysMealsQuery(today: string) {
  const session = useSession();
  const isSignedIn = session.status === 'signed-in';

  return useQuery({
    queryKey: ['meals', today, today],
    queryFn: () => getJson<Meal[]>(`/meals?from=${today}&to=${today}`),
    enabled: isSignedIn,
  });
}
