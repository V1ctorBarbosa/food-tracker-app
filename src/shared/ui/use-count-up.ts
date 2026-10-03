import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'react-native-reanimated';

import { interpolateCountUp } from '@/shared/lib/count-up';
import { MotionDurationMs, resolveMotionDuration } from '@/shared/lib/motion';

/**
 * The number to display while `target` is being counted toward. Starts at 0 on first render and
 * restarts from wherever it currently is when the target changes, so it never jumps backward.
 */
export function useCountUp(target: number): number {
  const reduceMotion = useReducedMotion();
  const [displayedValue, setDisplayedValue] = useState(0);
  const displayedValueRef = useRef(0);

  useEffect(() => {
    const startValue = displayedValueRef.current;
    const durationMs = resolveMotionDuration(MotionDurationMs.countUp, reduceMotion);

    if (durationMs === 0) {
      displayedValueRef.current = target;
      setDisplayedValue(target);
      return;
    }

    const startTimeMs = performance.now();
    let frameHandle = 0;

    function advance(nowMs: number) {
      const progress = Math.min(1, (nowMs - startTimeMs) / durationMs);
      const value = interpolateCountUp(startValue, target, progress);
      displayedValueRef.current = value;
      setDisplayedValue(value);

      if (progress < 1) {
        frameHandle = requestAnimationFrame(advance);
      }
    }

    frameHandle = requestAnimationFrame(advance);

    return () => cancelAnimationFrame(frameHandle);
  }, [target, reduceMotion]);

  return displayedValue;
}
