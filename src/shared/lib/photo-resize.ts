/** The longest side a meal photo is sent at: enough for the model to tell foods apart, small enough to upload fast. */
export const MealPhotoMaximumSidePixels = 1024;

export type PhotoSize = { width: number; height: number };

/**
 * The size to resize a photo to so its longest side is at most `maximumSide`, keeping its aspect
 * ratio. A photo that already fits keeps its size, so nothing is ever scaled up.
 */
export function calculatePhotoResizeTarget(size: PhotoSize, maximumSide: number): PhotoSize {
  const longestSide = Math.max(size.width, size.height);
  if (longestSide <= maximumSide) {
    return size;
  }

  const scale = maximumSide / longestSide;
  return { width: Math.round(size.width * scale), height: Math.round(size.height * scale) };
}
