import { useRouter, useSegments } from 'expo-router';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { TabHrefs, TabNames } from '@/shared/config/tabs';
import { resolveAdjacentTab, resolveSwipeDirection } from '@/shared/lib/tab-swipe';

const HorizontalActivationPx = 20;
const VerticalFailPx = 15;

/**
 * Lets a horizontal swipe move to the neighbouring tab. The pan only takes over once the finger
 * has travelled sideways, and gives way as soon as it travels vertically, so scrolling a screen
 * still works. The tab change itself reuses the tab navigator's own shift animation.
 */
export function SwipeBetweenTabs({ children }: { children: ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const currentTab: string | undefined = segments[segments.length - 1];

  const swipeGesture = Gesture.Pan()
    .runOnJS(true)
    .activeOffsetX([-HorizontalActivationPx, HorizontalActivationPx])
    .failOffsetY([-VerticalFailPx, VerticalFailPx])
    .onEnd((event) => {
      const direction = resolveSwipeDirection(event.translationX, event.velocityX);
      if (direction === null) {
        return;
      }

      const targetTab = resolveAdjacentTab(TabNames, currentTab, direction);
      if (targetTab === null) {
        return;
      }

      router.navigate(TabHrefs[targetTab]);
    });

  return (
    <GestureDetector gesture={swipeGesture}>
      <View style={{ flex: 1 }}>{children}</View>
    </GestureDetector>
  );
}
