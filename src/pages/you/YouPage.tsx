import type { User } from 'firebase/auth';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { signOutOfSession } from '@/features/auth';

export function YouPage({ user }: { user: User }) {
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handlePressSignOut() {
    setIsSigningOut(true);

    try {
      await signOutOfSession();
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-ft-bg">
      <View className="flex-1 items-center justify-center gap-6 px-7">
        <Text className="text-center font-display text-4xl uppercase text-ft-calories">
          {user.displayName ?? user.email}
        </Text>

        <Pressable
          onPress={handlePressSignOut}
          disabled={isSigningOut}
          className="rounded-full border border-ft-calories/20 px-6 py-3 disabled:opacity-60">
          <Text className="font-body-bold text-base text-ft-calories">Sair</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
