import Constants from 'expo-constants';
import { Platform } from 'react-native';

const ApiPort = 5281;
const ApiHttpsPort = 7267;

/**
 * On web the API runs on the same machine, so localhost works directly. We call the HTTPS port
 * directly rather than the HTTP one -- the API's UseHttpsRedirection() would otherwise redirect
 * http -> https, and browsers strip the Authorization header on a cross-origin redirect (scheme
 * and port both change here), silently turning every authenticated request into an anonymous
 * one. On a native device or simulator, "localhost" would resolve to the device itself --
 * instead we reuse the LAN host Metro is already serving the JS bundle from
 * (expoConfig.hostUri), since the phone must already be able to reach that host to have loaded
 * the app at all; native's HTTP call isn't subject to the same browser redirect behavior.
 */
function resolveApiBaseUrl(): string {
  // Expo inlines any EXPO_PUBLIC_-prefixed variable at build time (from a local .env file or an
  // EAS build profile's env). Setting this is how a real deployed backend gets wired in later --
  // everything below is dev-only resolution for a locally running API.
  const configuredBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (configuredBaseUrl !== undefined && configuredBaseUrl.length > 0) {
    return configuredBaseUrl;
  }

  if (Platform.OS === 'web') {
    return `https://localhost:${ApiHttpsPort}`;
  }

  const devServerHost = Constants.expoConfig?.hostUri?.split(':')[0];
  if (devServerHost !== undefined && devServerHost.length > 0) {
    return `http://${devServerHost}:${ApiPort}`;
  }

  return `http://localhost:${ApiPort}`;
}

export const apiBaseUrl = resolveApiBaseUrl();
