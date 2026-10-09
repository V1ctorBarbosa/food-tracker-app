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
      // Switching between g and ml also moves the food's logged items to the new unit on the backend;
      // a cached meal would otherwise re-send them in the old unit when an item is added, and be rejected.
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });
}
