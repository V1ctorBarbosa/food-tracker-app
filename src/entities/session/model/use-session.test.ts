import { renderHook } from '@testing-library/react-native';
import { onAuthStateChanged, type User } from 'firebase/auth';

import { useSession } from './use-session';

jest.mock('@/shared/api/firebase', () => ({ auth: {} }));
jest.mock('firebase/auth', () => ({ onAuthStateChanged: jest.fn() }));

const mockedOnAuthStateChanged = onAuthStateChanged as jest.Mock;

describe('useSession', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('starts in the loading state before Firebase reports anything', async () => {
    mockedOnAuthStateChanged.mockReturnValue(() => {});

    const { result } = await renderHook(() => useSession());

    expect(result.current).toEqual({ status: 'loading' });
  });

  test('moves to signed-out when Firebase reports no user', async () => {
    mockedOnAuthStateChanged.mockImplementation((_auth, callback: (user: User | null) => void) => {
      callback(null);
      return () => {};
    });

    const { result } = await renderHook(() => useSession());

    expect(result.current).toEqual({ status: 'signed-out' });
  });

  test('moves to signed-in with the user when Firebase reports one', async () => {
    const user = { uid: 'user-123' } as User;
    mockedOnAuthStateChanged.mockImplementation((_auth, callback: (user: User | null) => void) => {
      callback(user);
      return () => {};
    });

    const { result } = await renderHook(() => useSession());

    expect(result.current).toEqual({ status: 'signed-in', user });
  });

  test('unsubscribes from onAuthStateChanged on unmount', async () => {
    const unsubscribe = jest.fn();
    mockedOnAuthStateChanged.mockReturnValue(unsubscribe);

    const { unmount } = await renderHook(() => useSession());
    await unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
