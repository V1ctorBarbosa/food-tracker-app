export const AuthErrorCode = {
  MissingCredentials: 'MissingCredentials',
  TokenExpired: 'TokenExpired',
  TokenRevoked: 'TokenRevoked',
  TokenInvalid: 'TokenInvalid',
} as const;

export type AuthErrorCode = (typeof AuthErrorCode)[keyof typeof AuthErrorCode];

const AuthErrorMessages: Record<AuthErrorCode, string> = {
  [AuthErrorCode.MissingCredentials]: 'Você precisa entrar novamente para continuar.',
  [AuthErrorCode.TokenExpired]: 'Sua sessão expirou. Entrando novamente...',
  [AuthErrorCode.TokenRevoked]: 'Sua sessão foi encerrada. Entrando novamente...',
  [AuthErrorCode.TokenInvalid]: 'Não foi possível confirmar sua identidade. Entrando novamente...',
};

export function isAuthErrorCode(value: string | null): value is AuthErrorCode {
  return value !== null && value in AuthErrorMessages;
}

export function getAuthErrorMessage(code: AuthErrorCode): string {
  return AuthErrorMessages[code];
}
