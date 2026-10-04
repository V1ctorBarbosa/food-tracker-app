import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

import { useThemeColors } from '@/shared/config/theme';
import { MotionDurationMs, resolveMotionDuration } from '@/shared/lib/motion';
import { MotionEasing } from '@/shared/ui/motion-easing';

import { useNightMode } from '../use-theme-preference';

const IconSizePx = 14;
const MoonCutoutSizePx = 11;
const SunRingSizePx = 20;
const SunColor = '#E6C43C';
const SunRingColor = 'rgba(230, 196, 60, 0.25)';
const IconTiltDegrees = '-20deg';

/**
 * A round button that flips between day and night. It shows a moon in the light theme and a sun
 * in the dark one, cross-fading between them as the palette changes.
 */
export function ThemeToggleButton() {
  const { isNightMode, toggleNightMode } = useNightMode();
  const colors = useThemeColors();
  const reduceMotion = useReducedMotion();
  const nightProgress = useSharedValue(Number(isNightMode));

  useEffect(() => {
    nightProgress.value = withTiming(Number(isNightMode), {
      duration: resolveMotionDuration(MotionDurationMs.toggle, reduceMotion),
      easing: MotionEasing,
    });
  }, [isNightMode, reduceMotion, nightProgress]);

  const moonStyle = useAnimatedStyle(() => ({ opacity: 1 - nightProgress.value }));
  const sunStyle = useAnimatedStyle(() => ({ opacity: nightProgress.value }));

  return (
    <Pressable
      onPress={toggleNightMode}
      accessibilityRole="button"
      accessibilityLabel="Alternar modo noturno"
      className="h-[38px] w-[38px] items-center justify-center rounded-full bg-ft-card">
      <View style={{ width: SunRingSizePx, height: SunRingSizePx, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View style={[{ position: 'absolute', transform: [{ rotate: IconTiltDegrees }] }, moonStyle]}>
          <View style={{ width: IconSizePx, height: IconSizePx, borderRadius: IconSizePx / 2, backgroundColor: colors.ink, overflow: 'hidden' }}>
            <View
              style={{
                position: 'absolute',
                top: -1,
                right: -3,
                width: MoonCutoutSizePx,
                height: MoonCutoutSizePx,
                borderRadius: MoonCutoutSizePx / 2,
                backgroundColor: colors.card,
              }}
            />
          </View>
        </Animated.View>

        <Animated.View
          style={[
            {
              position: 'absolute',
              width: SunRingSizePx,
              height: SunRingSizePx,
              borderRadius: SunRingSizePx / 2,
              backgroundColor: SunRingColor,
              alignItems: 'center',
              justifyContent: 'center',
            },
            sunStyle,
          ]}>
          <View style={{ width: IconSizePx, height: IconSizePx, borderRadius: IconSizePx / 2, backgroundColor: SunColor }} />
        </Animated.View>
      </View>
    </Pressable>
  );
}
