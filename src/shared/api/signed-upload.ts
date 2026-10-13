import { fetch } from 'expo/fetch';
import { File } from 'expo-file-system';

/** The photo did not reach the storage: no connection, an expired URL, or the storage refused it. */
export class PhotoUploadError extends Error {
  constructor(
    message: string,
    public readonly status: number | null = null,
  ) {
    super(message);
    this.name = 'PhotoUploadError';
  }
}

/**
 * Uploads a local file straight to a presigned storage URL. The file goes as the body through
 * Expo's fetch, which streams it natively: reading a file:// URI into a JS blob first is not
 * reliable on Android. No bearer token: the URL carries its own signature, and an Authorization
 * header would make the storage reject it.
 */
export async function uploadFileToSignedUrl(uploadUrl: string, headers: Record<string, string>, fileUri: string): Promise<void> {
  let uploadResponse: Awaited<ReturnType<typeof fetch>>;
  try {
    uploadResponse = await fetch(uploadUrl, { method: 'PUT', headers, body: new File(fileUri) });
  } catch (error) {
    throw new PhotoUploadError(`Photo upload failed: ${String(error)}`);
  }

  if (!uploadResponse.ok) {
    throw new PhotoUploadError(`Photo upload failed with status ${uploadResponse.status}.`, uploadResponse.status);
  }
}
