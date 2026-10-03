import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { LayoutAnimationConfig } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDashboardQuery } from '@/entities/dashboard';
import {
  useCreateWaterEntryMutation,
  useDeleteWaterEntryMutation,
  useTodaysWaterEntriesQuery,
  type WaterEntry,
} from '@/entities/water-entry';
import { calculateProgressPercent, formatLiters } from '@/pages/today/model/dashboard-view';
import { formatDateOnly } from '@/shared/lib/date';
import { MotionDurationMs } from '@/shared/lib/motion';
import { parseDecimalInput } from '@/shared/lib/parse-decimal';
import { AnimatedNumber } from '@/shared/ui/AnimatedNumber';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { LoadingBar } from '@/shared/ui/LoadingBar';
import { SegmentedProgressBar } from '@/shared/ui/SegmentedProgressBar';
import { SwipeToDeleteRow } from '@/shared/ui/SwipeToDeleteRow';

const WaterBarSegmentCount = 16;
const QuickAddAmountsMilliliters = [250, 500, 750, 1000];
const CustomAmountStepMilliliters = 50;
const DefaultCustomAmountMilliliters = 200;
const MinimumCustomAmountMilliliters = 1;

const EntryTimeFormatter = new Intl.DateTimeFormat('pt-BR', { hour: 'numeric', minute: '2-digit' });

export function LogWaterPage() {
  const todayDate = formatDateOnly(new Date());
  const [isCustomAmountVisible, setIsCustomAmountVisible] = useState(false);
  const [customAmountMilliliters, setCustomAmountMilliliters] = useState(DefaultCustomAmountMilliliters);

  const dashboardQuery = useDashboardQuery(todayDate, todayDate);
  const todaysEntriesQuery = useTodaysWaterEntriesQuery(todayDate);
  const createWaterEntryMutation = useCreateWaterEntryMutation();
  const deleteWaterEntryMutation = useDeleteWaterEntryMutation();

  if (dashboardQuery.isPending || todaysEntriesQuery.isPending) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-ft-bg">
        <LoadingBar />
      </SafeAreaView>
    );
  }

  if (dashboardQuery.isError || todaysEntriesQuery.isError) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-ft-bg px-7">
        <ErrorMessage />
      </SafeAreaView>
    );
  }

  const dailyTargetMilliliters = dashboardQuery.data.dailyWaterTargetMilliliters ?? 0;
  const todaysEntries = todaysEntriesQuery.data;
  const totalMilliliters = todaysEntries.reduce((sum, entry) => sum + entry.amountMilliliters, 0);

  async function handleQuickAdd(amountMilliliters: number) {
    await createWaterEntryMutation.mutateAsync({ loggedAt: new Date().toISOString(), amountMilliliters });
  }

  async function handleAddCustomAmount() {
    await createWaterEntryMutation.mutateAsync({ loggedAt: new Date().toISOString(), amountMilliliters: customAmountMilliliters });
    setIsCustomAmountVisible(false);
  }

  function handleAdjustCustomAmount(deltaMilliliters: number) {
    setCustomAmountMilliliters((previous) => Math.max(MinimumCustomAmountMilliliters, previous + deltaMilliliters));
  }

  function handleChangeCustomAmountText(text: string) {
    const parsedAmount = parseDecimalInput(text);
    if (parsedAmount === null) {
      return;
    }

    setCustomAmountMilliliters(Math.max(MinimumCustomAmountMilliliters, parsedAmount));
  }

  return (
    <SafeAreaView className="flex-1 bg-ft-bg">
      <ScrollView className="flex-1" contentContainerClassName="gap-4 px-7 pt-5 pb-8" showsVerticalScrollIndicator={false}>
        <Text className="font-display text-4xl uppercase text-ft-calories">Água</Text>

        <View className="gap-3 rounded-[22px] bg-ft-water p-5">
          <View className="flex-row items-baseline justify-between">
            <Text className="font-body-bold text-xs uppercase tracking-widest text-sky-100">Hoje</Text>
            <Text className="font-display text-2xl text-white">
              <AnimatedNumber value={totalMilliliters} format={formatLiters} />
              <Text className="font-body-semibold text-sm"> / {formatLiters(dailyTargetMilliliters)} L</Text>
            </Text>
          </View>
          <SegmentedProgressBar
            segmentCount={WaterBarSegmentCount}
            progressPercent={calculateProgressPercent(totalMilliliters, dailyTargetMilliliters)}
            filledColorClassName="bg-ft-water-dark"
            durationMs={MotionDurationMs.countUp}
          />
        </View>

        <View className="gap-2.5">
          <View className="flex-row gap-2.5">
            {QuickAddAmountsMilliliters.slice(0, 2).map((amountMilliliters) => (
              <QuickAddButton
                key={amountMilliliters}
                amountMilliliters={amountMilliliters}
                disabled={createWaterEntryMutation.isPending}
                onPress={() => handleQuickAdd(amountMilliliters)}
              />
            ))}
          </View>
          <View className="flex-row gap-2.5">
            {QuickAddAmountsMilliliters.slice(2).map((amountMilliliters) => (
              <QuickAddButton
                key={amountMilliliters}
                amountMilliliters={amountMilliliters}
                disabled={createWaterEntryMutation.isPending}
                onPress={() => handleQuickAdd(amountMilliliters)}
              />
            ))}
          </View>
        </View>

        <Pressable onPress={() => setIsCustomAmountVisible((previous) => !previous)} hitSlop={8}>
          <Text className="font-body-semibold text-sm text-ft-water-dark">
            {isCustomAmountVisible ? 'Cancelar quantidade personalizada' : 'Quantidade personalizada'}
          </Text>
        </Pressable>

        {isCustomAmountVisible && (
          <View className="gap-4 rounded-[22px] bg-ft-card p-5">
            <View className="flex-row items-center justify-center gap-6">
              <Pressable
                onPress={() => handleAdjustCustomAmount(-CustomAmountStepMilliliters)}
                hitSlop={12}
                className="h-10 w-10 items-center justify-center rounded-full bg-ft-water">
                <Text className="font-display text-xl text-white">−</Text>
              </Pressable>
              <View className="flex-row items-baseline gap-1.5">
                <TextInput
                  value={String(customAmountMilliliters)}
                  onChangeText={handleChangeCustomAmountText}
                  keyboardType="numeric"
                  selectTextOnFocus
                  className="w-24 border-0 text-center font-display text-4xl text-ft-calories outline-none"
                />
                <Text className="font-body-semibold text-sm text-ft-muted-2">ml</Text>
              </View>
              <Pressable
                onPress={() => handleAdjustCustomAmount(CustomAmountStepMilliliters)}
                hitSlop={12}
                className="h-10 w-10 items-center justify-center rounded-full bg-ft-water">
                <Text className="font-display text-xl text-white">+</Text>
              </Pressable>
            </View>
            <Pressable
              onPress={handleAddCustomAmount}
              disabled={createWaterEntryMutation.isPending}
              className="h-[54px] items-center justify-center rounded-2xl bg-ft-water disabled:opacity-40">
              {createWaterEntryMutation.isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="font-body-bold text-sm text-white">Adicionar</Text>
              )}
            </Pressable>
          </View>
        )}

        {createWaterEntryMutation.isError && <ErrorMessage message="Não foi possível registrar a água. Tente novamente." />}
        {deleteWaterEntryMutation.isError && <ErrorMessage message="Não foi possível remover o registro. Tente novamente." />}

        {todaysEntries.length > 0 && (
          <LayoutAnimationConfig skipEntering>
            <View className="gap-2.5">
              <Text className="font-body-bold text-[10px] uppercase tracking-widest text-ft-muted-2">Registrado hoje</Text>
              {todaysEntries.map((entry) => (
                <SwipeToDeleteRow key={entry.id} onDelete={() => deleteWaterEntryMutation.mutateAsync(entry.id)}>
                  <WaterEntryRow entry={entry} />
                </SwipeToDeleteRow>
              ))}
            </View>
          </LayoutAnimationConfig>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickAddButton({
  amountMilliliters,
  disabled,
  onPress,
}: {
  amountMilliliters: number;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className="flex-1 items-center justify-center gap-1 rounded-2xl bg-ft-card py-4 disabled:opacity-40">
      <Text className="font-display text-2xl text-ft-water-dark">{amountMilliliters}</Text>
      <Text className="font-body-semibold text-[10px] uppercase tracking-widest text-ft-muted-2">ml</Text>
    </Pressable>
  );
}

function WaterEntryRow({ entry }: { entry: WaterEntry }) {
  return (
    <View className="flex-row items-center justify-between rounded-2xl bg-ft-card px-4 py-3">
      <Text className="font-body-semibold text-sm text-ft-calories">{entry.amountMilliliters} ml</Text>
      <Text className="font-body text-xs text-ft-muted-2">{EntryTimeFormatter.format(new Date(entry.loggedAt))}</Text>
    </View>
  );
}
