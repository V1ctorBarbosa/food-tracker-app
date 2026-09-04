import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteRequest } from '@/shared/api/http-client';

export function useDeleteMealMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRequest(`/meals/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
