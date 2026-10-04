import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { dayFromDaysBack, daysBackFromDay } from './logged-at';

type SelectedDayValue = {
  /** How many days before today the selected day is; 0 is today. */
  daysBack: number;
  /** The selected day as a DateOnly string, e.g. "2026-09-04". */
  day: string;
  selectDay: (day: string) => void;
  resetToToday: () => void;
};

const SelectedDayContext = createContext<SelectedDayValue | null>(null);

/**
 * The day the user is filling in. Kept as a distance from today rather than a fixed date, so
 * "Hoje" stays today if the app is left open past midnight. It starts at today on every launch.
 */
export function SelectedDayProvider({ children }: { children: ReactNode }) {
  const [daysBack, setDaysBack] = useState(0);
  const day = dayFromDaysBack(daysBack, new Date());

  const value = useMemo<SelectedDayValue>(
    () => ({
      daysBack,
      day,
      selectDay: (selectedDay) => setDaysBack(daysBackFromDay(selectedDay, new Date())),
      resetToToday: () => setDaysBack(0),
    }),
    [daysBack, day],
  );

  return <SelectedDayContext.Provider value={value}>{children}</SelectedDayContext.Provider>;
}

export function useSelectedDay(): SelectedDayValue {
  const value = useContext(SelectedDayContext);

  if (value === null) {
    throw new Error('useSelectedDay must be used inside a SelectedDayProvider.');
  }

  return value;
}
