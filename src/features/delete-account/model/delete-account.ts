export const DeleteAccountPath = '/account';

export type DeleteAccountSteps = {
  requestDeletion: (path: string) => Promise<void>;
  clearCachedData: () => void;
  signOut: () => Promise<void>;
};

/**
 * Asks the API to delete the account and everything in it, then drops what this device still holds
 * and ends the session. Nothing is cleared when the API call fails, so the user can simply retry.
 */
export async function deleteAccount(steps: DeleteAccountSteps): Promise<void> {
  await steps.requestDeletion(DeleteAccountPath);
  steps.clearCachedData();
  await steps.signOut();
}
