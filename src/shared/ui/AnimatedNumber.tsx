import { Text } from 'react-native';

import { useCountUp } from '@/shared/ui/use-count-up';

const EmptyValuePlaceholder = '—';

/**
 * Renders `value` counting up to its final amount. Safe to nest inside another `Text`; with a
 * `null` value it shows a placeholder instead of counting.
 */
export function AnimatedNumber({
  value,
  format,
  className,
  numberOfLines,
}: {
  value: number | null;
  format: (value: number) => string;
  className?: string;
  numberOfLines?: number;
}) {
  const displayedValue = useCountUp(value ?? 0);

  if (value === null) {
    return (
      <Text className={className} numberOfLines={numberOfLines}>
        {EmptyValuePlaceholder}
      </Text>
    );
  }

  const label = format(displayedValue);

  return (
    <Text className={className} numberOfLines={numberOfLines}>
      {label}
    </Text>
  );
}
