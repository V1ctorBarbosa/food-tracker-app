import { deleteAccount, DeleteAccountPath, type DeleteAccountSteps } from './delete-account';

function buildSteps(callOrder: string[]): DeleteAccountSteps {
  return {
    requestDeletion: jest.fn(async () => {
      callOrder.push('requestDeletion');
    }),
    clearCachedData: jest.fn(() => {
      callOrder.push('clearCachedData');
    }),
    signOut: jest.fn(async () => {
      callOrder.push('signOut');
    }),
  };
}

describe('deleteAccount', () => {
  test('asks the API to delete the account, then clears the cache and signs out, in that order', async () => {
    const callOrder: string[] = [];
    const steps = buildSteps(callOrder);

    await deleteAccount(steps);

    expect(steps.requestDeletion).toHaveBeenCalledWith(DeleteAccountPath);
    expect(callOrder).toEqual(['requestDeletion', 'clearCachedData', 'signOut']);
  });

  test('keeps the session and the cached data when the API call fails, so the user can retry', async () => {
    const steps = buildSteps([]);
    steps.requestDeletion = jest.fn(async () => {
      throw new Error('Request failed with status 500.');
    });

    await expect(deleteAccount(steps)).rejects.toThrow('Request failed with status 500.');

    expect(steps.clearCachedData).not.toHaveBeenCalled();
    expect(steps.signOut).not.toHaveBeenCalled();
  });

  test('targets the account route', () => {
    expect(DeleteAccountPath).toBe('/account');
  });
});
