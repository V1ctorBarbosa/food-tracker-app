import { onAuthStateChanged, type User } from 'firebase/auth';
import { useEffect, useState } from 'react';

import { auth } from '@/shared/api/firebase';

export type SessionState =
  | { status: 'loading' }
  | { status: 'signed-out' }
  | { status: 'signed-in'; user: User };

const LoadingSessionState: SessionState = { status: 'loading' };

export function useSession(): SessionState {
  const [session, setSession] = useState<SessionState>(LoadingSessionState);

  useEffect(() => onAuthStateChanged(auth, (user) => setSession(toSessionState(user))), []);

  return session;
}

function toSessionState(user: User | null): SessionState {
  if (user === null) {
    return { status: 'signed-out' };
  }

  return { status: 'signed-in', user };
}
