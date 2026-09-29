import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

import { auth } from '@/shared/api/firebase';
import { googleWebClientId } from '@/shared/config/firebase-config';

GoogleSignin.configure({ webClientId: googleWebClientId });

export async function signInWithGoogleCredential(): Promise<void> {
  await GoogleSignin.hasPlayServices();
  const response = await GoogleSignin.signIn();

  if (!isSuccessResponse(response)) {
    return;
  }

  const googleIdToken = response.data.idToken;
  if (googleIdToken === null) {
    throw new Error('Google sign-in did not return an ID token.');
  }

  await signInWithCredential(auth, GoogleAuthProvider.credential(googleIdToken));
}
