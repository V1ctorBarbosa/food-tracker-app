import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';

import {
  applyCalendarSelection,
  buildMonthGrid,
  formatMonthLabel,
  getCalendarCellState,
  groupIntoWeeks,
  shiftMonth,
  WeekdayHeaderLabels,
  type CalendarCell,
  type CalendarCellState,
} from '@/pages/charts/model/calendar-grid';
import type { DateRange } from '@/pages/charts/model/date-range';

const CalendarCellBackgroundClassNames: Record<CalendarCellState, string> = {
  unselected: '',
  single: 'bg-ft-calories',
  start: 'bg-ft-calories',
  end: 'bg-ft-calories',
  'in-range': 'bg-ft-calories/20',
};

const CalendarCellTextClassNames: Record<CalendarCellState, string> = {
  unselected: 'font-body-semibold text-xs text-ft-muted-2',
  single: 'font-body-bold text-xs text-white',
  start: 'font-body-bold text-xs text-white',
  end: 'font-body-bold text-xs text-white',
  'in-range': 'font-body-semibold text-xs text-ft-calories',
};

export function DateRangeCalendarPanel({
  initialRange,
  onConfirm,
  onCancel,
}: {
  initialRange: DateRange | null;
  onConfirm: (range: DateRange) => void;
  onCancel: () => void;
}) {
  const initialDisplayedDate = resolveInitialDisplayedDate(initialRange);
  const [displayedYear, setDisplayedYear] = useState(initialDisplayedDate.getFullYear());
  const [displayedMonthIndex, setDisplayedMonthIndex] = useState(initialDisplayedDate.getMonth());
  const [selection, setSelection] = useState<DateRange | null>(initialRange);

  const monthLabel = formatMonthLabel(displayedYear, displayedMonthIndex);
  const weekRows = groupIntoWeeks(buildMonthGrid(displayedYear, displayedMonthIndex));

  function goToPreviousMonth() {
    const shifted = shiftMonth(displayedYear, displayedMonthIndex, -1);
    setDisplayedYear(shifted.year);
    setDisplayedMonthIndex(shifted.monthIndex);
  }

  function goToNextMonth() {
    const shifted = shiftMonth(displayedYear, displayedMonthIndex, 1);
    setDisplayedYear(shifted.year);
    setDisplayedMonthIndex(shifted.monthIndex);
  }

  function handleSelectDate(date: string) {
    setSelection((currentSelection) => applyCalendarSelection(date, currentSelection));
  }

  function handleConfirm() {
    if (selection === null) {
      return;
    }

    onConfirm(selection);
  }

  return (
    <Animated.View entering={FadeInDown.duration(240)} exiting={FadeOutUp.duration(180)} className="gap-3 rounded-[20px] bg-ft-card p-4">
      <View className="flex-row items-center justify-between">
        <Pressable onPress={goToPreviousMonth} hitSlop={10} className="h-8 w-8 items-center justify-center">
          <Text className="font-display text-xl text-ft-calories">‹</Text>
        </Pressable>
        <Text className="font-body-bold text-xs uppercase tracking-widest text-ft-calories">{monthLabel}</Text>
        <Pressable onPress={goToNextMonth} hitSlop={10} className="h-8 w-8 items-center justify-center">
          <Text className="font-display text-xl text-ft-calories">›</Text>
        </Pressable>
      </View>

      <View className="flex-row justify-between">
        {WeekdayHeaderLabels.map((weekdayLabel, weekdayIndex) => (
          <Text key={weekdayIndex} className="w-8 text-center font-body-bold text-[10px] text-ft-muted-3">
            {weekdayLabel}
          </Text>
        ))}
      </View>

      <View className="gap-1.5">
        {weekRows.map((week, weekIndex) => (
          <View key={weekIndex} className="flex-row justify-between">
            {week.map((cell, cellIndex) => (
              <CalendarDayCell key={cell?.date ?? `blank-${cellIndex}`} cell={cell} selection={selection} onPress={handleSelectDate} />
            ))}
          </View>
        ))}
      </View>

      <View className="flex-row justify-end gap-3 pt-1">
        <Pressable onPress={onCancel} hitSlop={8} className="h-9 items-center justify-center px-3">
          <Text className="font-body-bold text-xs uppercase tracking-widest text-ft-muted-2">Cancelar</Text>
        </Pressable>
        <Pressable
          onPress={handleConfirm}
          disabled={selection === null}
          className="h-9 items-center justify-center rounded-full bg-ft-calories px-4 disabled:opacity-40">
          <Text className="font-body-bold text-xs uppercase tracking-widest text-white">Selecionar</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

function resolveInitialDisplayedDate(initialRange: DateRange | null): Date {
  if (initialRange === null) {
    return new Date();
  }

  return new Date(`${initialRange.to}T00:00:00`);
}

function CalendarDayCell({
  cell,
  selection,
  onPress,
}: {
  cell: CalendarCell;
  selection: DateRange | null;
  onPress: (date: string) => void;
}) {
  if (cell === null) {
    return <View className="h-8 w-8" />;
  }

  const state = getCalendarCellState(cell.date, selection);
  const dayNumberLabel = String(Number(cell.date.slice(-2)));
  const backgroundClassName = CalendarCellBackgroundClassNames[state];
  const textClassName = CalendarCellTextClassNames[state];

  return (
    <Pressable
      onPress={() => onPress(cell.date)}
      className={`h-8 w-8 items-center justify-center rounded-full ${backgroundClassName}`}>
      <Text className={textClassName}>{dayNumberLabel}</Text>
    </Pressable>
  );
}
