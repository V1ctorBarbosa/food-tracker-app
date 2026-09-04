import { useQuery } from '@tanstack/react-query';

import type { Dashboard } from '@/entities/dashboard/model/dashboard.types';
import { useSession } from '@/entities/session';
import { getJson } from '@/shared/api/http-client';

export function useDashboardQuery(from: string, to: string) {
  const session = useSession();
  const isSignedIn = session.status === 'signed-in';

  return useQuery({
    queryKey: ['dashboard', from, to],
    queryFn: () => getJson<Dashboard>(`/dashboard?from=${from}&to=${to}`),
    enabled: isSignedIn,
  });
}
