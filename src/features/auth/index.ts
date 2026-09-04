// Metro resolves this to sign-in.web.ts or sign-in.native.ts per platform at bundle time;
// tsc has no platform context here and would need a project-wide moduleSuffixes override to
// follow it too, which corrupts resolution for every third-party .web/.native split file in
// node_modules. Each variant is still fully type-checked on its own via its own import path.
// @ts-expect-error -- see comment above; Metro resolves this, tsc alone cannot.
export { signInWithGoogle } from './google-sign-in/sign-in';
export { signOutOfSession } from './sign-out';
export { useAuthErrorRecovery } from './use-auth-error-recovery';
