import { useMutation, useQueryClient } from '@tanstack/react-query';

import { putJson } from '@/shared/api/http-client';

import type { Food, UpdateCustomFoodRequest } from './food.types';

type UpdateCustomFoodVariables = { id: string; request: UpdateCustomFoodRequest };

export function useUpdateCustomFoodMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: UpdateCustomFoodVariables) => putJson<UpdateCustomFoodRequest, Food>(`/foods/${id}`, request),
    onSuccess: () => {
      // The list, any cached search and the per-food lookups behind the meal screens all show this food.
      queryClient.invalidateQueries({ queryKey: ['foods'] });
    },
  });
}
