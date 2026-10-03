import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { signInWithGoogle } from '@/features/auth';
import { brandStripeColors, theme } from '@/shared/config/theme';
import { resolveMotionDuration } from '@/shared/lib/motion';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { GoogleIcon } from '@/shared/ui/icons/GoogleIcon';
import { MotionEasing } from '@/shared/ui/motion-easing';

const StripeGrowDurationMs = 360;
const StripeStaggerMs = 45;
const TitleEnterDelayMs = 240;
const TitleEnterDurationMs = 320;

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
          {brandStripeColors.map((color, stripeIndex) => (
            <BrandStripe key={color} color={color} stripeIndex={stripeIndex} stripeCount={brandStripeColors.length} />
          ))}
        </View>

        <Animated.View entering={FadeInDown.delay(TitleEnterDelayMs).duration(TitleEnterDurationMs)} className="gap-2">
          <Text className="font-display text-6xl uppercase leading-[0.9] text-ft-calories">
            Food{'\n'}Track
          </Text>
          <Text className="max-w-[270px] font-body-medium text-base leading-6 text-ft-muted">
            Registre o que você come e bebe. Veja a linha se mover.
          </Text>
        </Animated.View>
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

/** Grows from the middle, the rightmost stripe first, so the bar sweeps in from right to left. */
function BrandStripe({ color, stripeIndex, stripeCount }: { color: string; stripeIndex: number; stripeCount: number }) {
  const reduceMotion = useReducedMotion();
  const scaleY = useSharedValue(0);

  useEffect(() => {
    const delayMs = resolveMotionDuration((stripeCount - 1 - stripeIndex) * StripeStaggerMs, reduceMotion);
    const durationMs = resolveMotionDuration(StripeGrowDurationMs, reduceMotion);
    scaleY.value = withDelay(delayMs, withTiming(1, { duration: durationMs, easing: MotionEasing }));
  }, [stripeIndex, stripeCount, reduceMotion, scaleY]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scaleY: scaleY.value }] }));

  // flex: 1 is inline, not a className, for the same reason as LoadingBar's segments.
  return <Animated.View style={[{ flex: 1, backgroundColor: color }, animatedStyle]} />;
}
