import { useEffect, useState } from 'react';

import { authGateway, type AuthUser } from '@/shared/api/auth-gateway';

export type SessionState =
  | { status: 'loading' }
  | { status: 'signed-out' }
  | { status: 'signed-in'; user: AuthUser };

const LoadingSessionState: SessionState = { status: 'loading' };

export function useSession(): SessionState {
  const [session, setSession] = useState<SessionState>(LoadingSessionState);

  useEffect(() => authGateway.subscribe((user) => setSession(toSessionState(user))), []);

  return session;
}

function toSessionState(user: AuthUser | null): SessionState {
  if (user === null) {
    return { status: 'signed-out' };
  }

  return { status: 'signed-in', user };
}
