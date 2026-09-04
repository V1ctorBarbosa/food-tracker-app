import { useQuery } from '@tanstack/react-query';

import { useSession } from '@/entities/session';
import { ApiError, getJson } from '@/shared/api/http-client';

import type { UserProfile } from './profile.types';

const ProfileNotFoundStatus = 404;

export function useProfileQuery() {
  const session = useSession();
  const isSignedIn = session.status === 'signed-in';

  return useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfileOrNull,
    enabled: isSignedIn,
  });
}

/** A missing profile (404) is an expected, valid state for a first-time sign-in -- not a query error. */
export async function fetchProfileOrNull(): Promise<UserProfile | null> {
  try {
    return await getJson<UserProfile>('/profile');
  } catch (error) {
    if (error instanceof ApiError && error.status === ProfileNotFoundStatus) {
      return null;
    }

    throw error;
  }
}
