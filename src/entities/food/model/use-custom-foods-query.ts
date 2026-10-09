import { useQuery } from '@tanstack/react-query';

import { useSession } from '@/entities/session';
import { getJson } from '@/shared/api/http-client';

import type { Food } from './food.types';

/** The signed-in user's own custom foods, ordered by name. */
export function useCustomFoodsQuery() {
  const session = useSession();

  return useQuery({
    queryKey: ['foods', 'custom'],
    queryFn: () => getJson<Food[]>('/foods/custom'),
    enabled: session.status === 'signed-in',
  });
}
