import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
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

const SelectedLabelColor = '#FFFFFF';

/** A pill that fades its fill and label colour in and out as it is selected and deselected. */
export function SelectionChip({
  label,
  color,
  isSelected,
  onPress,
}: {
  label: string;
  color: string;
  isSelected: boolean;
  onPress: () => void;
}) {
  const themeColors = useThemeColors();
  const reduceMotion = useReducedMotion();
  const selectionProgress = useSharedValue(Number(isSelected));

  useEffect(() => {
    selectionProgress.value = withTiming(Number(isSelected), {
      duration: resolveMotionDuration(MotionDurationMs.chip, reduceMotion),
      easing: MotionEasing,
    });
  }, [isSelected, reduceMotion, selectionProgress]);

  const fillStyle = useAnimatedStyle(() => ({ opacity: selectionProgress.value }));
  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(selectionProgress.value, [0, 1], [themeColors.textMuted2, SelectedLabelColor]),
  }));

  return (
    <Pressable onPress={onPress} className="overflow-hidden rounded-full border border-ft-muted-3/40 px-3.5 py-1.5">
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: color }, fillStyle]} />
      <Animated.Text className="font-body-bold text-[11px] uppercase tracking-widest" style={labelStyle}>
        {label}
      </Animated.Text>
    </Pressable>
  );
}
