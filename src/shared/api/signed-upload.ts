/**
 * Uploads a local file straight to a presigned storage URL. No bearer token: the URL carries its
 * own signature, and an Authorization header would make the storage reject it.
 */
export async function uploadFileToSignedUrl(uploadUrl: string, headers: Record<string, string>, fileUri: string): Promise<void> {
  const fileResponse = await fetch(fileUri);
  const fileBlob = await fileResponse.blob();

  const uploadResponse = await fetch(uploadUrl, { method: 'PUT', headers, body: fileBlob });
  if (!uploadResponse.ok) {
    throw new Error(`Photo upload failed with status ${uploadResponse.status}.`);
  }
}
