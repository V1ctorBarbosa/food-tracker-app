import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSelectedDay } from '@/entities/selected-day';
import {
  buildMonthGrid,
  formatMonthLabel,
  groupIntoWeeks,
  isCurrentOrFutureMonth,
  shiftMonth,
  WeekdayHeaderLabels,
  type CalendarCell,
} from '@/pages/charts/model/calendar-grid';
import { resolveDayCellState, type DayCellState } from '@/pages/day-picker/model/day-picker-view';
import { formatDateOnly, parseDateOnly } from '@/shared/lib/date';

const BackdropEnterMs = 300;
const SheetEnterMs = 340;
const SheetExitMs = 260;
const BottomPaddingMinimumPx = 24;

const DayCellContainerClassNames: Record<DayCellState, string> = {
  selected: 'bg-ft-calories',
  today: 'border-[1.5px] border-ft-ink',
  future: 'opacity-40',
  default: '',
};

const DayCellTextClassNames: Record<DayCellState, string> = {
  selected: 'font-body-semibold text-sm text-white',
  today: 'font-body-semibold text-sm text-ft-ink',
  future: 'font-body-semibold text-sm text-ft-muted-3',
  default: 'font-body-semibold text-sm text-ft-ink',
};

// Suppresses the browser's default focus outline that Pressable inherits on web.
const NoWebFocusOutlineStyle = { outlineStyle: 'none' } as Record<string, string>;

/**
 * Bottom sheet for choosing the day to fill in. It animates itself, backdrop fading while the
 * sheet slides up, and waits for the exit animation before leaving the screen.
 */
export function DayPickerPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { day: selectedDay, selectDay, resetToToday } = useSelectedDay();
  const initialMonth = parseDateOnly(selectedDay);
  const [isOpen, setIsOpen] = useState(true);
  const [visibleMonth, setVisibleMonth] = useState({ year: initialMonth.getFullYear(), monthIndex: initialMonth.getMonth() });

  const now = new Date();
  const today = formatDateOnly(now);
  const monthLabel = formatMonthLabel(visibleMonth.year, visibleMonth.monthIndex);
  const weekRows = groupIntoWeeks(buildMonthGrid(visibleMonth.year, visibleMonth.monthIndex));
  const isNextMonthDisabled = isCurrentOrFutureMonth(visibleMonth.year, visibleMonth.monthIndex, now);
  const bottomPaddingPx = Math.max(insets.bottom, BottomPaddingMinimumPx);

  function dismiss() {
    if (!isOpen) {
      return;
    }

    setIsOpen(false);
    setTimeout(() => router.back(), SheetExitMs);
  }

  function handleSelectDay(date: string) {
    selectDay(date);
    dismiss();
  }

  function handleGoToToday() {
    resetToToday();
    dismiss();
  }

  function goToPreviousMonth() {
    setVisibleMonth((current) => shiftMonth(current.year, current.monthIndex, -1));
  }

  function goToNextMonth() {
    if (isNextMonthDisabled) {
      return;
    }

    setVisibleMonth((current) => shiftMonth(current.year, current.monthIndex, 1));
  }

  return (
    <View className="flex-1 justify-end">
      {isOpen && (
        <Animated.View
          entering={FadeIn.duration(BackdropEnterMs)}
          exiting={FadeOut.duration(SheetExitMs)}
          style={StyleSheet.absoluteFill}>
          <Pressable onPress={dismiss} style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(12, 29, 51, 0.38)' }]} />
        </Animated.View>
      )}

      {isOpen && (
        <Animated.View
          entering={SlideInDown.duration(SheetEnterMs)}
          exiting={SlideOutDown.duration(SheetExitMs)}
          className="gap-4 rounded-t-[28px] bg-ft-bg px-6 pt-2.5"
          style={{ paddingBottom: bottomPaddingPx }}>
          <View className="items-center">
            <View className="h-[5px] w-10 rounded-[3px] bg-ft-hair-strong" />
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="font-display text-2xl uppercase text-ft-ink">Escolher dia</Text>
            <Pressable onPress={dismiss} hitSlop={10} style={NoWebFocusOutlineStyle}>
              <Text className="font-body-semibold text-sm text-ft-muted">Fechar</Text>
            </Pressable>
          </View>

          <View className="flex-row items-center justify-between rounded-2xl bg-ft-card p-1.5">
            <Pressable
              onPress={goToPreviousMonth}
              style={NoWebFocusOutlineStyle}
              className="h-10 w-10 items-center justify-center rounded-xl">
              <Text className="font-body-bold text-xl text-ft-ink">‹</Text>
            </Pressable>
            <Text className="font-body-bold text-[15px] text-ft-ink">{monthLabel}</Text>
            <Pressable
              onPress={goToNextMonth}
              disabled={isNextMonthDisabled}
              style={NoWebFocusOutlineStyle}
              className="h-10 w-10 items-center justify-center rounded-xl disabled:opacity-25">
              <Text className="font-body-bold text-xl text-ft-ink">›</Text>
            </Pressable>
          </View>

          <View>
            <View className="flex-row">
              {WeekdayHeaderLabels.map((weekdayLabel, weekdayIndex) => (
                <Text key={weekdayIndex} className="flex-1 pb-1.5 text-center font-body-bold text-[10px] tracking-widest text-ft-muted-2">
                  {weekdayLabel}
                </Text>
              ))}
            </View>
            {weekRows.map((week, weekIndex) => (
              <View key={weekIndex} className="flex-row">
                {week.map((cell, cellIndex) => (
                  <DayCell
                    key={cell?.date ?? `blank-${cellIndex}`}
                    cell={cell}
                    selectedDay={selectedDay}
                    today={today}
                    onPress={handleSelectDay}
                  />
                ))}
              </View>
            ))}
          </View>

          <Pressable
            onPress={handleGoToToday}
            style={NoWebFocusOutlineStyle}
            className="h-[52px] items-center justify-center rounded-2xl border border-ft-ink">
            <Text className="font-body-bold text-sm text-ft-ink">Ir para hoje</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

function DayCell({
  cell,
  selectedDay,
  today,
  onPress,
}: {
  cell: CalendarCell;
  selectedDay: string;
  today: string;
  onPress: (date: string) => void;
}) {
  if (cell === null) {
    return <View className="h-[42px] flex-1" />;
  }

  const state = resolveDayCellState(cell.date, selectedDay, today);
  const dayNumberLabel = String(Number(cell.date.slice(-2)));

  return (
    <View className="h-[42px] flex-1 items-center justify-center">
      <Pressable
        onPress={() => onPress(cell.date)}
        disabled={state === 'future'}
        style={NoWebFocusOutlineStyle}
        className={`h-[38px] w-[38px] items-center justify-center rounded-full ${DayCellContainerClassNames[state]}`}>
        <Text className={DayCellTextClassNames[state]}>{dayNumberLabel}</Text>
      </Pressable>
    </View>
  );
}
