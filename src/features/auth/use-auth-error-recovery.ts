import { useEffect } from 'react';

import { authGateway } from '@/shared/api/auth-gateway';
import { ApiError } from '@/shared/api/http-client';

import { AuthErrorCode, getAuthErrorMessage, isAuthErrorCode } from './model/auth-error-messages';

const UnauthorizedStatus = 401;
const SignOutDelayMs = 3500;

export type AuthErrorRecovery = { isRecovering: false } | { isRecovering: true; message: string };

/**
 * Only a 401 carrying one of our auth error codes is a genuine identity failure worth recovering
 * from by signing out -- a network failure or 5xx must NOT trigger this, since logging out and
 * back in fixes nothing there and just adds a forced-logout loop on top of an unrelated problem.
 */
export function useAuthErrorRecovery(error: unknown): AuthErrorRecovery {
  const authErrorCode = getAuthErrorCode(error);

  useEffect(() => {
    if (authErrorCode === null) {
      return;
    }

    // A rejected signOutOfSession() (e.g. no network) has no further recovery action available
    // from inside a timeout callback -- swallowed here only to avoid an unhandled rejection; the
    // recovery message above is already what tells the user something is wrong.
    const timeoutId = setTimeout(() => {
      authGateway.signOut().catch(() => {});
    }, SignOutDelayMs);
    return () => clearTimeout(timeoutId);
  }, [authErrorCode]);

  if (authErrorCode === null) {
    return { isRecovering: false };
  }

  return { isRecovering: true, message: getAuthErrorMessage(authErrorCode) };
}

function getAuthErrorCode(error: unknown): AuthErrorCode | null {
  if (!(error instanceof ApiError) || error.status !== UnauthorizedStatus || !isAuthErrorCode(error.errorCode)) {
    return null;
  }

  return error.errorCode;
}
