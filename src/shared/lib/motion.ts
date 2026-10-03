/** Durations of the app's motion vocabulary, in milliseconds. */
export const MotionDurationMs = {
  bar: 420,
  chip: 180,
  countUp: 650,
  lineDot: 200,
  lineDotDelay: 700,
  lineDraw: 800,
  listEnter: 220,
  listExit: 200,
  listReflow: 260,
  press: 120,
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
