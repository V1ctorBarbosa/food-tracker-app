import { View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { MotionDurationMs } from '@/shared/lib/motion';
import { calculateSegmentFillPercent } from '@/shared/lib/segment-fill';
import { useAnimatedPercent } from '@/shared/ui/use-animated-percent';

const DefaultUnfilledColorClassName = 'bg-white/30';
const DefaultHeightClassName = 'h-6';

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
        <View key={segmentIndex} className={`flex-1 overflow-hidden rounded-[3px] ${unfilledColorClassName}`}>
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

/** Fills each segment from the left, one segment after another as the overall progress rises. */
function SegmentFill({ fillPercent, fillClassName, durationMs }: { fillPercent: number; fillClassName: string; durationMs: number }) {
  const animatedPercent = useAnimatedPercent(fillPercent, durationMs);
  const animatedStyle = useAnimatedStyle(() => ({ width: `${animatedPercent.value}%` }));

  return <Animated.View className={fillClassName} style={[{ height: '100%' }, animatedStyle]} />;
}
