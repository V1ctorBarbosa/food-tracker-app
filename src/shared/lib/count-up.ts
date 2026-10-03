function clampProgress(progress: number): number {
  return Math.min(1, Math.max(0, progress));
}

/** Fast start, gentle landing: the curve every count-up in the app follows. */
export function easeOutCubic(progress: number): number {
  return 1 - Math.pow(1 - clampProgress(progress), 3);
}

export function interpolateCountUp(from: number, to: number, progress: number): number {
  return from + (to - from) * easeOutCubic(progress);
}
