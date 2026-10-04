import { useQuery } from '@tanstack/react-query';

import type { Meal } from '@/entities/meal/model/meal.types';
import { useSession } from '@/entities/session';
import { getJson } from '@/shared/api/http-client';
import { buildDayRangeQuery } from '@/shared/lib/day-range-query';

export function useDayMealsQuery(day: string) {
  const session = useSession();
  const isSignedIn = session.status === 'signed-in';

  return useQuery({
    queryKey: ['meals', day, day],
    queryFn: () => getJson<Meal[]>(`/meals?${buildDayRangeQuery(day, day)}`),
    enabled: isSignedIn,
  });
}
