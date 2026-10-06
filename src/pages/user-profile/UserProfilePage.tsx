import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useProfileQuery } from '@/entities/profile';
import { signOutOfSession } from '@/features/auth';
import { DeleteAccountSection } from '@/features/delete-account';
import { useNightMode } from '@/features/theme';
import { buildBodyStatRows, buildTargetRows, type ProfileStatRow } from '@/pages/user-profile/model/profile-view';
import type { AuthUser } from '@/shared/api/auth-gateway';
import { useThemeColors } from '@/shared/config/theme';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { LoadingBar } from '@/shared/ui/LoadingBar';
import { ToggleSwitch } from '@/shared/ui/ToggleSwitch';

export function UserProfilePage({ user }: { user: AuthUser }) {
  const router = useRouter();
  const profileQuery = useProfileQuery();
  const { isNightMode, toggleNightMode } = useNightMode();
  const themeColors = useThemeColors();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handlePressSignOut() {
    setIsSigningOut(true);

    try {
      await signOutOfSession();
    } finally {
      setIsSigningOut(false);
    }
  }

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

  const profile = profileQuery.data;
  const bodyRows = buildBodyStatRows(profile);
  const targetRows = buildTargetRows(profile);

  return (
    <SafeAreaView className="flex-1 bg-ft-bg">
      <ScrollView className="flex-1" contentContainerClassName="gap-4 px-6 pt-5 pb-8" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between">
          <Text className="font-display text-4xl uppercase text-ft-ink">Você</Text>
          <Pressable onPress={() => router.push('/edit-profile')} hitSlop={12}>
            <Text className="font-body-bold text-xs uppercase tracking-widest text-ft-ink">Editar</Text>
          </Pressable>
        </View>

        <View className="gap-1 rounded-[20px] bg-ft-card px-4 py-4">
          <Text numberOfLines={1} className="font-display text-2xl text-ft-ink">
            {profile.name}
          </Text>
          {user.email !== null && (
            <Text numberOfLines={1} className="font-body-semibold text-xs text-ft-muted-2">
              {user.email}
            </Text>
          )}
        </View>

        <ProfileSection title="Corpo" rows={bodyRows} />
        <ProfileSection title="Metas diárias" rows={targetRows} />

        <View className="gap-2">
          <Text className="font-body-bold text-[10px] uppercase tracking-widest text-ft-muted-2">Aparência</Text>
          <Pressable
            onPress={toggleNightMode}
            accessibilityRole="switch"
            accessibilityState={{ checked: isNightMode }}
            className="flex-row items-center justify-between rounded-[20px] bg-ft-card px-4 py-3">
            <Text className="font-body-semibold text-sm text-ft-muted-2">Modo noturno</Text>
            <ToggleSwitch isOn={isNightMode} />
          </Pressable>
        </View>

        <Pressable
          onPress={handlePressSignOut}
          disabled={isSigningOut}
          className="h-[52px] items-center justify-center rounded-full border border-ft-carbs/30 disabled:opacity-50">
          {isSigningOut ? (
            <ActivityIndicator color={themeColors.ink} />
          ) : (
            <Text className="font-body-bold text-sm uppercase tracking-widest text-ft-carbs-ink">Sair</Text>
          )}
        </Pressable>

        <DeleteAccountSection />
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileSection({ title, rows }: { title: string; rows: ProfileStatRow[] }) {
  return (
    <View className="gap-2">
      <Text className="font-body-bold text-[10px] uppercase tracking-widest text-ft-muted-2">{title}</Text>
      <View className="rounded-[20px] bg-ft-card px-4">
        {rows.map((row, rowIndex) => (
          <ProfileStatRowView key={row.label} row={row} isLast={rowIndex === rows.length - 1} />
        ))}
      </View>
    </View>
  );
}

function ProfileStatRowView({ row, isLast }: { row: ProfileStatRow; isLast: boolean }) {
  const colors = useThemeColors();
  let borderClassName = 'border-b';
  if (isLast) {
    borderClassName = '';
  }

  return (
    <View className={`flex-row items-center justify-between py-3 ${borderClassName}`} style={{ borderColor: colors.hair }}>
      <Text className="font-body-semibold text-sm text-ft-muted-2">{row.label}</Text>
      <Text numberOfLines={1} className="font-body-bold text-sm text-ft-ink">
        {row.value}
      </Text>
    </View>
  );
}
