import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postJson } from '@/shared/api/http-client';

import type { CreateMealRequest, Meal } from './meal.types';

export function useCreateMealMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateMealRequest) => postJson<CreateMealRequest, Meal>('/meals', request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
