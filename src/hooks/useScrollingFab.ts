import { type RefObject, useCallback, useEffect, useState } from "react";
import { type FlatList } from "react-native";

import { type ScrollEvent } from "@typings/app.types";

import { useScrollViewScrolling } from "./useScrollViewScrolling";

interface ScrollingFabProps {
  /** Whether to scroll to top when screen is blurred */
  scrollToTopOnBlur?: boolean;
}

interface ScrollingFab {
  /** Clear scroll direction */
  clearScroll: () => void;
  /** Whether FAB should be visible */
  fabVisible: boolean;
  /** Whether to scroll to top when screen is focused */
  scrollToTopOnFocus?: boolean;
  /** Ref for scrollable view */
  scrollViewRef: RefObject<FlatList>;
  /** Manual override for toggling FAB */
  toggleFab: (shown: boolean) => void;
  /** Scroll event handler (pass to ScrollView) */
  onListScroll: (event: ScrollEvent) => void;
}

/** Hide FAB while scrolling down in a ScrollView */
const useScrollingFab = (args?: ScrollingFabProps): ScrollingFab => {
  const { scrollToTopOnBlur } = args ?? {};

  const [fabVisible, setFabVisible] = useState(true);
  const { clearScroll, scroll, scrollViewRef, onListScroll } = useScrollViewScrolling({
    scrollToTopOnBlur,
    threshold: 25,
  });

  const toggleFab = useCallback(
    (visible: boolean) => {
      // When manually showing the FAB the scroll direction should be cleared to avoid conflicts
      //   that would otherwise hide the FAB (see below 'useEffect').
      if (visible) {
        clearScroll();
      }

      setFabVisible(visible);
    },
    [clearScroll],
  );

  // NOTE: Previously tried reshowing FAB when parent navigator was focused, but the following
  //         code would then run and hide it immediately. Instead, manually handle resetting
  //         scroll index when leaving pages with scroll views...

  // Only update whether FAB is visible after scroll event changes (not each render)
  useEffect(() => {
    if (scroll.direction === null) return;
    const movingDown = scroll.direction === "down";

    if (movingDown && fabVisible && !scroll.nearTop) {
      setFabVisible(false);
    } else if (!movingDown && !fabVisible && !scroll.nearBottom) {
      setFabVisible(true);
    }
  }, [fabVisible, scroll.direction, scroll.nearTop, scroll.nearBottom]);

  return {
    clearScroll,
    fabVisible,
    scrollViewRef,
    toggleFab,
    onListScroll,
  };
};

export { useScrollingFab };
