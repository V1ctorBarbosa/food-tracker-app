import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authGateway } from '@/shared/api/auth-gateway';
import { deleteRequest } from '@/shared/api/http-client';

import { deleteAccount } from './delete-account';

export function useDeleteAccountMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      deleteAccount({
        requestDeletion: deleteRequest,
        clearCachedData: () => queryClient.clear(),
        signOut: () => authGateway.signOut(),
      }),
  });
}
