import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ProfileFieldInput,
  ProfileFormSchema,
  ProfileFormSteps,
  getStepValidationMessage,
  useProfileQuery,
  useUpsertProfileMutation,
  type ProfileFormOutput,
  type ProfileFormValues,
  type UserProfile,
} from '@/entities/profile';
import { buildFormValuesFromProfile } from '@/pages/edit-profile/model/edit-profile-view';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { LoadingBar } from '@/shared/ui/LoadingBar';

export function EditProfilePage() {
  const profileQuery = useProfileQuery();

  if (profileQuery.isPending) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-ft-bg">
        <LoadingBar />
      </SafeAreaView>
    );
  }

  if (profileQuery.isError || profileQuery.data === null) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-ft-bg px-7">
        <ErrorMessage />
      </SafeAreaView>
    );
  }

  return <EditProfileForm profile={profileQuery.data} />;
}

function EditProfileForm({ profile }: { profile: UserProfile }) {
  const router = useRouter();
  const upsertProfileMutation = useUpsertProfileMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues, unknown, ProfileFormOutput>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: buildFormValuesFromProfile(profile),
  });

  async function submitProfile(updatedProfile: ProfileFormOutput) {
    await upsertProfileMutation.mutateAsync(updatedProfile);
    router.back();
  }

  const isSaving = upsertProfileMutation.isPending;

  return (
    <SafeAreaView className="flex-1 bg-ft-bg">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerClassName="gap-6 px-7 pt-4 pb-8" showsVerticalScrollIndicator={false}>
          <Pressable onPress={() => router.back()} hitSlop={12} className="self-start">
            <Text className="font-body-semibold text-sm text-ft-muted">← Você</Text>
          </Pressable>

          <Text className="font-display text-4xl uppercase text-ft-calories">Editar perfil</Text>

          {ProfileFormSteps.map((step) => {
            const validationMessage = getStepValidationMessage(step, errors[step.key] !== undefined);

            return (
              <View key={step.key} className="gap-2">
                <Text className="font-body-bold text-sm text-ft-calories">{step.question}</Text>
                <ProfileFieldInput step={step} control={control} onSubmitEditing={() => {}} />
                {validationMessage !== null && <Text className="font-body text-xs text-ft-carbs">{validationMessage}</Text>}
              </View>
            );
          })}

          {upsertProfileMutation.isError && <ErrorMessage message="Não foi possível salvar seu perfil. Tente novamente." />}

          <Pressable
            onPress={handleSubmit(submitProfile)}
            disabled={isSaving}
            className="h-[58px] items-center justify-center rounded-2xl bg-ft-calories disabled:opacity-40">
            {isSaving ? <ActivityIndicator color="white" /> : <Text className="font-body-bold text-base text-white">Salvar</Text>}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
