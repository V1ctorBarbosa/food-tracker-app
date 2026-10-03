import type { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

import { MotionDurationMs, resolveMotionDuration } from '@/shared/lib/motion';
import { MotionEasing } from '@/shared/ui/motion-easing';

const PressedScale = 0.985;

/**
 * A tappable card that sinks slightly while pressed. The card keeps exactly the layout of its
 * `className`; touches are caught by an invisible pressable laid over it, so the scale never
 * disturbs the card's own flex or padding.
 */
export function PressableScale({
  children,
  className,
  onPress,
  accessibilityLabel,
}: {
  children: ReactNode;
  className: string;
  onPress: () => void;
  accessibilityLabel?: string;
}) {
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  function animateScaleTo(targetScale: number) {
    scale.value = withTiming(targetScale, {
      duration: resolveMotionDuration(MotionDurationMs.press, reduceMotion),
      easing: MotionEasing,
    });
  }

  return (
    <Animated.View className={className} style={animatedStyle}>
      {children}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        onPressIn={() => animateScaleTo(PressedScale)}
        onPressOut={() => animateScaleTo(1)}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}
