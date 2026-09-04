import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { signInWithGoogle } from '@/features/auth';
import { theme } from '@/shared/config/theme';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
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
      setErrorMessage(error instanceof Error ? error.message : 'Não foi possível entrar. Tente novamente.');
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
            Registre o que você come e bebe. Veja a linha se mover.
          </Text>
        </View>
      </View>

      <View className="gap-3.5 px-7 pb-10">
        <Pressable
          onPress={handlePressSignIn}
          disabled={isSigningIn}
          className="h-[58px] flex-row items-center justify-center gap-3 rounded-2xl bg-ft-card disabled:opacity-60">
          {isSigningIn ? (
            <ActivityIndicator color={theme.light.calories} />
          ) : (
            <>
              <GoogleIcon />
              <Text className="font-body-bold text-base text-ft-calories">Continuar com o Google</Text>
            </>
          )}
        </Pressable>

        <Text className="text-center font-body text-xs leading-5 text-ft-muted-2">
          Por enquanto, o Google é a única forma de entrar.{'\n'}Email e Apple chegam em breve.
        </Text>

        {errorMessage !== null && <ErrorMessage message={errorMessage} />}
      </View>
    </SafeAreaView>
  );
}
