/**
 * Runs an action while reporting that it is pending, so the UI can show a loading state for exactly
 * as long as it takes. The pending flag always comes back down, including when the action fails.
 * A failure is not rethrown here: the caller's own mutation state already carries it to the user.
 */
export async function runWhilePending(
  action: () => void | Promise<void>,
  setPending: (isPending: boolean) => void,
): Promise<void> {
  setPending(true);

  try {
    await action();
  } catch {
    // Intentionally swallowed, see above.
  } finally {
    setPending(false);
  }
}
