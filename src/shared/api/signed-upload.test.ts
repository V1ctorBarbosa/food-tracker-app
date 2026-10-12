import { uploadFileToSignedUrl } from './signed-upload';

describe('uploadFileToSignedUrl', () => {
  const photoBlob = new Blob(['jpeg bytes'], { type: 'image/jpeg' });
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn();
    global.fetch = fetchMock;
  });

  test('puts the file to the signed url with exactly the headers it was given and no bearer token', async () => {
    fetchMock.mockResolvedValueOnce({ blob: async () => photoBlob }).mockResolvedValueOnce({ ok: true, status: 200 });

    await uploadFileToSignedUrl('https://bucket.example.test/pending/photo.jpg?signature=abc', { 'Content-Type': 'image/jpeg' }, 'file:///photo.jpg');

    expect(fetchMock).toHaveBeenNthCalledWith(1, 'file:///photo.jpg');
    expect(fetchMock).toHaveBeenNthCalledWith(2, 'https://bucket.example.test/pending/photo.jpg?signature=abc', {
      method: 'PUT',
      headers: { 'Content-Type': 'image/jpeg' },
      body: photoBlob,
    });
  });

  test('fails when the storage rejects the upload', async () => {
    fetchMock.mockResolvedValueOnce({ blob: async () => photoBlob }).mockResolvedValueOnce({ ok: false, status: 403 });

    await expect(uploadFileToSignedUrl('https://bucket.example.test/upload', {}, 'file:///photo.jpg')).rejects.toThrow('403');
  });
});
