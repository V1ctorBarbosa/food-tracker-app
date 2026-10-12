/** Without a photo the description is all the model has, so it must say enough to estimate from. */
export const MinimumDescriptionLengthWithoutPhoto = 10;

/** Bounds the text sent to the paid model on every estimate and re-run; the API enforces the same limit. */
export const MaximumDescriptionLength = 500;

/** Whether an estimate can be asked for: a photo with any description, or a long enough description alone. */
export function canRequestEstimate(hasPhoto: boolean, description: string): boolean {
  const trimmedLength = description.trim().length;
  if (trimmedLength > MaximumDescriptionLength) {
    return false;
  }

  if (hasPhoto) {
    return true;
  }

  return trimmedLength >= MinimumDescriptionLengthWithoutPhoto;
}

/** The description as the API receives it: trimmed, or null when nothing was written. */
export function toDescriptionRequest(description: string): string | null {
  const trimmedDescription = description.trim();
  if (trimmedDescription.length === 0) {
    return null;
  }

  return trimmedDescription;
}

/** "12/500": how much of the allowed description is used. */
export function formatDescriptionCounter(description: string): string {
  return `${description.length}/${MaximumDescriptionLength}`;
}
