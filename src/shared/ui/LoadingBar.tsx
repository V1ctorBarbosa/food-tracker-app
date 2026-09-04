import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { brandStripeColors } from '@/shared/config/theme';

const DimOpacity = 0.35;
const LitOpacity = 1;
const SegmentAnimationDurationMs = 260;
const StaggerDelayMs = 120;
const CycleRestMs = 700;

export function LoadingBar() {
  return (
    <View className="h-3 w-40 flex-row gap-1 self-center overflow-hidden rounded-full">
      {brandStripeColors.map((color, index) => (
        <LoadingSegment key={color} color={color} delayMs={index * StaggerDelayMs} />
      ))}
    </View>
  );
}

function LoadingSegment({ color, delayMs }: { color: string; delayMs: number }) {
  const opacity = useSharedValue(DimOpacity);

  useEffect(() => {
    opacity.value = withDelay(
      delayMs,
      withRepeat(
        withSequence(
          withTiming(LitOpacity, { duration: SegmentAnimationDurationMs }),
          withTiming(DimOpacity, { duration: SegmentAnimationDurationMs }),
          withTiming(DimOpacity, { duration: CycleRestMs }),
        ),
        -1,
      ),
    );
  }, [delayMs, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View className="flex-1 rounded-full" style={[{ backgroundColor: color }, animatedStyle]} />;
}
