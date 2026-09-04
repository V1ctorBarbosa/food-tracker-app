import { signOut } from 'firebase/auth';

import { auth } from '@/shared/api/firebase';

export async function signOutOfSession(): Promise<void> {
  await signOut(auth);
}
