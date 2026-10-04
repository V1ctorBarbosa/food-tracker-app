import { useEffect } from 'react';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useThemeColors } from '@/shared/config/theme';
import { MotionDurationMs, resolveMotionDuration } from '@/shared/lib/motion';
import { MotionEasing } from '@/shared/ui/motion-easing';

const TrackWidthPx = 44;
const TrackHeightPx = 26;
const KnobSizePx = 20;
const KnobInsetPx = 3;
const KnobTravelPx = TrackWidthPx - KnobSizePx - 2 * KnobInsetPx;
const KnobColor = '#FFFFFF';

/** The visual switch only: the surrounding row decides what a tap does. */
export function ToggleSwitch({ isOn }: { isOn: boolean }) {
  const colors = useThemeColors();
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(Number(isOn));

  useEffect(() => {
    progress.value = withTiming(Number(isOn), {
      duration: resolveMotionDuration(MotionDurationMs.toggle, reduceMotion),
      easing: MotionEasing,
    });
  }, [isOn, reduceMotion, progress]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [colors.tabInactive, colors.calories]),
  }));
  const knobStyle = useAnimatedStyle(() => ({ transform: [{ translateX: progress.value * KnobTravelPx }] }));

  return (
    <Animated.View
      style={[{ width: TrackWidthPx, height: TrackHeightPx, borderRadius: TrackHeightPx / 2, justifyContent: 'center' }, trackStyle]}>
      <Animated.View
        style={[
          { width: KnobSizePx, height: KnobSizePx, borderRadius: KnobSizePx / 2, marginLeft: KnobInsetPx, backgroundColor: KnobColor },
          knobStyle,
        ]}
      />
    </Animated.View>
  );
}
