import { renderHook } from '@testing-library/react-native';

import { authGateway, type AuthUser } from '@/shared/api/auth-gateway';

import { useSession } from './use-session';

jest.mock('@/shared/api/auth-gateway', () => ({ authGateway: { subscribe: jest.fn() } }));

const mockedSubscribe = authGateway.subscribe as jest.Mock;

describe('useSession', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('starts in the loading state before the auth gateway reports anything', async () => {
    mockedSubscribe.mockReturnValue(() => {});

    const { result } = await renderHook(() => useSession());

    expect(result.current).toEqual({ status: 'loading' });
  });

  test('moves to signed-out when the auth gateway reports no user', async () => {
    mockedSubscribe.mockImplementation((listener: (user: AuthUser | null) => void) => {
      listener(null);
      return () => {};
    });

    const { result } = await renderHook(() => useSession());

    expect(result.current).toEqual({ status: 'signed-out' });
  });

  test('moves to signed-in with the user when the auth gateway reports one', async () => {
    const user: AuthUser = { uid: 'user-123', email: null, displayName: null };
    mockedSubscribe.mockImplementation((listener: (user: AuthUser | null) => void) => {
      listener(user);
      return () => {};
    });

    const { result } = await renderHook(() => useSession());

    expect(result.current).toEqual({ status: 'signed-in', user });
  });

  test('unsubscribes from the auth gateway on unmount', async () => {
    const unsubscribe = jest.fn();
    mockedSubscribe.mockReturnValue(unsubscribe);

    const { unmount } = await renderHook(() => useSession());
    await unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
