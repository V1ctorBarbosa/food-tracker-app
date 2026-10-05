import { useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { FadeIn, FadeOut, LinearTransition, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { MotionDurationMs } from '@/shared/lib/motion';
import { runWhilePending } from '@/shared/lib/pending-action';

const RightActionWidthPx = 84;

function buildEnteringAnimation(animateEntry: boolean) {
  if (!animateEntry) {
    return undefined;
  }

  return FadeIn.duration(MotionDurationMs.listEnter);
}

/**
 * Swipe-left-to-delete, reused everywhere an entry can be removed (meal items, water entries,
 * weight entries, whole meals). Requires `GestureHandlerRootView` at the app root (set in
 * `app/_layout.tsx`) -- `ReanimatedSwipeable` doesn't work without it.
 *
 * While `onDelete` is running the action shows a spinner and ignores further presses; the row
 * itself stays until the entry is really gone. A new row fades in and a removed one fades out,
 * while the rows around it glide to close or open the gap. Pass `animateEntry={false}` where rows
 * are swapped in for reasons other than a new entry (e.g. entering an edit mode), so they don't
 * fade in each time.
 */
export function SwipeToDeleteRow({
  children,
  onDelete,
  animateEntry = true,
}: {
  children: ReactNode;
  onDelete: () => void | Promise<void>;
  animateEntry?: boolean;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  function handlePressDelete() {
    void runWhilePending(onDelete, setIsDeleting);
  }

  return (
    <Animated.View
      entering={buildEnteringAnimation(animateEntry)}
      exiting={FadeOut.duration(MotionDurationMs.listExit)}
      layout={LinearTransition.duration(MotionDurationMs.listReflow)}>
      <ReanimatedSwipeable
        friction={2}
        rightThreshold={RightActionWidthPx / 2}
        renderRightActions={(_progress, translation) => (
          <DeleteAction translation={translation} isDeleting={isDeleting} onPress={handlePressDelete} />
        )}>
        {children}
      </ReanimatedSwipeable>
    </Animated.View>
  );
}

function DeleteAction({
  translation,
  isDeleting,
  onPress,
}: {
  translation: SharedValue<number>;
  isDeleting: boolean;
  onPress: () => void;
}) {
  // Keeps the action panel pinned to the row's revealed edge as the user drags, the same
  // translation-following technique used in react-native-gesture-handler's own Swipeable docs.
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translation.value + RightActionWidthPx }] }));

  return (
    <Animated.View style={[{ width: RightActionWidthPx }, animatedStyle]}>
      <Pressable
        onPress={onPress}
        disabled={isDeleting}
        accessibilityRole="button"
        accessibilityLabel="Excluir"
        accessibilityState={{ busy: isDeleting }}
        className="ml-2 h-full items-center justify-center rounded-2xl bg-ft-carbs">
        {isDeleting && <ActivityIndicator color="white" />}
        {!isDeleting && (
          <>
            <TrashIcon />
            <Text className="mt-1 font-body-bold text-[10px] uppercase tracking-widest text-white">Excluir</Text>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}

function TrashIcon() {
  return (
    <View className="h-4 w-3.5">
      <View className="absolute left-0 top-0 h-[2px] w-full rounded-full bg-white" />
      <View className="absolute left-0 top-[3px] h-[11px] w-full rounded-b-md border border-t-0 border-white" />
    </View>
  );
}
