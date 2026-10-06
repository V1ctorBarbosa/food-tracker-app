import { DeletedDataLabels, resolveDeleteAccountView } from './delete-account-view';

describe('resolveDeleteAccountView', () => {
  test('waits while the session is still loading', () => {
    expect(resolveDeleteAccountView('loading', false)).toBe('loading');
  });

  test('asks a signed-out visitor to sign in first', () => {
    expect(resolveDeleteAccountView('signed-out', false)).toBe('sign-in');
  });

  test('offers the deletion to a signed-in user', () => {
    expect(resolveDeleteAccountView('signed-in', false)).toBe('confirm');
  });

  test('confirms the deletion even though it signed the user out', () => {
    expect(resolveDeleteAccountView('signed-out', true)).toBe('deleted');
    expect(resolveDeleteAccountView('loading', true)).toBe('deleted');
  });
});

describe('DeletedDataLabels', () => {
  test('lists every kind of data the API deletes, sign-in account included', () => {
    expect(DeletedDataLabels).toHaveLength(5);
    expect(DeletedDataLabels[DeletedDataLabels.length - 1]).toContain('conta de acesso');
  });
});
