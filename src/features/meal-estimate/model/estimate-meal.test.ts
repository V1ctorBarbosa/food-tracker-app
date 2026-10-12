import { estimateMeal, type EstimateMealDependencies } from './estimate-meal';
import type { MealEstimate, PhotoUploadSlot } from './meal-estimate.types';

const slot: PhotoUploadSlot = {
  captureId: 'capture-new',
  uploadUrl: 'https://bucket.example.test/pending/photo.jpg?signature=abc',
  headers: { 'Content-Type': 'image/jpeg' },
  expiresAt: '2026-10-12T12:05:00Z',
};

const estimate: MealEstimate = { captureId: 'capture-new', hasPhoto: true, description: null, items: [] };

function createDependencies(): jest.Mocked<EstimateMealDependencies> {
  return {
    createUploadSlot: jest.fn().mockResolvedValue(slot),
    uploadPhoto: jest.fn().mockResolvedValue(undefined),
    requestEstimate: jest.fn().mockResolvedValue(estimate),
  };
}

describe('estimateMeal', () => {
  test('uploads a new photo through its own slot before estimating it', async () => {
    const dependencies = createDependencies();

    await estimateMeal({ photoUri: 'file:///photo.jpg', captureId: null, description: '  o frango é empanado ' }, dependencies);

    expect(dependencies.uploadPhoto).toHaveBeenCalledWith(slot, 'file:///photo.jpg');
    expect(dependencies.requestEstimate).toHaveBeenCalledWith({ captureId: 'capture-new', description: 'o frango é empanado' });
  });

  test('estimates the photo already uploaded again on a re-run, without a new upload', async () => {
    const dependencies = createDependencies();

    await estimateMeal({ photoUri: 'file:///photo.jpg', captureId: 'capture-existing', description: 'é integral' }, dependencies);

    expect(dependencies.createUploadSlot).not.toHaveBeenCalled();
    expect(dependencies.uploadPhoto).not.toHaveBeenCalled();
    expect(dependencies.requestEstimate).toHaveBeenCalledWith({ captureId: 'capture-existing', description: 'é integral' });
  });

  test('estimates a description alone without any upload', async () => {
    const dependencies = createDependencies();

    await estimateMeal({ photoUri: null, captureId: null, description: '200 g de arroz integral' }, dependencies);

    expect(dependencies.createUploadSlot).not.toHaveBeenCalled();
    expect(dependencies.requestEstimate).toHaveBeenCalledWith({ captureId: null, description: '200 g de arroz integral' });
  });

  test('sends no description when none was written', async () => {
    const dependencies = createDependencies();

    await estimateMeal({ photoUri: 'file:///photo.jpg', captureId: null, description: '' }, dependencies);

    expect(dependencies.requestEstimate).toHaveBeenCalledWith({ captureId: 'capture-new', description: null });
  });

  test('does not estimate when the upload fails', async () => {
    const dependencies = createDependencies();
    dependencies.uploadPhoto.mockRejectedValue(new Error('Photo upload failed with status 403.'));

    await expect(estimateMeal({ photoUri: 'file:///photo.jpg', captureId: null, description: '' }, dependencies)).rejects.toThrow('403');
    expect(dependencies.requestEstimate).not.toHaveBeenCalled();
  });
});
