import { View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { MotionDurationMs } from '@/shared/lib/motion';
import { calculateSegmentFillPercent } from '@/shared/lib/segment-fill';
import { useAnimatedPercent } from '@/shared/ui/use-animated-percent';

const DefaultUnfilledColorClassName = 'bg-ft-card';
const DefaultHeightClassName = 'h-[26px]';

export function SegmentedProgressBar({
  segmentCount,
  progressPercent,
  filledColorClassName,
  unfilledColorClassName = DefaultUnfilledColorClassName,
  heightClassName = DefaultHeightClassName,
  durationMs = MotionDurationMs.bar,
}: {
  segmentCount: number;
  progressPercent: number;
  filledColorClassName: string;
  unfilledColorClassName?: string;
  heightClassName?: string;
  durationMs?: number;
}) {
  return (
    <View className={`${heightClassName} flex-row gap-1`}>
      {Array.from({ length: segmentCount }, (_, segmentIndex) => (
        <View key={segmentIndex} className={`flex-1 justify-end overflow-hidden rounded-sm ${unfilledColorClassName}`}>
          <SegmentFill
            fillPercent={calculateSegmentFillPercent(segmentIndex, segmentCount, progressPercent)}
            fillClassName={filledColorClassName}
            durationMs={durationMs}
          />
        </View>
      ))}
    </View>
  );
}

/** Fills each segment from the bottom, like a glass being poured. */
function SegmentFill({ fillPercent, fillClassName, durationMs }: { fillPercent: number; fillClassName: string; durationMs: number }) {
  const animatedPercent = useAnimatedPercent(fillPercent, durationMs);
  const animatedStyle = useAnimatedStyle(() => ({ height: `${animatedPercent.value}%` }));

  return <Animated.View className={fillClassName} style={[{ width: '100%' }, animatedStyle]} />;
}
