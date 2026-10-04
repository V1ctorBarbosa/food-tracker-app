import { useQuery } from '@tanstack/react-query';

import { useSession } from '@/entities/session';
import type { WaterEntry } from '@/entities/water-entry/model/water-entry.types';
import { getJson } from '@/shared/api/http-client';
import { buildDayRangeQuery } from '@/shared/lib/day-range-query';

export function useDayWaterEntriesQuery(day: string) {
  const session = useSession();
  const isSignedIn = session.status === 'signed-in';

  return useQuery({
    queryKey: ['water-entries', day, day],
    queryFn: () => getJson<WaterEntry[]>(`/water-entries?${buildDayRangeQuery(day, day)}`),
    enabled: isSignedIn,
  });
}
