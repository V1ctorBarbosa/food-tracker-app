import { fireEvent, render, screen } from '@testing-library/react-native';

import { DeleteAccountSection } from './DeleteAccountSection';

const mockMutate = jest.fn();
const mockReset = jest.fn();
let mockMutationState = { isPending: false, isError: false };

// Reanimated 4 needs native worklets that Jest cannot load; only what this component uses is
// stood in for, with animations reduced to plain views since they do not affect the behavior tested.
jest.mock('react-native-reanimated', () => {
  const { Text, View } = require('react-native');
  const mockAnimation = { duration: () => mockAnimation };

  return {
    __esModule: true,
    default: { View, Text },
    FadeIn: mockAnimation,
    FadeInDown: mockAnimation,
    FadeOut: mockAnimation,
    FadeOutUp: mockAnimation,
    LinearTransition: mockAnimation,
  };
});

jest.mock('../model/use-delete-account-mutation', () => ({
  useDeleteAccountMutation: () => ({ ...mockMutationState, mutate: mockMutate, reset: mockReset }),
}));

describe('DeleteAccountSection', () => {
  beforeEach(() => {
    mockMutate.mockClear();
    mockReset.mockClear();
    mockMutationState = { isPending: false, isError: false };
  });

  test('asks for confirmation before deleting anything', async () => {
    await render(<DeleteAccountSection />);

    await fireEvent.press(screen.getByText('Excluir conta'));

    expect(screen.getByText('Excluir sua conta?')).toBeTruthy();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  test('deletes the account once the user confirms', async () => {
    await render(<DeleteAccountSection />);

    await fireEvent.press(screen.getByText('Excluir conta'));
    await fireEvent.press(screen.getByText('Excluir para sempre'));

    expect(mockMutate).toHaveBeenCalledTimes(1);
  });

  test('backs out without deleting when the user cancels', async () => {
    await render(<DeleteAccountSection />);

    await fireEvent.press(screen.getByText('Excluir conta'));
    await fireEvent.press(screen.getByText('Cancelar'));

    expect(mockMutate).not.toHaveBeenCalled();
    expect(mockReset).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Excluir conta')).toBeTruthy();
  });

  test('tells the user when the deletion failed', async () => {
    mockMutationState = { isPending: false, isError: true };
    await render(<DeleteAccountSection />);

    await fireEvent.press(screen.getByText('Excluir conta'));

    expect(screen.getByText('Não foi possível excluir sua conta. Tente de novo.')).toBeTruthy();
  });
});
