/**
 * Firebase Web SDK config -- safe to ship in client code. These values identify the
 * project and are restricted server-side (Firestore rules, App Check, OAuth client
 * restrictions); they are not secrets, unlike the backend's service account key.
 */
export const firebaseConfig = {
  apiKey: 'AIzaSyC_KDgKtdTiKsWza1E63U5YKHM0aeW3rhU',
  authDomain: 'food-track-d7a9e.firebaseapp.com',
  projectId: 'food-track-d7a9e',
  storageBucket: 'food-track-d7a9e.firebasestorage.app',
  messagingSenderId: '341004041149',
  appId: '1:341004041149:web:1ea62f4593fb587b7f70d4',
} as const;

/**
 * The "Web client" OAuth client id Firebase Auth created when Google sign-in was enabled.
 * @react-native-google-signin/google-signin needs this even on Android/iOS, because it is
 * what Firebase uses server-side to verify the Google ID token.
 */
export const googleWebClientId =
  '341004041149-6ctj88nr54ec7gaqm3oqkvbi1ug2oal9.apps.googleusercontent.com';
