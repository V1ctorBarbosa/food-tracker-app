import type { User } from 'firebase/auth';

import { auth } from '@/shared/api/firebase';

import type { AuthGateway, AuthUser } from './auth-gateway';

/** The only file in the app allowed to know the session provider is Firebase -- everything else depends on `AuthGateway`. */
class FirebaseAuthGateway implements AuthGateway {
  subscribe(listener: (user: AuthUser | null) => void): () => void {
    return auth.onAuthStateChanged((user) => listener(toAuthUser(user)));
  }

  async getIdToken(): Promise<string | null> {
    const idToken = await auth.currentUser?.getIdToken();
    return idToken ?? null;
  }

  async signInWithGoogle(): Promise<void> {
    // Metro resolves this to google-sign-in.web.ts or google-sign-in.native.ts per platform at
    // bundle time; tsc has no platform context here and would need a project-wide moduleSuffixes
    // override to follow it too, which corrupts resolution for every third-party .web/.native
    // split file in node_modules. Each variant is still fully type-checked on its own via its own
    // import path. Loaded dynamically -- not at module load time -- so the native Google Sign-In
    // SDK is only touched when this method actually runs, not by every consumer of the gateway
    // (getIdToken()/subscribe() are used by virtually every screen).
    // @ts-expect-error -- see comment above; Metro resolves this, tsc alone cannot.
    const { signInWithGoogleCredential } = await import('./google-sign-in');
    await signInWithGoogleCredential();
  }

  async signOut(): Promise<void> {
    await auth.signOut();
  }
}

function toAuthUser(user: User | null): AuthUser | null {
  if (user === null) {
    return null;
  }

  return { uid: user.uid, email: user.email, displayName: user.displayName };
}

export const authGateway: AuthGateway = new FirebaseAuthGateway();
