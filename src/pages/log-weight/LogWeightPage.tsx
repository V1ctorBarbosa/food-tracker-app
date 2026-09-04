import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDashboardQuery } from '@/entities/dashboard';
import {
  useCreateWeightEntryMutation,
  useDeleteWeightEntryMutation,
  useWeightHistoryQuery,
  type WeightEntry,
} from '@/entities/weight-entry';
import {
  convertDisplayUnitToKilograms,
  convertKilogramsToDisplayUnit,
  type WeightUnit,
} from '@/pages/log-weight/model/weight-unit-conversion';
import { daysBefore, formatDateOnly } from '@/shared/lib/date';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { LoadingBar } from '@/shared/ui/LoadingBar';
import { SwipeToDeleteRow } from '@/shared/ui/SwipeToDeleteRow';

const WeightHistoryRangeDays = 30;
const DefaultWeightKilograms = 70;
const WeightStepInDisplayUnit = 0.1;
const MinimumWeightInDisplayUnit = 0.1;
const DisplayDecimalPlaces = 1;

const HistoryDateFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'short', day: 'numeric' });

export function LogWeightPage() {
  const router = useRouter();
  const today = new Date();
  const todayDate = formatDateOnly(today);
  const rangeStartDate = formatDateOnly(daysBefore(today, WeightHistoryRangeDays - 1));

  const [unit, setUnit] = useState<WeightUnit>('Kilograms');
  const [weightKilograms, setWeightKilograms] = useState(DefaultWeightKilograms);

  const dashboardQuery = useDashboardQuery(rangeStartDate, todayDate);
  const weightHistoryQuery = useWeightHistoryQuery(rangeStartDate, todayDate);
  const createWeightEntryMutation = useCreateWeightEntryMutation();
  const deleteWeightEntryMutation = useDeleteWeightEntryMutation();

  if (dashboardQuery.isPending || weightHistoryQuery.isPending) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-ft-bg">
        <LoadingBar />
      </SafeAreaView>
    );
  }

  if (dashboardQuery.isError || weightHistoryQuery.isError) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-ft-bg px-7">
        <ErrorMessage />
      </SafeAreaView>
    );
  }

  const currentWeightKilograms = dashboardQuery.data.currentWeightKilograms;
  const targetWeightKilograms = dashboardQuery.data.targetWeightKilograms;
  const sortedHistory = weightHistoryQuery.data;
  const previousWeightKilograms = sortedHistory.length >= 2 ? sortedHistory[sortedHistory.length - 2].weightKilograms : null;
  const changeKilograms =
    previousWeightKilograms !== null && currentWeightKilograms !== null ? currentWeightKilograms - previousWeightKilograms : null;

  const displayValue = convertKilogramsToDisplayUnit(weightKilograms, unit);

  function handleSelectUnit(nextUnit: WeightUnit) {
    setUnit(nextUnit);
  }

  function handleAdjustWeight(deltaInDisplayUnit: number) {
    const nextDisplayValue = Math.max(MinimumWeightInDisplayUnit, displayValue + deltaInDisplayUnit);
    setWeightKilograms(convertDisplayUnitToKilograms(nextDisplayValue, unit));
  }

  function handleChangeWeightText(text: string) {
    const parsedDisplayValue = Number(text);
    if (text.trim().length === 0 || Number.isNaN(parsedDisplayValue)) {
      return;
    }

    setWeightKilograms(convertDisplayUnitToKilograms(Math.max(MinimumWeightInDisplayUnit, parsedDisplayValue), unit));
  }

  async function handleSave() {
    await createWeightEntryMutation.mutateAsync({ weightKilograms });
  }

  return (
    <SafeAreaView className="flex-1 bg-ft-bg">
      <View className="flex-row items-center justify-between px-7 pt-4">
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text className="font-body-semibold text-sm text-ft-muted">← Hoje</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="gap-4 px-7 pt-4 pb-8" showsVerticalScrollIndicator={false}>
        <Text className="font-display text-4xl uppercase text-ft-calories">Peso</Text>

        <View className="flex-row gap-2.5">
          <StatCard
            label="Último registro"
            value={currentWeightKilograms !== null ? `${currentWeightKilograms.toFixed(DisplayDecimalPlaces)} kg` : '—'}
          />
          <StatCard
            label="Variação"
            value={changeKilograms !== null ? `${changeKilograms >= 0 ? '+' : ''}${changeKilograms.toFixed(DisplayDecimalPlaces)}` : '—'}
          />
          <StatCard label="Meta" value={targetWeightKilograms !== null ? `${targetWeightKilograms.toFixed(DisplayDecimalPlaces)} kg` : '—'} />
        </View>

        <View className="gap-4 rounded-[22px] bg-ft-weight p-5">
          <View className="flex-row justify-center gap-2">
            <UnitToggleButton label="kg" isSelected={unit === 'Kilograms'} onPress={() => handleSelectUnit('Kilograms')} />
            <UnitToggleButton label="lb" isSelected={unit === 'Pounds'} onPress={() => handleSelectUnit('Pounds')} />
          </View>

          <View className="flex-row items-center justify-center gap-6">
            <Pressable
              onPress={() => handleAdjustWeight(-WeightStepInDisplayUnit)}
              hitSlop={12}
              className="h-10 w-10 items-center justify-center rounded-full bg-black/15">
              <Text className="font-display text-xl text-white">−</Text>
            </Pressable>
            <View className="flex-row items-baseline gap-1.5">
              <TextInput
                value={displayValue.toFixed(DisplayDecimalPlaces)}
                onChangeText={handleChangeWeightText}
                keyboardType="numeric"
                selectTextOnFocus
                className="w-28 border-0 text-center font-display text-4xl text-white outline-none"
              />
              <Text className="font-body-semibold text-sm text-white/80">{unit === 'Kilograms' ? 'kg' : 'lb'}</Text>
            </View>
            <Pressable
              onPress={() => handleAdjustWeight(WeightStepInDisplayUnit)}
              hitSlop={12}
              className="h-10 w-10 items-center justify-center rounded-full bg-black/15">
              <Text className="font-display text-xl text-white">+</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={handleSave}
            disabled={createWeightEntryMutation.isPending}
            className="h-[54px] items-center justify-center rounded-2xl bg-white disabled:opacity-40">
            {createWeightEntryMutation.isPending ? (
              <ActivityIndicator color="black" />
            ) : (
              <Text className="font-body-bold text-sm text-ft-weight">Salvar</Text>
            )}
          </Pressable>
        </View>

        {createWeightEntryMutation.isError && <ErrorMessage message="Não foi possível registrar o peso. Tente novamente." />}

        {sortedHistory.length > 0 && (
          <View className="gap-2.5">
            <Text className="font-body-bold text-[10px] uppercase tracking-widest text-ft-muted-2">Histórico</Text>
            {buildHistoryForDisplay(sortedHistory).map(({ entry, deltaKilograms }) => (
              <SwipeToDeleteRow key={entry.id} onDelete={() => deleteWeightEntryMutation.mutateAsync(entry.id)}>
                <WeightEntryRow entry={entry} deltaKilograms={deltaKilograms} />
              </SwipeToDeleteRow>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function buildHistoryForDisplay(sortedHistory: WeightEntry[]): { entry: WeightEntry; deltaKilograms: number | null }[] {
  const withDelta = sortedHistory.map((entry, index) => ({
    entry,
    deltaKilograms: index === 0 ? null : entry.weightKilograms - sortedHistory[index - 1].weightKilograms,
  }));

  return [...withDelta].reverse();
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 gap-2 rounded-[18px] bg-ft-card px-3 py-3.5">
      <Text className="font-body-bold text-[9px] uppercase tracking-widest text-ft-muted-2">{label}</Text>
      <Text className="font-display text-xl text-ft-weight">{value}</Text>
    </View>
  );
}

function UnitToggleButton({ label, isSelected, onPress }: { label: string; isSelected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className={`rounded-full px-4 py-1.5 ${isSelected ? 'bg-white' : 'bg-black/15'}`}>
      <Text className={`font-body-bold text-xs uppercase tracking-widest ${isSelected ? 'text-ft-weight' : 'text-white'}`}>{label}</Text>
    </Pressable>
  );
}

function WeightEntryRow({ entry, deltaKilograms }: { entry: WeightEntry; deltaKilograms: number | null }) {
  return (
    <View className="flex-row items-center justify-between rounded-2xl bg-ft-card px-4 py-3">
      <Text className="font-body-semibold text-sm text-ft-calories">{HistoryDateFormatter.format(new Date(entry.loggedAt))}</Text>
      <View className="flex-row items-center gap-3">
        {deltaKilograms !== null && (
          <Text className="font-body-semibold text-xs text-ft-muted-2">
            {deltaKilograms >= 0 ? '+' : ''}
            {deltaKilograms.toFixed(DisplayDecimalPlaces)}
          </Text>
        )}
        <Text className="font-body-bold text-sm text-ft-weight">{entry.weightKilograms.toFixed(DisplayDecimalPlaces)} kg</Text>
      </View>
    </View>
  );
}
