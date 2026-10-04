import { handleWarmUpAppState, warmUpApi } from './warm-up-api';

jest.mock('@/shared/config/api-config', () => ({ apiBaseUrl: 'https://api.example.test' }));

describe('warmUpApi', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    global.fetch = fetchMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('calls the public health route on the given base URL', async () => {
    fetchMock.mockResolvedValue({ ok: true });

    await warmUpApi('https://backend.example.test');

    expect(fetchMock).toHaveBeenCalledWith('https://backend.example.test/health');
  });

  test('defaults to the configured API base URL', async () => {
    fetchMock.mockResolvedValue({ ok: true });

    await warmUpApi();

    expect(fetchMock).toHaveBeenCalledWith('https://api.example.test/health');
  });

  test('never sends credentials', async () => {
    fetchMock.mockResolvedValue({ ok: true });

    await warmUpApi();

    expect(fetchMock.mock.calls[0]).toHaveLength(1);
  });

  test('swallows a network failure', async () => {
    fetchMock.mockRejectedValue(new Error('offline'));

    await expect(warmUpApi()).resolves.toBeUndefined();
  });
});

describe('handleWarmUpAppState', () => {
  test('warms the API when the app becomes active', () => {
    const warmUp = jest.fn().mockResolvedValue(undefined);

    handleWarmUpAppState('active', warmUp);

    expect(warmUp).toHaveBeenCalledTimes(1);
  });

  test.each([['background'], ['inactive']] as const)('does nothing when the app goes %p', (status) => {
    const warmUp = jest.fn().mockResolvedValue(undefined);

    handleWarmUpAppState(status, warmUp);

    expect(warmUp).not.toHaveBeenCalled();
  });
});
