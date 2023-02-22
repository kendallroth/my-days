import { useFocusEffect } from "@react-navigation/native";
import { type RefObject, useCallback, useRef, useState } from "react";
import { type FlatList } from "react-native";

import { type ScrollEvent } from "@typings/app.types";

interface ScrollProps {
  /** Whether to scroll to top when screen is blurred */
  scrollToTopOnBlur?: boolean;
  /** Threshold for scrolling "near" detection */
  threshold?: number;
}

interface ScrollView {
  /** Scroll direction (from last scroll event) */
  direction: "down" | "up" | null;
  /** Whether scrolling is near top (given a threshold) */
  nearTop: boolean;
  /** Whether scrolling is near bottom (given a threshold) */
  nearBottom: boolean;
  /** Offset from bottom (can be negative with overscroll) */
  offsetBottom: number;
  /** Offset from top (can be negative with overscroll) */
  offsetTop: number;
}

interface ScrollViewScrolling {
  /** Clear scroll direction */
  clearScroll: () => void;
  /** Scroll view stats */
  scroll: ScrollView;
  /** Ref for scrollable view */
  scrollViewRef: RefObject<FlatList>;
  /** Scroll event handler (pass to ScrollView) */
  onListScroll: (event: ScrollEvent) => void;
}

/**
 * Track scroll progress in a ScrollView
 *
 * @param   args - Scroll arguments
 * @returns Scroll progress and scroll callback
 */
const useScrollViewScrolling = (args?: ScrollProps): ScrollViewScrolling => {
  const { scrollToTopOnBlur = false, threshold = 0 } = args ?? {};

  const [scroll, setScroll] = useState<ScrollView>({
    direction: "down",
    nearBottom: false,
    nearTop: true,
    offsetBottom: 0,
    offsetTop: 0,
  });
  const [scrollY, setScrollY] = useState(0);
  const scrollViewRef = useRef<FlatList>(null);

  useFocusEffect(
    // Reset scroll view position when leaving page (likely expected)?
    //   This is necessary to show FAB on refocus if hidden previously.
    useCallback(() => {
      return () => {
        if (scrollToTopOnBlur) {
          // TODO: Enable if this ever becomes desired
          // scrollViewRef.current?.scrollToOffset({ animated: false, offset: 0 });
        }
      };
    }, [scrollToTopOnBlur]),
  );

  const clearScroll = useCallback(() => {
    setScroll({
      ...scroll,
      direction: null,
    });
  }, [scroll]);

  const onListScroll = (event: ScrollEvent) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;

    // TODO: Determine if height being less than thresholds or screen height will matter?

    const newY = contentOffset.y;
    const endY = contentSize.height - layoutMeasurement.height;
    setScrollY(newY);

    const movingDown = newY > scrollY;
    const nearTop = newY < threshold;
    const nearBottom = endY - newY < threshold;

    setScroll({
      direction: movingDown ? "down" : "up",
      nearTop,
      nearBottom,
      offsetBottom: endY - newY,
      offsetTop: newY,
    });
  };

  return {
    clearScroll,
    scroll,
    scrollViewRef,
    onListScroll,
  };
};

export { useScrollViewScrolling };
