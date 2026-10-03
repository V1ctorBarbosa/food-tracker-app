export type SwipeDirection = 'next' | 'previous';

const MinimumSwipeDistancePx = 60;
const MinimumFlingDistancePx = 20;
const MinimumFlingVelocityPxPerSecond = 800;

/**
 * Which way a horizontal swipe asks to go, or null when it was too short and slow to count.
 * Dragging the finger left reveals the next tab on the right, like turning a page; a quick flick
 * counts even when it covers little distance.
 */
export function resolveSwipeDirection(translationX: number, velocityX: number): SwipeDirection | null {
  const distance = Math.abs(translationX);
  const isLongEnough = distance >= MinimumSwipeDistancePx;
  const isFastFling = distance >= MinimumFlingDistancePx && Math.abs(velocityX) >= MinimumFlingVelocityPxPerSecond;

  if (!isLongEnough && !isFastFling) {
    return null;
  }

  if (translationX < 0) {
    return 'next';
  }

  return 'previous';
}

/** The tab next to `currentTab` in the given direction, or null at either end or for an unknown tab. */
export function resolveAdjacentTab<TabName extends string>(
  tabs: readonly TabName[],
  currentTab: string | undefined,
  direction: SwipeDirection,
): TabName | null {
  const currentIndex = tabs.findIndex((tab) => tab === currentTab);

  if (currentIndex === -1) {
    return null;
  }

  let targetIndex = currentIndex - 1;
  if (direction === 'next') {
    targetIndex = currentIndex + 1;
  }

  return tabs[targetIndex] ?? null;
}
