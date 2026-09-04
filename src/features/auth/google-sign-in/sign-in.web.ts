import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { auth } from '@/shared/api/firebase';

export async function signInWithGoogle(): Promise<void> {
  await signInWithPopup(auth, new GoogleAuthProvider());
}
