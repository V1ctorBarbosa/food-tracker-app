import { useRouter } from 'expo-router';
import type { User } from 'firebase/auth';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useProfileQuery } from '@/entities/profile';
import { signOutOfSession } from '@/features/auth';
import { buildBodyStatRows, buildTargetRows, type ProfileStatRow } from '@/pages/you/model/profile-view';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { LoadingBar } from '@/shared/ui/LoadingBar';

export function YouPage({ user }: { user: User }) {
  const router = useRouter();
  const profileQuery = useProfileQuery();
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
          <Text className="font-display text-5xl uppercase text-ft-calories">Você</Text>
          <Pressable onPress={() => router.push('/edit-profile')} hitSlop={12}>
            <Text className="font-body-bold text-xs uppercase tracking-widest text-ft-calories">Editar</Text>
          </Pressable>
        </View>

        <View className="gap-1 rounded-[20px] bg-ft-card px-4 py-4">
          <Text numberOfLines={1} className="font-display text-2xl text-ft-calories">
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

        <Pressable
          onPress={handlePressSignOut}
          disabled={isSigningOut}
          className="h-[52px] items-center justify-center rounded-full border border-ft-carbs/30 disabled:opacity-50">
          {isSigningOut ? (
            <ActivityIndicator color="black" />
          ) : (
            <Text className="font-body-bold text-sm uppercase tracking-widest text-ft-carbs">Sair</Text>
          )}
        </Pressable>
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
  const borderClassName = isLast ? '' : 'border-b border-black/5';

  return (
    <View className={`flex-row items-center justify-between py-3 ${borderClassName}`}>
      <Text className="font-body-semibold text-sm text-ft-muted-2">{row.label}</Text>
      <Text numberOfLines={1} className="font-body-bold text-sm text-ft-calories">
        {row.value}
      </Text>
    </View>
  );
}
