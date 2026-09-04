import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function ComingSoon({ title }: { title: string }) {
  return (
    <SafeAreaView className="flex-1 bg-ft-bg">
      <View className="flex-1 items-center justify-center gap-2 px-7">
        <Text className="font-display text-4xl uppercase text-ft-calories">{title}</Text>
        <Text className="text-center font-body text-sm text-ft-muted">Coming soon.</Text>
      </View>
    </SafeAreaView>
  );
}
