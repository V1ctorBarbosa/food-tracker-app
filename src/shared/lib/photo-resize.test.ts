import { calculatePhotoResizeTarget, MealPhotoMaximumSidePixels } from './photo-resize';

describe('calculatePhotoResizeTarget', () => {
  test('shrinks a landscape photo so its width is the maximum side', () => {
    expect(calculatePhotoResizeTarget({ width: 4032, height: 3024 }, MealPhotoMaximumSidePixels)).toEqual({ width: 1024, height: 768 });
  });

  test('shrinks a portrait photo so its height is the maximum side', () => {
    expect(calculatePhotoResizeTarget({ width: 3024, height: 4032 }, MealPhotoMaximumSidePixels)).toEqual({ width: 768, height: 1024 });
  });

  test('keeps a photo that already fits', () => {
    expect(calculatePhotoResizeTarget({ width: 800, height: 600 }, MealPhotoMaximumSidePixels)).toEqual({ width: 800, height: 600 });
  });

  test('keeps a photo whose longest side is exactly the maximum', () => {
    expect(calculatePhotoResizeTarget({ width: 1024, height: 1024 }, MealPhotoMaximumSidePixels)).toEqual({ width: 1024, height: 1024 });
  });
});
