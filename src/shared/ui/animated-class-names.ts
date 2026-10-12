import { cssInterop } from 'nativewind';
import Animated from 'react-native-reanimated';

type InteropComponent = Parameters<typeof cssInterop>[0];
type ClassNameMapping = Parameters<typeof cssInterop>[1];
type RegisterClassNames = (component: InteropComponent, mapping: ClassNameMapping) => unknown;

const ClassNameToStyle = { className: 'style' } as const;

/**
 * Reanimated renders its wrapped component through the precompiled `react/jsx-runtime`, which
 * NativeWind's JSX interop never sees, so a `className` on `Animated.View` would reach the DOM as
 * an ignored prop instead of becoming a style. Registering each Reanimated component with
 * NativeWind resolves the `className` into a style before Reanimated receives it.
 */
export const AnimatedClassNameMappings: readonly (readonly [InteropComponent, ClassNameMapping])[] = [
  [Animated.View, ClassNameToStyle],
  [Animated.Text, ClassNameToStyle],
  [Animated.Image, ClassNameToStyle],
  [Animated.ScrollView, { ...ClassNameToStyle, contentContainerClassName: 'contentContainerStyle' }],
];

/** Must run once at the app entry point, before any Reanimated component renders. */
export function registerAnimatedClassNames(register: RegisterClassNames = cssInterop) {
  for (const [component, mapping] of AnimatedClassNameMappings) {
    register(component, mapping);
  }
}
