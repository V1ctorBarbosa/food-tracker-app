import { useMutation, useQueryClient } from '@tanstack/react-query';

import { putJson } from '@/shared/api/http-client';

import type { Meal, UpdateMealRequest } from './meal.types';

type UpdateMealVariables = { id: string; request: UpdateMealRequest };

export function useUpdateMealMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: UpdateMealVariables) => putJson<UpdateMealRequest, Meal>(`/meals/${id}`, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
