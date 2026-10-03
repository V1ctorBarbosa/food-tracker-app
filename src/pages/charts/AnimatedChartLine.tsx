import { useEffect } from 'react';
import Animated, {
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { Circle, Path } from 'react-native-svg';

import { calculatePolylineLength, type ChartCoordinate } from '@/pages/charts/model/line-chart-geometry';
import { MotionDurationMs, resolveMotionDuration } from '@/shared/lib/motion';
import { MotionEasing } from '@/shared/ui/motion-easing';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const EndDotRadius = 4.5;

/**
 * Draws the line from left to right, then lets the end dot appear. Restarts whenever the path
 * changes, so switching the period redraws the line instead of snapping to the new one.
 */
export function AnimatedChartLine({
  pathData,
  coordinates,
  color,
  strokeWidth,
}: {
  pathData: string;
  coordinates: ChartCoordinate[];
  color: string;
  strokeWidth: number;
}) {
  const reduceMotion = useReducedMotion();
  const drawProgress = useSharedValue(0);
  const endDotOpacity = useSharedValue(0);
  const lineLength = calculatePolylineLength(coordinates);
  const endCoordinate = coordinates[coordinates.length - 1];

  useEffect(() => {
    drawProgress.value = 0;
    endDotOpacity.value = 0;
    drawProgress.value = withTiming(1, {
      duration: resolveMotionDuration(MotionDurationMs.lineDraw, reduceMotion),
      easing: MotionEasing,
    });
    endDotOpacity.value = withDelay(
      resolveMotionDuration(MotionDurationMs.lineDotDelay, reduceMotion),
      withTiming(1, { duration: resolveMotionDuration(MotionDurationMs.lineDot, reduceMotion) }),
    );
  }, [pathData, reduceMotion, drawProgress, endDotOpacity]);

  const lineProps = useAnimatedProps(() => ({ strokeDashoffset: lineLength * (1 - drawProgress.value) }));
  const endDotProps = useAnimatedProps(() => ({ opacity: endDotOpacity.value }));

  return (
    <>
      <AnimatedPath
        d={pathData}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={[lineLength, lineLength]}
        animatedProps={lineProps}
      />
      <AnimatedCircle cx={endCoordinate.x} cy={endCoordinate.y} r={EndDotRadius} fill={color} animatedProps={endDotProps} />
    </>
  );
}
