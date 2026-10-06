import { useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutUp, LinearTransition } from 'react-native-reanimated';

import { theme } from '@/shared/config/theme';
import { MotionDurationMs } from '@/shared/lib/motion';

import { useDeleteAccountMutation } from '../model/use-delete-account-mutation';

const ConfirmationMessage =
  'Isso apaga para sempre suas refeições, pesos, registros de água, alimentos personalizados e seu perfil. Não dá para desfazer.';
const FailureMessage = 'Não foi possível excluir sua conta. Tente de novo.';

// The confirm button is the same red in both themes, so its spinner needs a light tone in both too.
const SpinnerOnCarbsColor = theme.light.card;

/**
 * Account deletion behind an explicit second step. An inline panel instead of a native alert,
 * because React Native's Alert does not show buttons on web.
 */
export function DeleteAccountSection({ onDeleted }: { onDeleted?: () => void }) {
  const deleteAccountMutation = useDeleteAccountMutation({ onDeleted });
  const [isConfirming, setIsConfirming] = useState(false);

  function handlePressCancel() {
    deleteAccountMutation.reset();
    setIsConfirming(false);
  }

  let confirmButtonContent: ReactNode = (
    <Text className="font-body-bold text-xs uppercase tracking-widest text-white">Excluir para sempre</Text>
  );
  if (deleteAccountMutation.isPending) {
    confirmButtonContent = <ActivityIndicator color={SpinnerOnCarbsColor} />;
  }

  return (
    <Animated.View layout={LinearTransition.duration(MotionDurationMs.listReflow)}>
      {!isConfirming && (
        <Animated.View entering={FadeIn.duration(MotionDurationMs.listEnter)} exiting={FadeOut.duration(MotionDurationMs.listExit)}>
          <Pressable onPress={() => setIsConfirming(true)} hitSlop={8} className="h-11 items-center justify-center">
            <Text className="font-body-bold text-xs uppercase tracking-widest text-ft-muted-2">Excluir conta</Text>
          </Pressable>
        </Animated.View>
      )}

      {isConfirming && (
        <Animated.View
          entering={FadeInDown.duration(MotionDurationMs.listEnter)}
          exiting={FadeOutUp.duration(MotionDurationMs.listExit)}
          className="gap-3 rounded-[20px] bg-ft-card px-4 py-4">
          <Text className="font-body-bold text-sm text-ft-ink">Excluir sua conta?</Text>
          <Text className="font-body-semibold text-xs text-ft-muted-2">{ConfirmationMessage}</Text>

          {deleteAccountMutation.isError && (
            <Animated.Text
              entering={FadeIn.duration(MotionDurationMs.listEnter)}
              exiting={FadeOut.duration(MotionDurationMs.listExit)}
              className="font-body-semibold text-xs text-ft-carbs-ink">
              {FailureMessage}
            </Animated.Text>
          )}

          <Animated.View layout={LinearTransition.duration(MotionDurationMs.listReflow)} className="flex-row justify-end gap-3 pt-1">
            <Pressable
              onPress={handlePressCancel}
              disabled={deleteAccountMutation.isPending}
              hitSlop={8}
              className="h-9 items-center justify-center px-3 disabled:opacity-40">
              <Text className="font-body-bold text-xs uppercase tracking-widest text-ft-muted-2">Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={() => deleteAccountMutation.mutate()}
              disabled={deleteAccountMutation.isPending}
              className="h-9 min-w-[160px] items-center justify-center rounded-full bg-ft-carbs px-4 disabled:opacity-60">
              {confirmButtonContent}
            </Pressable>
          </Animated.View>
        </Animated.View>
      )}
    </Animated.View>
  );
}
