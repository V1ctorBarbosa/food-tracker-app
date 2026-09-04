import { useQuery } from '@tanstack/react-query';

import { useSession } from '@/entities/session';
import type { WeightEntry } from '@/entities/weight-entry/model/weight-entry.types';
import { getJson } from '@/shared/api/http-client';

export function useWeightHistoryQuery(from: string, to: string) {
  const session = useSession();
  const isSignedIn = session.status === 'signed-in';

  return useQuery({
    queryKey: ['weight-entries', from, to],
    queryFn: () => getJson<WeightEntry[]>(`/weight-entries?from=${from}&to=${to}`),
    enabled: isSignedIn,
  });
}
