import { View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { MotionDurationMs } from '@/shared/lib/motion';
import { useAnimatedPercent } from '@/shared/ui/use-animated-percent';

/** The filled part of a horizontal bar: grows from the left as `percent` rises. */
export function ProgressBarFill({
  percent,
  fillClassName,
  durationMs = MotionDurationMs.bar,
}: {
  percent: number;
  fillClassName: string;
  durationMs?: number;
}) {
  const animatedPercent = useAnimatedPercent(percent, durationMs);
  const animatedStyle = useAnimatedStyle(() => ({ width: `${animatedPercent.value}%` }));

  return <Animated.View className={fillClassName} style={[{ height: '100%' }, animatedStyle]} />;
}

export function ProgressBar({
  progressPercent,
  fillClassName,
  trackClassName,
  durationMs,
}: {
  progressPercent: number;
  fillClassName: string;
  trackClassName: string;
  durationMs?: number;
}) {
  return (
    <View className={`overflow-hidden ${trackClassName}`}>
      <ProgressBarFill percent={progressPercent} fillClassName={fillClassName} durationMs={durationMs} />
    </View>
  );
}
