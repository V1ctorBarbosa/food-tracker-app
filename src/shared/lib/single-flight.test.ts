import { createSingleFlight } from './single-flight';

function createControllableAction() {
  let finish: () => void = () => {};
  const action = jest.fn(() => new Promise<void>((resolve) => (finish = resolve)));

  return { action, finish: () => finish() };
}

describe('createSingleFlight', () => {
  test('runs the first action', async () => {
    const singleFlight = createSingleFlight();
    const action = jest.fn().mockResolvedValue(undefined);

    await singleFlight.run(action);

    expect(action).toHaveBeenCalledTimes(1);
  });

  test('drops a second call made while the first is still running', async () => {
    const singleFlight = createSingleFlight();
    const first = createControllableAction();
    const second = jest.fn().mockResolvedValue(undefined);

    const firstRun = singleFlight.run(first.action);
    await singleFlight.run(second);

    expect(second).not.toHaveBeenCalled();

    first.finish();
    await firstRun;
  });

  test('drops calls made in the same tick, before anything has had time to re-render', async () => {
    const singleFlight = createSingleFlight();
    const action = jest.fn().mockResolvedValue(undefined);

    await Promise.all([singleFlight.run(action), singleFlight.run(action), singleFlight.run(action)]);

    expect(action).toHaveBeenCalledTimes(1);
  });

  test('accepts a new action once the previous one has finished', async () => {
    const singleFlight = createSingleFlight();
    const action = jest.fn().mockResolvedValue(undefined);

    await singleFlight.run(action);
    await singleFlight.run(action);

    expect(action).toHaveBeenCalledTimes(2);
  });

  test('accepts a new action after the previous one failed, and does not throw', async () => {
    const singleFlight = createSingleFlight();
    const failing = jest.fn().mockRejectedValue(new Error('network down'));
    const next = jest.fn().mockResolvedValue(undefined);

    await expect(singleFlight.run(failing)).resolves.toBeUndefined();
    await singleFlight.run(next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test('accepts a synchronous action', async () => {
    const singleFlight = createSingleFlight();
    const action = jest.fn();

    await singleFlight.run(action);
    await singleFlight.run(action);

    expect(action).toHaveBeenCalledTimes(2);
  });
});
