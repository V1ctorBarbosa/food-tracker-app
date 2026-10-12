import { ApiError } from '@/shared/api/http-client';

/** The API's error codes for estimates, as GlobalExceptionHandler writes them. */
export const MealEstimateErrorCode = {
  accessDenied: 'MealEstimateAccessDenied',
  noFoodRecognized: 'NoFoodRecognized',
  estimateUnavailable: 'EstimateUnavailable',
  tooManyRequests: 'TooManyRequests',
} as const;

const MessageByErrorCode: Record<string, string> = {
  [MealEstimateErrorCode.accessDenied]: 'A estimativa por IA não está disponível para a sua conta.',
  [MealEstimateErrorCode.noFoodRecognized]: 'Não encontramos comida aqui. Tente outra foto ou descreva a refeição.',
  [MealEstimateErrorCode.estimateUnavailable]: 'Não foi possível calcular agora. Tente de novo em instantes.',
  [MealEstimateErrorCode.tooManyRequests]: 'Você fez muitas estimativas na última hora. Tente de novo mais tarde.',
};

const FallbackMessage = 'Não foi possível calcular essa refeição. Tente novamente.';

/** What to tell the user when an estimate fails, in their words rather than the API's. */
export function resolveEstimateErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError) || error.errorCode === null) {
    return FallbackMessage;
  }

  return MessageByErrorCode[error.errorCode] ?? FallbackMessage;
}
