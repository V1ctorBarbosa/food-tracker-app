import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postJson } from '@/shared/api/http-client';

import type { CreateWaterEntryRequest, WaterEntry } from './water-entry.types';

export function useCreateWaterEntryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateWaterEntryRequest) => postJson<CreateWaterEntryRequest, WaterEntry>('/water-entries', request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['water-entries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
