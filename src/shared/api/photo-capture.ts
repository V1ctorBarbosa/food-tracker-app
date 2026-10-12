export type PhotoSource = 'camera' | 'library';

/** A photo ready to upload: a local JPEG file already resized for the estimate. */
export type CapturedPhoto = { uri: string };

export type PhotoCaptureResult =
  | { status: 'captured'; photo: CapturedPhoto }
  | { status: 'canceled' }
  | { status: 'permission-denied' };

export interface PhotoCapture {
  /** Opens the camera or the photo library and returns the chosen photo, resized as a JPEG. */
  capture(source: PhotoSource): Promise<PhotoCaptureResult>;
}

export { photoCapture } from './expo-photo-capture';
