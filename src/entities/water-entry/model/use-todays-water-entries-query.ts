import { useQuery } from '@tanstack/react-query';

import { useSession } from '@/entities/session';
import type { WaterEntry } from '@/entities/water-entry/model/water-entry.types';
import { getJson } from '@/shared/api/http-client';

export function useTodaysWaterEntriesQuery(today: string) {
  const session = useSession();
  const isSignedIn = session.status === 'signed-in';

  return useQuery({
    queryKey: ['water-entries', today, today],
    queryFn: () => getJson<WaterEntry[]>(`/water-entries?from=${today}&to=${today}`),
    enabled: isSignedIn,
  });
}
