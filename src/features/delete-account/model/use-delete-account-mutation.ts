import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authGateway } from '@/shared/api/auth-gateway';
import { deleteRequest } from '@/shared/api/http-client';

import { deleteAccount } from './delete-account';

/**
 * `onDeleted` is passed to the mutation itself rather than to `mutate`, because signing out at the
 * end of the deletion can unmount the component that started it, and `mutate` callbacks are
 * dropped for an unmounted caller.
 */
export function useDeleteAccountMutation({ onDeleted }: { onDeleted?: () => void } = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      deleteAccount({
        requestDeletion: deleteRequest,
        clearCachedData: () => queryClient.clear(),
        signOut: () => authGateway.signOut(),
      }),
    onSuccess: onDeleted,
  });
}
