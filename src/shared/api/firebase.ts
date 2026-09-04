import AsyncStorage from '@react-native-async-storage/async-storage';
// `firebase/auth`'s package.json exports map has no "react-native" condition, so it never
// resolves to the React Native build -- getReactNativePersistence only exists on the
// underlying @firebase/auth package, which does have that condition.
import { getReactNativePersistence } from '@firebase/auth';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, type Auth } from 'firebase/auth';
import { Platform } from 'react-native';

import { firebaseConfig } from '@/shared/config/firebase-config';

const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth: Auth = Platform.OS === 'web' ? getAuth(firebaseApp) : createNativeAuth();

function createNativeAuth(): Auth {
  try {
    return initializeAuth(firebaseApp, { persistence: getReactNativePersistence(AsyncStorage) });
  } catch {
    // initializeAuth throws if it already ran for this app (e.g. Fast Refresh re-executing
    // this module) -- fall back to the existing instance instead of crashing.
    return getAuth(firebaseApp);
  }
}
