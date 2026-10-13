import { cssInterop } from 'nativewind';
import { Platform, type PlatformOSType } from 'react-native';
import Animated from 'react-native-reanimated';

type InteropComponent = Parameters<typeof cssInterop>[0];
type ClassNameMapping = Parameters<typeof cssInterop>[1];
type RegisterClassNames = (component: InteropComponent, mapping: ClassNameMapping) => unknown;

const ClassNameToStyle = { className: 'style' } as const;
const WebPlatform: PlatformOSType = 'web';

/**
 * Reanimated renders its wrapped component through the precompiled `react/jsx-runtime`, which
 * NativeWind's JSX interop never sees on web, so a `className` on `Animated.View` would reach the
 * DOM as an ignored prop instead of becoming a style. Registering each Reanimated component with
 * NativeWind resolves the `className` into a style before Reanimated receives it.
 */
export const AnimatedClassNameMappings: readonly (readonly [InteropComponent, ClassNameMapping])[] = [
  [Animated.View, ClassNameToStyle],
  [Animated.Text, ClassNameToStyle],
  [Animated.Image, ClassNameToStyle],
  [Animated.ScrollView, { ...ClassNameToStyle, contentContainerClassName: 'contentContainerStyle' }],
];

/**
 * Must run once at the app entry point, before any Reanimated component renders. Web only: on
 * Android and iOS NativeWind already styles these components, and registering them again makes the
 * class styles override their animated styles (bar widths and heights collapse).
 */
export function registerAnimatedClassNames(register: RegisterClassNames = cssInterop, platform: PlatformOSType = Platform.OS) {
  if (platform !== WebPlatform) {
    return;
  }

  for (const [component, mapping] of AnimatedClassNameMappings) {
    register(component, mapping);
  }
}
