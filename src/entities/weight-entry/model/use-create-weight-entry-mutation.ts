import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postJson } from '@/shared/api/http-client';

import type { CreateWeightEntryRequest, WeightEntry } from './weight-entry.types';

export function useCreateWeightEntryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateWeightEntryRequest) => postJson<CreateWeightEntryRequest, WeightEntry>('/weight-entries', request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weight-entries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
