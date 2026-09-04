import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteRequest } from '@/shared/api/http-client';

export function useDeleteWaterEntryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRequest(`/water-entries/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['water-entries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
