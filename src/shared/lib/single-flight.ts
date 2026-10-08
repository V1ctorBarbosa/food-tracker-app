export type SingleFlight = {
  /** Runs the action unless one is already running; a call made meanwhile is dropped, not queued. */
  run: (action: () => void | Promise<void>) => Promise<void>;
};

/**
 * Lets only one action run at a time. The guard flips synchronously, so two taps landing in the
 * same frame cannot both get through before the screen has re-rendered with its buttons disabled.
 * A failure is not rethrown here: the caller's own mutation state already carries it to the user.
 */
export function createSingleFlight(): SingleFlight {
  let isRunning = false;

  async function run(action: () => void | Promise<void>): Promise<void> {
    if (isRunning) {
      return;
    }

    isRunning = true;

    try {
      await action();
    } catch {
      // Intentionally swallowed, see above.
    } finally {
      isRunning = false;
    }
  }

  return { run };
}
