import { renderHook } from '@testing-library/react-native';

import { ApiError } from '@/shared/api/http-client';

import { useAuthErrorRecovery } from './use-auth-error-recovery';

jest.mock('@/shared/api/firebase', () => ({ auth: {} }));
jest.mock('./sign-out', () => ({ signOutOfSession: jest.fn().mockResolvedValue(undefined) }));

const mockedSignOutOfSession = jest.requireMock('./sign-out').signOutOfSession as jest.Mock;
const SignOutDelayMs = 3500;

describe('useAuthErrorRecovery', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test('does not recover or sign out for a non-ApiError', async () => {
    const { result } = await renderHook(() => useAuthErrorRecovery(new Error('network failure')));

    jest.advanceTimersByTime(SignOutDelayMs);

    expect(result.current).toEqual({ isRecovering: false });
    expect(mockedSignOutOfSession).not.toHaveBeenCalled();
  });

  test('does not recover or sign out for a non-401 ApiError', async () => {
    const { result } = await renderHook(() => useAuthErrorRecovery(new ApiError(500, 'Unexpected error.', 'UnexpectedError')));

    jest.advanceTimersByTime(SignOutDelayMs);

    expect(result.current).toEqual({ isRecovering: false });
    expect(mockedSignOutOfSession).not.toHaveBeenCalled();
  });

  test('does not recover or sign out for a 401 with no recognized error code', async () => {
    const { result } = await renderHook(() => useAuthErrorRecovery(new ApiError(401, 'Unauthorized.', null)));

    jest.advanceTimersByTime(SignOutDelayMs);

    expect(result.current).toEqual({ isRecovering: false });
    expect(mockedSignOutOfSession).not.toHaveBeenCalled();
  });

  test.each([
    ['MissingCredentials', 'Você precisa entrar novamente para continuar.'],
    ['TokenExpired', 'Sua sessão expirou. Entrando novamente...'],
    ['TokenRevoked', 'Sua sessão foi encerrada. Entrando novamente...'],
    ['TokenInvalid', 'Não foi possível confirmar sua identidade. Entrando novamente...'],
  ])('recovers with the translated message for %s, and signs out only after the delay', async (errorCode, expectedMessage) => {
    const { result } = await renderHook(() => useAuthErrorRecovery(new ApiError(401, 'Unauthorized.', errorCode)));

    expect(result.current).toEqual({ isRecovering: true, message: expectedMessage });
    expect(mockedSignOutOfSession).not.toHaveBeenCalled();

    jest.advanceTimersByTime(SignOutDelayMs);

    expect(mockedSignOutOfSession).toHaveBeenCalledTimes(1);
  });

  test('does not leave a rejected signOutOfSession unhandled', async () => {
    mockedSignOutOfSession.mockRejectedValueOnce(new Error('network failure'));

    await renderHook(() => useAuthErrorRecovery(new ApiError(401, 'Unauthorized.', 'TokenExpired')));

    jest.advanceTimersByTime(SignOutDelayMs);
    await Promise.resolve();

    expect(mockedSignOutOfSession).toHaveBeenCalledTimes(1);
  });

  test('cancels the pending sign-out when the error clears before the delay elapses', async () => {
    const { rerender } = await renderHook(({ error }: { error: unknown }) => useAuthErrorRecovery(error), {
      initialProps: { error: new ApiError(401, 'Unauthorized.', 'TokenExpired') as unknown },
    });

    await rerender({ error: null });
    jest.advanceTimersByTime(SignOutDelayMs);

    expect(mockedSignOutOfSession).not.toHaveBeenCalled();
  });
});
