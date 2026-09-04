import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { signInWithGoogle } from '@/features/auth';
import { GoogleIcon } from '@/shared/ui/icons/GoogleIcon';

const StripeColorClasses = [
  'bg-ft-calories',
  'bg-ft-protein',
  'bg-ft-carbs',
  'bg-ft-fat',
  'bg-ft-weight',
];

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
    <SafeAreaView className="flex-1 bg-ft-bg">
      <View className="flex-1 justify-center gap-8 px-7">
        <View className="h-32 flex-row overflow-hidden rounded-2xl">
          {StripeColorClasses.map((colorClassName) => (
            <View key={colorClassName} className={`flex-1 ${colorClassName}`} />
          ))}
        </View>

        <View className="gap-2">
          <Text className="font-display text-6xl uppercase leading-[0.9] text-ft-calories">
            Food{'\n'}Track
          </Text>
          <Text className="max-w-[270px] font-body-medium text-base leading-6 text-ft-muted">
            Log what you eat and drink. Watch the line move.
          </Text>
        </View>
      </View>

      <View className="gap-3.5 px-7 pb-10">
        <Pressable
          onPress={handlePressSignIn}
          disabled={isSigningIn}
          className="h-[58px] flex-row items-center justify-center gap-3 rounded-2xl bg-ft-card disabled:opacity-60">
          {isSigningIn ? (
            <ActivityIndicator color="#274F8C" />
          ) : (
            <>
              <GoogleIcon />
              <Text className="font-body-bold text-base text-ft-calories">Continue with Google</Text>
            </>
          )}
        </Pressable>

        <Text className="text-center font-body text-xs leading-5 text-ft-muted-2">
          Google is the only sign-in method for now.{'\n'}Email and Apple come later.
        </Text>

        {errorMessage !== null && (
          <Text className="text-center font-body text-sm text-ft-carbs">{errorMessage}</Text>
        )}
      </View>
    </SafeAreaView>
  );
}
