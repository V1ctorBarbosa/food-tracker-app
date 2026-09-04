import type { User } from 'firebase/auth';
import { useState } from 'react';
import { Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { signOutOfSession } from '@/features/auth';

export function HomePage({ user }: { user: User }) {
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
    <SafeAreaView className="flex-1 items-center justify-center gap-6 bg-white px-6 dark:bg-black">
      <Text className="text-center text-2xl font-semibold text-black dark:text-white">
        Welcome, {user.displayName ?? user.email}
      </Text>

      <Pressable
        onPress={handlePressSignOut}
        disabled={isSigningOut}
        className="rounded-full border border-black/20 px-6 py-3 disabled:opacity-60 dark:border-white/20">
        <Text className="text-base font-semibold text-black dark:text-white">Sign out</Text>
      </Pressable>
    </SafeAreaView>
  );
}
