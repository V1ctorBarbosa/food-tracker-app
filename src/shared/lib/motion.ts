/** Durations of the app's motion vocabulary, in milliseconds. */
export const MotionDurationMs = {
  bar: 420,
  countUp: 650,
  tabColor: 180,
  tabIndicator: 260,
} as const;

/** With reduce-motion on, every animation collapses to an instant change. */
export function resolveMotionDuration(durationMs: number, reduceMotion: boolean): number {
  if (reduceMotion) {
    return 0;
  }

  return durationMs;
}
