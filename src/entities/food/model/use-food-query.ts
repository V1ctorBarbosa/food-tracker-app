import { useQuery } from '@tanstack/react-query';

import { useSession } from '@/entities/session';
import { getJson } from '@/shared/api/http-client';

import type { Food } from './food.types';

export function useFoodQuery(id: string) {
  const session = useSession();

  return useQuery({
    queryKey: ['foods', 'detail', id],
    queryFn: () => getJson<Food>(`/foods/${id}`),
    enabled: session.status === 'signed-in',
  });
}
