import { Tabs } from 'expo-router';
import { useEffect, useState, type ComponentProps, type ReactNode } from 'react';
import { Pressable, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { MotionDurationMs, resolveMotionDuration } from '@/shared/lib/motion';
import { useThemeColors } from '@/shared/config/theme';
import { MotionEasing } from '@/shared/ui/motion-easing';

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

const IndicatorWidthPx = 24;
const IndicatorHeightPx = 3;
const TabIconSizePx = 16;
const BarVerticalPaddingPx = 8;

export function AnimatedTabBar({ state, descriptors, navigation, insets }: TabBarProps) {
  const colors = useThemeColors();
  const reduceMotion = useReducedMotion();
  const [barWidthPx, setBarWidthPx] = useState(0);
  const indicatorOffsetPx = useSharedValue(0);
  const tabWidthPx = barWidthPx / state.routes.length;
  const targetOffsetPx = state.index * tabWidthPx + (tabWidthPx - IndicatorWidthPx) / 2;

  useEffect(() => {
    indicatorOffsetPx.value = withTiming(targetOffsetPx, {
      duration: resolveMotionDuration(MotionDurationMs.tabIndicator, reduceMotion),
      easing: MotionEasing,
    });
  }, [targetOffsetPx, reduceMotion, indicatorOffsetPx]);

  const indicatorStyle = useAnimatedStyle(() => ({ transform: [{ translateX: indicatorOffsetPx.value }] }));

  function handleLayout(event: LayoutChangeEvent) {
    setBarWidthPx(event.nativeEvent.layout.width);
  }

  return (
    <View
      onLayout={handleLayout}
      style={{
        backgroundColor: colors.tabBarBackground,
        borderTopColor: colors.tabBarBorder,
        borderTopWidth: 1,
        paddingTop: BarVerticalPaddingPx,
        paddingBottom: Math.max(insets.bottom, BarVerticalPaddingPx),
      }}>
      <Animated.View
        style={[
          { position: 'absolute', top: -1, left: 0, width: IndicatorWidthPx, height: IndicatorHeightPx, backgroundColor: colors.calories },
          indicatorStyle,
        ]}
      />
      <View className="flex-row">
        {state.routes.map((route, routeIndex) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === routeIndex;
          const label = options.title ?? route.name;

          function handlePress() {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          }

          function renderIcon(color: string): ReactNode {
            return options.tabBarIcon?.({ focused: isFocused, color, size: TabIconSizePx });
          }

          return (
            <TabItem
              key={route.key}
              label={label}
              isFocused={isFocused}
              renderIcon={renderIcon}
              onPress={handlePress}
              activeColor={colors.calories}
              inactiveColor={colors.tabInactive}
            />
          );
        })}
      </View>
    </View>
  );
}

function TabItem({
  label,
  isFocused,
  renderIcon,
  onPress,
  activeColor,
  inactiveColor,
}: {
  label: string;
  isFocused: boolean;
  renderIcon: (color: string) => ReactNode;
  onPress: () => void;
  activeColor: string;
  inactiveColor: string;
}) {
  const reduceMotion = useReducedMotion();
  const focusProgress = useSharedValue(Number(isFocused));

  useEffect(() => {
    focusProgress.value = withTiming(Number(isFocused), {
      duration: resolveMotionDuration(MotionDurationMs.tabColor, reduceMotion),
      easing: MotionEasing,
    });
  }, [isFocused, reduceMotion, focusProgress]);

  const activeIconStyle = useAnimatedStyle(() => ({ opacity: focusProgress.value }));
  const inactiveIconStyle = useAnimatedStyle(() => ({ opacity: 1 - focusProgress.value }));
  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(focusProgress.value, [0, 1], [inactiveColor, activeColor]),
  }));

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={label}
      className="flex-1 items-center gap-1.5">
      <View style={{ width: TabIconSizePx, height: TabIconSizePx }}>
        <Animated.View style={[{ position: 'absolute' }, inactiveIconStyle]}>{renderIcon(inactiveColor)}</Animated.View>
        <Animated.View style={[{ position: 'absolute' }, activeIconStyle]}>{renderIcon(activeColor)}</Animated.View>
      </View>
      <Animated.Text
        style={[{ fontFamily: 'Archivo_700Bold', fontSize: 9, letterSpacing: 1, textTransform: 'uppercase' }, labelStyle]}>
        {label}
      </Animated.Text>
    </Pressable>
  );
}
