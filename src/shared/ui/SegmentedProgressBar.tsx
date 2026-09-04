import { View } from 'react-native';

const DefaultUnfilledColorClassName = 'bg-ft-card';
const DefaultHeightClassName = 'h-[26px]';

export function SegmentedProgressBar({
  segmentCount,
  progressPercent,
  filledColorClassName,
  unfilledColorClassName = DefaultUnfilledColorClassName,
  heightClassName = DefaultHeightClassName,
}: {
  segmentCount: number;
  progressPercent: number;
  filledColorClassName: string;
  unfilledColorClassName?: string;
  heightClassName?: string;
}) {
  return (
    <View className={`${heightClassName} flex-row gap-1`}>
      {Array.from({ length: segmentCount }, (_, segmentIndex) => {
        const segmentThreshold = ((segmentIndex + 1) / segmentCount) * 100;
        const isFilled = progressPercent >= segmentThreshold;
        return (
          <View key={segmentIndex} className={`flex-1 rounded-sm ${isFilled ? filledColorClassName : unfilledColorClassName}`} />
        );
      })}
    </View>
  );
}
