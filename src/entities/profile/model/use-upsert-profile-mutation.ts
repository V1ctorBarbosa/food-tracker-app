import { useMutation, useQueryClient } from '@tanstack/react-query';

import { putJson } from '@/shared/api/http-client';

import type { UpsertUserProfileRequest, UserProfile } from './profile.types';

/**
 * Thin TanStack Query wrapper over PUT /profile -- framework-integration glue, not covered by a
 * unit test (see the Testing section of the workspace CLAUDE.md); the schema/validation logic
 * it's fed lives in `profile-form-schema.ts` and is tested there.
 */
export function useUpsertProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpsertUserProfileRequest) => putJson<UpsertUserProfileRequest, UserProfile>('/profile', request),
    onSuccess: (profile) => {
      queryClient.setQueryData(['profile'], profile);
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
