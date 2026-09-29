export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

export interface AuthGateway {
  /** Subscribes to auth state changes; returns an unsubscribe function. */
  subscribe(listener: (user: AuthUser | null) => void): () => void;
  /** Resolves the signed-in user's ID token, or null when nobody is signed in. */
  getIdToken(): Promise<string | null>;
  /** Signs the user in through Google, on whichever platform is running. */
  signInWithGoogle(): Promise<void>;
  /** Ends the current session. */
  signOut(): Promise<void>;
}

export { authGateway } from './firebase-auth-gateway';
