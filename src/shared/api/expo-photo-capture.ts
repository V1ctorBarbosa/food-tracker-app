import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

import { calculatePhotoResizeTarget, MealPhotoMaximumSidePixels } from '@/shared/lib/photo-resize';

import type { PhotoCapture, PhotoCaptureResult, PhotoSource } from './photo-capture';

// Enough quality for the model to read the plate; the resize already keeps the file small.
const JpegCompression = 0.8;

const PickerOptions: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 1 };

/** The one place the Expo picker and manipulator are used; everything else goes through PhotoCapture. */
export const photoCapture: PhotoCapture = {
  async capture(source: PhotoSource): Promise<PhotoCaptureResult> {
    const isAllowed = await requestPermission(source);
    if (!isAllowed) {
      return { status: 'permission-denied' };
    }

    const pickerResult = await launchPicker(source);
    if (pickerResult.canceled) {
      return { status: 'canceled' };
    }

    const asset = pickerResult.assets[0];
    const uri = await resizeToJpeg(asset);
    return { status: 'captured', photo: { uri } };
  },
};

async function requestPermission(source: PhotoSource): Promise<boolean> {
  if (source === 'camera') {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    return permission.granted;
  }

  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return permission.granted;
}

function launchPicker(source: PhotoSource): Promise<ImagePicker.ImagePickerResult> {
  if (source === 'camera') {
    return ImagePicker.launchCameraAsync(PickerOptions);
  }

  return ImagePicker.launchImageLibraryAsync(PickerOptions);
}

async function resizeToJpeg(asset: ImagePicker.ImagePickerAsset): Promise<string> {
  const target = calculatePhotoResizeTarget({ width: asset.width, height: asset.height }, MealPhotoMaximumSidePixels);
  const context = ImageManipulator.manipulate(asset.uri).resize(target);
  const renderedImage = await context.renderAsync();
  const savedImage = await renderedImage.saveAsync({ format: SaveFormat.JPEG, compress: JpegCompression });

  return savedImage.uri;
}
