import { useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { SessionState } from '@/entities/session';
import { signInWithGoogle } from '@/features/auth';
import { DeleteAccountSection } from '@/features/delete-account';
import { DeletedDataLabels, resolveDeleteAccountView } from '@/pages/delete-account/model/delete-account-view';
import { useThemeColors } from '@/shared/config/theme';
import { MotionDurationMs } from '@/shared/lib/motion';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { GoogleIcon } from '@/shared/ui/icons/GoogleIcon';
import { LoadingBar } from '@/shared/ui/LoadingBar';

const SignInFailureMessage = 'Não foi possível entrar. Tente novamente.';

/**
 * Public page for deleting an account without the app installed, as the app stores require. The
 * visitor signs in with the same Google account, then confirms the deletion.
 */
export function DeleteAccountPage({ session }: { session: SessionState }) {
  const [wasDeleted, setWasDeleted] = useState(false);
  const view = resolveDeleteAccountView(session.status, wasDeleted);

  let viewContent: ReactNode = <LoadingBar />;
  if (view === 'deleted') {
    viewContent = <DeletedNotice />;
  }
  if (view === 'sign-in') {
    viewContent = <SignInPrompt />;
  }
  if (view === 'confirm' && session.status === 'signed-in') {
    viewContent = <DeletionConfirmation email={session.user.email} onDeleted={() => setWasDeleted(true)} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-ft-bg">
      <ScrollView className="flex-1" contentContainerClassName="mx-auto w-full max-w-[480px] gap-5 px-6 pt-8 pb-10">
        <Text className="font-display text-4xl uppercase text-ft-ink">Excluir conta</Text>
        <Text className="font-body-medium text-sm leading-6 text-ft-muted-2">
          Aqui você exclui sua conta do Food Track e todos os dados ligados a ela, mesmo sem o app instalado. A exclusão é
          imediata e definitiva.
        </Text>

        <View className="gap-2 rounded-[20px] bg-ft-card px-4 py-4">
          <Text className="font-body-bold text-[10px] uppercase tracking-widest text-ft-muted-2">O que é apagado</Text>
          {DeletedDataLabels.map((label) => (
            <Text key={label} className="font-body-semibold text-sm text-ft-ink">
              • {label}
            </Text>
          ))}
        </View>

        <Text className="font-body-medium text-xs leading-5 text-ft-muted-2">
          Registros técnicos de erro do servidor podem conter o identificador da sua conta. Eles são apagados
          automaticamente em até 30 dias.
        </Text>

        <Animated.View key={view} entering={FadeIn.duration(MotionDurationMs.listEnter)} exiting={FadeOut.duration(MotionDurationMs.listExit)}>
          {viewContent}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SignInPrompt() {
  const colors = useThemeColors();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [hasSignInFailed, setHasSignInFailed] = useState(false);

  async function handlePressSignIn() {
    setHasSignInFailed(false);
    setIsSigningIn(true);

    try {
      await signInWithGoogle();
    } catch {
      setHasSignInFailed(true);
    } finally {
      setIsSigningIn(false);
    }
  }

  let buttonContent: ReactNode = (
    <>
      <GoogleIcon />
      <Text className="font-body-bold text-base text-ft-ink">Entrar com o Google</Text>
    </>
  );
  if (isSigningIn) {
    buttonContent = <ActivityIndicator color={colors.ink} />;
  }

  return (
    <View className="gap-3">
      <Text className="font-body-semibold text-sm text-ft-muted-2">
        Para confirmar que a conta é sua, entre com a mesma conta Google que você usa no app.
      </Text>
      <Pressable
        onPress={handlePressSignIn}
        disabled={isSigningIn}
        className="h-[58px] flex-row items-center justify-center gap-3 rounded-2xl bg-ft-card disabled:opacity-60">
        {buttonContent}
      </Pressable>
      {hasSignInFailed && (
        <Animated.View entering={FadeIn.duration(MotionDurationMs.listEnter)} exiting={FadeOut.duration(MotionDurationMs.listExit)}>
          <ErrorMessage message={SignInFailureMessage} />
        </Animated.View>
      )}
    </View>
  );
}

function DeletionConfirmation({ email, onDeleted }: { email: string | null; onDeleted: () => void }) {
  return (
    <View className="gap-3">
      {email !== null && (
        <Text className="font-body-semibold text-sm text-ft-muted-2">
          Conectado como <Text className="font-body-bold text-ft-ink">{email}</Text>
        </Text>
      )}
      <DeleteAccountSection onDeleted={onDeleted} />
    </View>
  );
}

function DeletedNotice() {
  return (
    <View className="gap-2 rounded-[20px] bg-ft-card px-4 py-4">
      <Text className="font-body-bold text-sm text-ft-ink">Conta excluída</Text>
      <Text className="font-body-semibold text-xs text-ft-muted-2">
        Sua conta e todos os seus dados foram apagados. Se quiser voltar a usar o Food Track, basta criar uma conta nova.
      </Text>
    </View>
  );
}
