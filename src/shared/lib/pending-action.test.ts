import { runWhilePending } from './pending-action';

describe('runWhilePending', () => {
  test('reports pending before running and not pending after it finishes', async () => {
    const calls: string[] = [];
    const setPending = jest.fn((isPending: boolean) => calls.push(`pending:${isPending}`));
    const action = jest.fn(async () => {
      calls.push('action');
    });

    await runWhilePending(action, setPending);

    expect(calls).toEqual(['pending:true', 'action', 'pending:false']);
  });

  test('stays pending while the action is still running', async () => {
    const setPending = jest.fn();
    let finishAction: () => void = () => {};
    const action = () => new Promise<void>((resolve) => (finishAction = resolve));

    const running = runWhilePending(action, setPending);

    expect(setPending).toHaveBeenCalledTimes(1);
    expect(setPending).toHaveBeenLastCalledWith(true);

    finishAction();
    await running;

    expect(setPending).toHaveBeenLastCalledWith(false);
  });

  test('clears pending and does not throw when the action rejects', async () => {
    const setPending = jest.fn();
    const action = jest.fn().mockRejectedValue(new Error('network down'));

    await expect(runWhilePending(action, setPending)).resolves.toBeUndefined();

    expect(setPending).toHaveBeenNthCalledWith(1, true);
    expect(setPending).toHaveBeenNthCalledWith(2, false);
  });

  test('accepts a synchronous action', async () => {
    const setPending = jest.fn();
    const action = jest.fn();

    await runWhilePending(action, setPending);

    expect(action).toHaveBeenCalledTimes(1);
    expect(setPending).toHaveBeenLastCalledWith(false);
  });
});
