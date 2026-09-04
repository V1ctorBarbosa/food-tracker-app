import Constants from 'expo-constants';
import { Platform } from 'react-native';

const ApiPort = 5281;

/**
 * On web the API runs on the same machine, so localhost works directly. On a native device
 * or simulator, "localhost" would resolve to the device itself -- instead we reuse the LAN
 * host Metro is already serving the JS bundle from (expoConfig.hostUri), since the phone
 * must already be able to reach that host to have loaded the app at all.
 */
function resolveApiBaseUrl(): string {
  if (Platform.OS === 'web') {
    return `http://localhost:${ApiPort}`;
  }

  const devServerHost = Constants.expoConfig?.hostUri?.split(':')[0];
  if (devServerHost !== undefined && devServerHost.length > 0) {
    return `http://${devServerHost}:${ApiPort}`;
  }

  return `http://localhost:${ApiPort}`;
}

export const apiBaseUrl = resolveApiBaseUrl();
