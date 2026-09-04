import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { signInWithGoogle } from '@/features/auth';

export function SignInPage() {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handlePressSignIn() {
    setErrorMessage(null);
    setIsSigningIn(true);

    try {
      await signInWithGoogle();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not sign in. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-center gap-6 bg-white px-6 dark:bg-black">
      <Text className="text-center text-3xl font-semibold text-black dark:text-white">Food Track</Text>

      <Pressable
        onPress={handlePressSignIn}
        disabled={isSigningIn}
        className="min-w-56 flex-row items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 disabled:opacity-60">
        {isSigningIn ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-base font-semibold text-white">Sign in with Google</Text>
        )}
      </Pressable>

      {errorMessage !== null && (
        <View>
          <Text className="text-center text-sm text-red-600 dark:text-red-400">{errorMessage}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
