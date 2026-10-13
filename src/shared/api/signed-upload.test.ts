import { fetch } from 'expo/fetch';
import { File } from 'expo-file-system';

import { PhotoUploadError, uploadFileToSignedUrl } from './signed-upload';

jest.mock('expo/fetch', () => ({ fetch: jest.fn() }));
jest.mock('expo-file-system', () => ({
  File: jest.fn().mockImplementation((uri: string) => ({ uri })),
}));

const fetchMock = fetch as jest.MockedFunction<typeof fetch>;
const FileMock = File as unknown as jest.Mock;

const UploadUrl = 'https://bucket.example.test/pending/photo.jpg?signature=abc';
const PhotoUri = 'file:///data/user/0/cache/photo.jpg';

type UploadResponse = Awaited<ReturnType<typeof fetch>>;

/** Only ok and status are read from the response, so the rest of Expo's response is left out. */
function createUploadResponse(ok: boolean, status: number): UploadResponse {
  return { ok, status } as unknown as UploadResponse;
}

describe('uploadFileToSignedUrl', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    FileMock.mockClear();
  });

  test('puts the local file itself as the body, with exactly the headers it was given and no bearer token', async () => {
    fetchMock.mockResolvedValue(createUploadResponse(true, 200));

    await uploadFileToSignedUrl(UploadUrl, { 'Content-Type': 'image/jpeg' }, PhotoUri);

    expect(FileMock).toHaveBeenCalledWith(PhotoUri);
    expect(fetchMock).toHaveBeenCalledWith(UploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'image/jpeg' },
      body: { uri: PhotoUri },
    });
  });

  test('fails with the status when the storage rejects the upload', async () => {
    fetchMock.mockResolvedValue(createUploadResponse(false, 403));

    const upload = uploadFileToSignedUrl(UploadUrl, {}, PhotoUri);

    await expect(upload).rejects.toBeInstanceOf(PhotoUploadError);
    await expect(upload).rejects.toMatchObject({ status: 403 });
  });

  test('fails as an upload error when the request cannot be sent at all', async () => {
    fetchMock.mockRejectedValue(new TypeError('Network request failed'));

    await expect(uploadFileToSignedUrl(UploadUrl, {}, PhotoUri)).rejects.toBeInstanceOf(PhotoUploadError);
  });
});
