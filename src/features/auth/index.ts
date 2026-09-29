import { authGateway } from '@/shared/api/auth-gateway';

export function signInWithGoogle(): Promise<void> {
  return authGateway.signInWithGoogle();
}

export function signOutOfSession(): Promise<void> {
  return authGateway.signOut();
}

export { useAuthErrorRecovery } from './use-auth-error-recovery';
