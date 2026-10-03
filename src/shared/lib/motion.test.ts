import { MotionDurationMs, resolveMotionDuration } from './motion';

describe('resolveMotionDuration', () => {
  test('keeps the duration when reduce-motion is off', () => {
    expect(resolveMotionDuration(MotionDurationMs.bar, false)).toBe(MotionDurationMs.bar);
  });

  test('collapses the duration to zero when reduce-motion is on', () => {
    expect(resolveMotionDuration(MotionDurationMs.countUp, true)).toBe(0);
  });
});
