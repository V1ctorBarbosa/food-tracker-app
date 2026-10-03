import type { Href } from 'expo-router';

/** The bottom tabs in the order they appear, which is also the order swiping steps through. */
export const TabNames = ['today', 'log', 'charts', 'you'] as const;

export type TabName = (typeof TabNames)[number];

export const TabHrefs: Record<TabName, Href> = {
  today: '/today',
  log: '/log',
  charts: '/charts',
  you: '/you',
};
