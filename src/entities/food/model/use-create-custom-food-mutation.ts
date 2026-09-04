import { useMutation } from '@tanstack/react-query';

import { postJson } from '@/shared/api/http-client';

import type { CreateCustomFoodRequest, Food } from './food.types';

export function useCreateCustomFoodMutation() {
  return useMutation({
    mutationFn: (request: CreateCustomFoodRequest) => postJson<CreateCustomFoodRequest, Food>('/foods', request),
  });
}
