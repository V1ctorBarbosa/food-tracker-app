import { useQuery } from '@tanstack/react-query';

import { useSession } from '@/entities/session';
import type { WeightEntry } from '@/entities/weight-entry/model/weight-entry.types';
import { getJson } from '@/shared/api/http-client';
import { buildDayRangeQuery } from '@/shared/lib/day-range-query';

export function useWeightHistoryQuery(from: string, to: string) {
  const session = useSession();
  const isSignedIn = session.status === 'signed-in';

  return useQuery({
    queryKey: ['weight-entries', from, to],
    queryFn: () => getJson<WeightEntry[]>(`/weight-entries?${buildDayRangeQuery(from, to)}`),
    enabled: isSignedIn,
  });
}
