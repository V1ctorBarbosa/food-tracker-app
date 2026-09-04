import { focusManager } from '@tanstack/react-query';
import { Platform } from 'react-native';

import { handleAppStateChange } from './use-refetch-on-app-focus';

jest.mock('@tanstack/react-query', () => ({
  focusManager: { setFocused: jest.fn() },
}));

describe('handleAppStateChange', () => {
  afterEach(() => {
    jest.clearAllMocks();
    Platform.OS = 'ios';
  });

  test('focuses the query client when the app becomes active', () => {
    Platform.OS = 'ios';

    handleAppStateChange('active');

    expect(focusManager.setFocused).toHaveBeenCalledWith(true);
  });

  test('unfocuses the query client when the app goes to background', () => {
    Platform.OS = 'ios';

    handleAppStateChange('background');

    expect(focusManager.setFocused).toHaveBeenCalledWith(false);
  });

  test('does nothing on web, where the browser already handles focus', () => {
    Platform.OS = 'web';

    handleAppStateChange('active');

    expect(focusManager.setFocused).not.toHaveBeenCalled();
  });
});
