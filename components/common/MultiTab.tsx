import React, {
  useState,
  useRef,
  useEffect,
  Children,
  ReactElement,
  cloneElement,
  useMemo,
  useCallback,
  memo,
} from 'react';
import {
  View,
  Pressable,
  ScrollView,
  LayoutChangeEvent,
  useWindowDimensions,
  Platform,
  TextStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  useAnimatedRef,
  useAnimatedScrollHandler,
  interpolate,
  runOnJS,
  FadeIn,
} from 'react-native-reanimated';

interface TabPageProps {
  id: number | string;
  title: string;
  active?: boolean;
  children: JSX.Element | JSX.Element[] | ((props: { active: boolean }) => React.ReactNode);
}

export const TabPage = memo(({ children, active = false }: TabPageProps) => {
  return <>{typeof children === 'function' ? children({ active }) : children}</>;
});

interface MultiTabProps {
  children: ReactElement<TabPageProps> | ReactElement<TabPageProps>[];
  flexRail?: boolean;
  railActiveColor?: string;
  railBgColor?: string;
  paddingH?: number;
  tabTitleStyle?: (active: boolean) => TextStyle;
}

const ANIMATION_CONFIG = {
  duration: 250,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

interface TabCategoryProps {
  onPress: () => void;
  index: number;
  totalTabs: number;
  focusedIndex: number;
  title: string;
  tabTitleStyle?: (active: boolean) => TextStyle;
  onLayout: (event: LayoutChangeEvent) => void;
}

const TabCategory = memo(
  ({
    title,
    onPress,
    focusedIndex,
    index,
    totalTabs,
    tabTitleStyle,
    onLayout,
  }: TabCategoryProps) => {
    const isCurrentTab = focusedIndex === index;

    const opacity = isCurrentTab
      ? 1
      : Math.max(0.4, Math.min(1 - Math.abs(index - focusedIndex) * 0.3, 0.75));

    return (
      <Pressable className="min-h-4" onPress={onPress} onLayout={onLayout}>
        <Animated.Text
          className={`font-medium text-white ${index !== 0 ? 'ml-4' : ''} ${index !== totalTabs - 1 ? 'mr-4' : ''}`}
          style={[
            {
              opacity,
              transitionProperty: 'opacity',
              transitionDuration: 250,
            },
            tabTitleStyle?.(isCurrentTab),
          ]}
          ellipsizeMode="tail"
          numberOfLines={1}>
          {title}
        </Animated.Text>
      </Pressable>
    );
  }
);

interface TabData {
  id: number | string;
  title: string;
  content: ReactElement<TabPageProps>;
}

export function MultiTab({
  children,
  flexRail = false,
  paddingH = 0,
  tabTitleStyle,
  railActiveColor = 'white',
  railBgColor = 'rgba(255, 255, 255, 0.25)',
}: MultiTabProps) {
  const tabsCategoryScrollViewRef = useRef<ScrollView>(null);
  const tabsScrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const { width } = useWindowDimensions();
  const PAGE_WIDTH = width;

  const [scrollViewWidth, setScrollViewWidth] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [tabWidths, setTabWidths] = useState<number[]>([]);
  const [tabOffsets, setTabOffsets] = useState<number[]>([]);
  const [isIndicatorInitialized, setIsIndicatorInitialized] = useState(false);
  const [renderedTabs, setRenderedTabs] = useState<boolean[]>([]);

  const pendingTabWidthUpdates = useRef<Record<number, number>>({});
  const layoutUpdateScheduled = useRef(false);
  const isTabPressInProgress = useRef(false);
  const previousFocusedIndex = useRef(0);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isScrolling = useSharedValue(false);
  const indicatorWidth = useSharedValue(0);
  const indicatorOffset = useSharedValue(0);
  const tabsScrollOffset = useSharedValue(0);
  const previousScrollPosition = useSharedValue(0);
  const entranceProgress = useSharedValue(0);

  const tabsData = useMemo<TabData[]>(() => {
    return Children.map(children, (child, index) => {
      if (!child) return null;
      return {
        id: child.props.id || index,
        title: child.props.title,
        content: child,
      };
    }).filter(Boolean) as TabData[];
  }, [children]);

  useEffect(() => {
    entranceProgress.value = withTiming(1, { duration: 1000 });
  }, [children]);

  useEffect(() => {
    const initialRenderedTabs = Array(tabsData.length).fill(false);
    initialRenderedTabs[0] = true;
    setRenderedTabs(initialRenderedTabs);

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [tabsData.length]);

  useEffect(() => {
    if (
      renderedTabs.length > 0 &&
      focusedIndex >= 0 &&
      focusedIndex < renderedTabs.length &&
      !renderedTabs[focusedIndex]
    ) {
      setRenderedTabs((prev) => {
        const updated = [...prev];
        updated[focusedIndex] = true;
        return updated;
      });
    }

    previousFocusedIndex.current = focusedIndex;
  }, [focusedIndex, renderedTabs]);

  const flushTabWidthUpdates = useCallback(() => {
    const pendingUpdates = pendingTabWidthUpdates.current;
    if (Object.keys(pendingUpdates).length === 0) return;

    setTabWidths((prev) => {
      const newWidths = [...prev];
      Object.entries(pendingUpdates).forEach(([indexStr, width]) => {
        const index = Number(indexStr);
        newWidths[index] = width;
      });
      return newWidths;
    });

    pendingTabWidthUpdates.current = {};
    layoutUpdateScheduled.current = false;
  }, []);

  useEffect(() => {
    if (tabWidths.length > 0) {
      const offsets: number[] = [];
      let currentOffset = 0;

      for (let i = 0; i < tabWidths.length; i++) {
        offsets.push(currentOffset);
        currentOffset += tabWidths[i];
      }

      setTabOffsets(offsets);
    }
  }, [tabWidths]);

  useEffect(() => {
    if (isTabPressInProgress.current) return;

    if (
      tabOffsets[focusedIndex] !== undefined &&
      tabsCategoryScrollViewRef.current &&
      scrollViewWidth > 0 &&
      tabWidths[focusedIndex]
    ) {
      const tabWidth = tabWidths[focusedIndex];
      const tabCenter = tabOffsets[focusedIndex] + tabWidth / 2;
      const scrollViewCenter = scrollViewWidth / 2;
      const scrollToPosition = Math.max(0, tabCenter - scrollViewCenter);

      const rafId = requestAnimationFrame(() => {
        tabsCategoryScrollViewRef.current?.scrollTo({
          x: scrollToPosition,
          animated: true,
        });
      });

      return () => cancelAnimationFrame(rafId);
    }
  }, [focusedIndex, tabOffsets, scrollViewWidth, tabWidths]);

  useEffect(() => {
    if (tabWidths[focusedIndex] !== undefined && tabOffsets[focusedIndex] !== undefined) {
      indicatorWidth.value = withTiming(tabWidths[focusedIndex], ANIMATION_CONFIG);
      indicatorOffset.value = withTiming(tabOffsets[focusedIndex], ANIMATION_CONFIG);

      if (!isIndicatorInitialized && tabWidths[focusedIndex] > 0) {
        setIsIndicatorInitialized(true);
      }
    }
  }, [
    focusedIndex,
    tabWidths,
    tabOffsets,
    isIndicatorInitialized,
    indicatorWidth,
    indicatorOffset,
  ]);

  const updateFocusedIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < tabsData.length && index !== focusedIndex) {
        setFocusedIndex(index);
      }
    },
    [tabsData.length, focusedIndex]
  );

  const handleTabPress = useCallback(
    (index: number) => {
      if (index === focusedIndex || isTabPressInProgress.current) return;

      isTabPressInProgress.current = true;
      isScrolling.value = true;

      setRenderedTabs((prev) => {
        const updated = [...prev];
        updated[index] = true;
        return updated;
      });

      setFocusedIndex(index);

      const rafId = requestAnimationFrame(() => {
        tabsScrollViewRef.current?.scrollTo({
          x: index * PAGE_WIDTH,
          animated: true,
        });

        if (
          tabOffsets[index] !== undefined &&
          tabsCategoryScrollViewRef.current &&
          scrollViewWidth > 0
        ) {
          const tabWidth = tabWidths[index] || 0;
          const tabCenter = tabOffsets[index] + tabWidth / 2;
          const scrollViewCenter = scrollViewWidth / 2;
          const scrollToPosition = Math.max(0, tabCenter - scrollViewCenter);

          tabsCategoryScrollViewRef.current.scrollTo({
            x: scrollToPosition,
            animated: true,
          });

          setTimeout(() => {
            isTabPressInProgress.current = false;
            isScrolling.value = false;
          }, 300);
        } else {
          isTabPressInProgress.current = false;
          isScrolling.value = false;
        }
      });

      return () => cancelAnimationFrame(rafId);
    },
    [focusedIndex, PAGE_WIDTH, tabOffsets, scrollViewWidth, tabWidths, isScrolling]
  );

  const handleTabLayout = useCallback(
    (index: number, width: number) => {
      if (tabWidths[index] === width) return;

      pendingTabWidthUpdates.current[index] = width;

      if (index === focusedIndex && !isIndicatorInitialized) {
        indicatorWidth.value = width;
        if (tabOffsets[index] !== undefined) {
          indicatorOffset.value = tabOffsets[index];
        }
        setIsIndicatorInitialized(true);
      }

      if (!layoutUpdateScheduled.current) {
        layoutUpdateScheduled.current = true;
        const rafId = requestAnimationFrame(flushTabWidthUpdates);
        return () => cancelAnimationFrame(rafId);
      }
    },
    [focusedIndex, isIndicatorInitialized, tabOffsets, tabWidths, flushTabWidthUpdates]
  );

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    if (tabOffsets.length > 1 && tabsData.length > 1) {
      const inputRange = tabsData.map((_, i) => i * PAGE_WIDTH);

      if (inputRange.length === tabOffsets.length && inputRange.length > 1) {
        const interpolatedLeft = interpolate(tabsScrollOffset.value, inputRange, tabOffsets, {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        const currentIndex = Math.min(
          Math.max(0, Math.floor(tabsScrollOffset.value / PAGE_WIDTH)),
          tabsData.length - 2
        );
        const nextIndex = currentIndex + 1;
        const progress = (tabsScrollOffset.value - currentIndex * PAGE_WIDTH) / PAGE_WIDTH;

        const interpolatedWidth =
          tabWidths[currentIndex] + (tabWidths[nextIndex] - tabWidths[currentIndex]) * progress;

        return {
          position: 'absolute',
          bottom: 0,
          left: interpolatedLeft,
          width: isScrolling.value ? interpolatedWidth : indicatorWidth.value,
          height: 4,
          borderRadius: 2,
          backgroundColor: railActiveColor,
          opacity: entranceProgress.value,
        };
      }
    }

    return {
      position: 'absolute',
      bottom: 0,
      left: indicatorOffset.value,
      width: indicatorWidth.value,
      height: 4,
      borderRadius: 2,
      backgroundColor: railActiveColor,
      opacity: entranceProgress.value,
    };
  }, [tabOffsets, tabsData.length, tabWidths, PAGE_WIDTH]);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      tabsScrollOffset.value = event.contentOffset.x;

      if (!isScrolling.value) {
        const currentPosition = event.contentOffset.x / PAGE_WIDTH;

        const nearestPage = Math.round(currentPosition);

        const distanceFromCenter = Math.abs(currentPosition - nearestPage);

        if (
          distanceFromCenter < 0.02 &&
          nearestPage !== Math.round(previousScrollPosition.value / PAGE_WIDTH)
        ) {
          if (nearestPage >= 0 && nearestPage < tabsData.length) {
            runOnJS(updateFocusedIndex)(nearestPage);
          }
        }
      }
      previousScrollPosition.value = event.contentOffset.x;
    },
    onBeginDrag: () => {
      isScrolling.value = true;
    },
    onEndDrag: (event) => {
      const finalPage = Math.round(event.contentOffset.x / PAGE_WIDTH);
      if (finalPage >= 0 && finalPage < tabsData.length) {
        runOnJS(updateFocusedIndex)(finalPage);
      }
      isScrolling.value = false;
    },
    onMomentumEnd: (event) => {
      const finalPage = Math.round(event.contentOffset.x / PAGE_WIDTH);
      if (finalPage >= 0 && finalPage < tabsData.length) {
        runOnJS(updateFocusedIndex)(finalPage);
      }
      isScrolling.value = false;
    },
  });

  const handleScrollViewLayout = useCallback((event: LayoutChangeEvent) => {
    setScrollViewWidth(event.nativeEvent.layout.width);
  }, []);

  const renderTabs = useMemo(() => {
    return tabsData.map((tab, index) => (
      <View key={tab.id} style={{ width: PAGE_WIDTH, flex: 1 }}>
        {renderedTabs[index] ? (
          <Animated.View entering={FadeIn.duration(150)} style={{ flex: 1 }}>
            {cloneElement(tab.content as ReactElement, { active: focusedIndex === index })}
          </Animated.View>
        ) : (
          <View style={{ flex: 1 }} />
        )}
      </View>
    ));
  }, [tabsData, PAGE_WIDTH, renderedTabs, focusedIndex]);

  return (
    <View className="flex-1">
      <View style={{ paddingHorizontal: paddingH }} onLayout={handleScrollViewLayout}>
        <ScrollView
          ref={tabsCategoryScrollViewRef}
          keyboardShouldPersistTaps="handled"
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          decelerationRate="fast"
          overScrollMode="never"
          bounces={false}>
          {tabsData.map((item, index) => (
            <TabCategory
              key={item.id}
              title={item.title}
              index={index}
              focusedIndex={focusedIndex}
              totalTabs={tabsData.length}
              tabTitleStyle={tabTitleStyle}
              onPress={() => handleTabPress(index)}
              onLayout={(e) => handleTabLayout(index, e.nativeEvent.layout.width)}
            />
          ))}
          <View
            className="absolute bottom-0 h-1 rounded-[2px]"
            style={{
              width: flexRail ? width - paddingH * 2 : '100%',
              backgroundColor: railBgColor,
            }}
          />
          <Animated.View style={animatedIndicatorStyle} />
        </ScrollView>
      </View>

      <Animated.ScrollView
        ref={tabsScrollViewRef}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        horizontal
        pagingEnabled
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        snapToOffsets={tabsData.map((_, index) => index * PAGE_WIDTH)}
        onScroll={onScroll}
        scrollEventThrottle={16}
        removeClippedSubviews={Platform.OS === 'android'}
        overScrollMode="never"
        bounces={false}>
        {renderTabs}
      </Animated.ScrollView>
    </View>
  );
}
