import { useEffect } from 'react';
import { useReducedMotion, useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';

import { MotionDurationMs, resolveMotionDuration } from '@/shared/lib/motion';
import { MotionEasing } from '@/shared/ui/motion-easing';

/**
 * A 0-100 value that eases toward `targetPercent`. It starts at 0, so a bar built on it fills
 * in when it first appears and glides whenever the target changes afterwards.
 */
export function useAnimatedPercent(targetPercent: number, durationMs: number = MotionDurationMs.bar): SharedValue<number> {
  const reduceMotion = useReducedMotion();
  const animatedPercent = useSharedValue(0);

  useEffect(() => {
    animatedPercent.value = withTiming(targetPercent, {
      duration: resolveMotionDuration(durationMs, reduceMotion),
      easing: MotionEasing,
    });
  }, [targetPercent, durationMs, reduceMotion, animatedPercent]);

  return animatedPercent;
}
