import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteRequest } from '@/shared/api/http-client';

export function useDeleteWeightEntryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRequest(`/weight-entries/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weight-entries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
