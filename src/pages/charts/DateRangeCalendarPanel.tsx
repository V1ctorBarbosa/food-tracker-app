import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';

import {
  applyCalendarSelection,
  buildMonthGrid,
  formatMonthLabel,
  getCalendarCellState,
  groupIntoWeeks,
  isCurrentOrFutureMonth,
  isDateSelectable,
  shiftMonth,
  WeekdayHeaderLabels,
  type CalendarCell,
  type CalendarCellState,
} from '@/pages/charts/model/calendar-grid';
import type { DateRange } from '@/pages/charts/model/date-range';
import { formatDateOnly } from '@/shared/lib/date';

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
  'in-range': 'font-body-semibold text-xs text-ft-ink',
};

const DisabledCalendarCellTextClassName = 'font-body-semibold text-xs text-ft-muted-3/50';

// Suppresses the browser's default focus outline that Pressable inherits on web, which otherwise
// draws a ring on top of the just-tapped day and makes it look like the selection didn't register.
const NoWebFocusOutlineStyle = { outlineStyle: 'none' } as Record<string, string>;

export function DateRangeCalendarPanel({
  initialRange,
  today,
  onConfirm,
  onCancel,
}: {
  initialRange: DateRange | null;
  today: Date;
  onConfirm: (range: DateRange) => void;
  onCancel: () => void;
}) {
  const initialDisplayedDate = resolveInitialDisplayedDate(initialRange, today);
  const [displayedYear, setDisplayedYear] = useState(initialDisplayedDate.getFullYear());
  const [displayedMonthIndex, setDisplayedMonthIndex] = useState(initialDisplayedDate.getMonth());
  const [selection, setSelection] = useState<DateRange | null>(initialRange);

  const maxSelectableDate = formatDateOnly(today);
  const monthLabel = formatMonthLabel(displayedYear, displayedMonthIndex);
  const weekRows = groupIntoWeeks(buildMonthGrid(displayedYear, displayedMonthIndex));
  const isNextMonthDisabled = isCurrentOrFutureMonth(displayedYear, displayedMonthIndex, today);

  function goToPreviousMonth() {
    const shifted = shiftMonth(displayedYear, displayedMonthIndex, -1);
    setDisplayedYear(shifted.year);
    setDisplayedMonthIndex(shifted.monthIndex);
  }

  function goToNextMonth() {
    if (isNextMonthDisabled) {
      return;
    }

    const shifted = shiftMonth(displayedYear, displayedMonthIndex, 1);
    setDisplayedYear(shifted.year);
    setDisplayedMonthIndex(shifted.monthIndex);
  }

  function handleSelectDate(date: string) {
    if (!isDateSelectable(date, maxSelectableDate, selection)) {
      return;
    }

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
        <Pressable
          onPress={goToPreviousMonth}
          hitSlop={10}
          style={NoWebFocusOutlineStyle}
          className="h-8 w-8 items-center justify-center">
          <Text className="font-display text-xl text-ft-ink">‹</Text>
        </Pressable>
        <Text className="font-body-bold text-xs uppercase tracking-widest text-ft-ink">{monthLabel}</Text>
        <Pressable
          onPress={goToNextMonth}
          disabled={isNextMonthDisabled}
          hitSlop={10}
          style={NoWebFocusOutlineStyle}
          className="h-8 w-8 items-center justify-center disabled:opacity-30">
          <Text className="font-display text-xl text-ft-ink">›</Text>
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
              <CalendarDayCell
                key={cell?.date ?? `blank-${cellIndex}`}
                cell={cell}
                selection={selection}
                maxSelectableDate={maxSelectableDate}
                onPress={handleSelectDate}
              />
            ))}
          </View>
        ))}
      </View>

      <View className="flex-row justify-end gap-3 pt-1">
        <Pressable onPress={onCancel} hitSlop={8} style={NoWebFocusOutlineStyle} className="h-9 items-center justify-center px-3">
          <Text className="font-body-bold text-xs uppercase tracking-widest text-ft-muted-2">Cancelar</Text>
        </Pressable>
        <Pressable
          onPress={handleConfirm}
          disabled={selection === null}
          style={NoWebFocusOutlineStyle}
          className="h-9 items-center justify-center rounded-full bg-ft-calories px-4 disabled:opacity-40">
          <Text className="font-body-bold text-xs uppercase tracking-widest text-white">Selecionar</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

function resolveInitialDisplayedDate(initialRange: DateRange | null, today: Date): Date {
  if (initialRange === null) {
    return today;
  }

  return new Date(`${initialRange.to}T00:00:00`);
}

function CalendarDayCell({
  cell,
  selection,
  maxSelectableDate,
  onPress,
}: {
  cell: CalendarCell;
  selection: DateRange | null;
  maxSelectableDate: string;
  onPress: (date: string) => void;
}) {
  if (cell === null) {
    return <View className="h-8 w-8" />;
  }

  const isSelectable = isDateSelectable(cell.date, maxSelectableDate, selection);
  const state = getCalendarCellState(cell.date, selection);
  const dayNumberLabel = String(Number(cell.date.slice(-2)));
  const backgroundClassName = CalendarCellBackgroundClassNames[state];

  let textClassName = CalendarCellTextClassNames[state];
  if (!isSelectable) {
    textClassName = DisabledCalendarCellTextClassName;
  }

  return (
    <Pressable
      onPress={() => onPress(cell.date)}
      disabled={!isSelectable}
      style={NoWebFocusOutlineStyle}
      className={`h-8 w-8 items-center justify-center rounded-full ${backgroundClassName}`}>
      <Text className={textClassName}>{dayNumberLabel}</Text>
    </Pressable>
  );
}
