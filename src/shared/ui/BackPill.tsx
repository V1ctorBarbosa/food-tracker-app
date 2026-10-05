import { Pressable, Text, View } from 'react-native';

/** Round "back" button: a chevron and a label, on the card surface so it reads in both themes. */
export function BackPill({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      className="h-10 flex-row items-center gap-2 rounded-full bg-ft-card pl-3 pr-4">
      <View className="ml-1 h-2 w-2 rotate-45 border-b-[2.5px] border-l-[2.5px] border-ft-ink" />
      <Text className="font-body-bold text-sm text-ft-ink">{label}</Text>
    </Pressable>
  );
}
