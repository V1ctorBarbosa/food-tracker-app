import type { Persistence, ReactNativeAsyncStorage } from 'firebase/auth';

/**
 * `@firebase/auth`'s package.json exports map lists an unconditional top-level "types" key
 * ahead of its "react-native" condition, so TypeScript always resolves to the
 * platform-agnostic auth-public.d.ts and never sees the React Native build's types -- even
 * though the function is genuinely exported at runtime for React Native (Metro's bundler
 * resolution does honor the "react-native" condition). This restores just that one
 * declaration, matching @firebase/auth/dist/rn/src/platform_react_native/persistence/react_native.d.ts.
 */
declare module '@firebase/auth' {
  export function getReactNativePersistence(storage: ReactNativeAsyncStorage): Persistence;
}
