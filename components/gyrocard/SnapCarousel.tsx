import {
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { useWindowDimensions, ScrollView, View, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOut, Easing } from 'react-native-reanimated';

export interface SnapCarouselRef {
  snap: (direction: 'left' | 'right') => void;
  snapToIndex: (index: number) => void;
  getCurrentIndex: () => number;
}

interface Props {
  items: ReactNode[];
  onIndexChange?: (index: number) => void;
  onScrollBegin?: () => void;
  onScrollEnd?: (index: number) => void;
  lazyLoad?: boolean;
  lazyLoadThreshold?: number;
  animationDuration?: number;
  style?: ViewStyle;
}

export const SnapCarousel = forwardRef<SnapCarouselRef, Props>(
  (
    {
      items,
      onIndexChange,
      onScrollBegin,
      onScrollEnd,
      lazyLoad = false,
      lazyLoadThreshold = 0.25,
      animationDuration = 800,
      style = undefined,
    },
    ref
  ) => {
    const { width } = useWindowDimensions();
    const scrollViewRef = useRef<ScrollView>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [mountedItems, setMountedItems] = useState<Set<number>>(() =>
      lazyLoad ? new Set([0]) : new Set(items.map((_, i) => i))
    );

    const snapOffsets = useMemo(() => items.map((_, i) => i * width), [items.length, width]);

    const lastUpdateTime = useRef(0);
    const UPDATE_THROTTLE = 50;

    const updateIndex = useCallback(
      (newIndex: number) => {
        if (newIndex !== currentIndex) {
          setCurrentIndex(newIndex);
          onIndexChange?.(newIndex);
        }
      },
      [currentIndex, onIndexChange]
    );

    const updateMountedItems = useCallback(
      (offset: number) => {
        if (!lazyLoad) return;

        const now = Date.now();
        if (now - lastUpdateTime.current < UPDATE_THROTTLE) return;
        lastUpdateTime.current = now;

        setMountedItems((prev) => {
          const newMountedItems = new Set<number>();
          const viewportStart = offset;
          const viewportEnd = offset + width;

          const startIndex = Math.max(0, Math.floor(viewportStart / width) - 1);
          const endIndex = Math.min(items.length - 1, Math.ceil(viewportEnd / width) + 1);

          for (let index = startIndex; index <= endIndex; index++) {
            const itemStart = index * width;
            const itemEnd = itemStart + width;
            const visibleStart = Math.max(viewportStart, itemStart);
            const visibleEnd = Math.min(viewportEnd, itemEnd);
            const visibleWidth = Math.max(0, visibleEnd - visibleStart);
            const visibilityRatio = visibleWidth / width;

            if (visibilityRatio >= lazyLoadThreshold) {
              newMountedItems.add(index);
            }
          }

          const hasChanged =
            prev.size !== newMountedItems.size ||
            [...newMountedItems].some((item) => !prev.has(item));

          return hasChanged ? newMountedItems : prev;
        });
      },
      [lazyLoad, width, items.length, lazyLoadThreshold]
    );

    useImperativeHandle(
      ref,
      () => ({
        snap: (direction: 'left' | 'right') => {
          let targetIndex = currentIndex;

          if (direction === 'left' && currentIndex > 0) {
            targetIndex = currentIndex - 1;
          } else if (direction === 'right' && currentIndex < items.length - 1) {
            targetIndex = currentIndex + 1;
          }

          if (targetIndex !== currentIndex) {
            scrollViewRef.current?.scrollTo({
              x: targetIndex * width,
              animated: true,
            });
            updateIndex(targetIndex);
          }
        },
        snapToIndex: (index: number) => {
          if (index >= 0 && index < items.length && index !== currentIndex) {
            scrollViewRef.current?.scrollTo({
              x: index * width,
              animated: true,
            });
            updateIndex(index);
          }
        },
        getCurrentIndex: () => currentIndex,
      }),
      [currentIndex, items.length, width, updateIndex]
    );

    function handleScrollBegin() {
      onScrollBegin?.();
    }

    const handleMomentumScrollEnd = useCallback(
      (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const newIndex = Math.round(contentOffsetX / width);
        updateIndex(newIndex);
        updateMountedItems(contentOffsetX);
        onScrollEnd?.(newIndex);
      },
      [width, updateIndex, updateMountedItems, onScrollEnd]
    );

    const handleScroll = useCallback(
      (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;

        if (lazyLoad) {
          updateMountedItems(contentOffsetX);
        }

        const newIndex = Math.round(contentOffsetX / width);
        if (Math.abs(contentOffsetX - newIndex * width) < 10) {
          updateIndex(newIndex);
        }
      },
      [lazyLoad, width, updateMountedItems, updateIndex]
    );

    return (
      <ScrollView
        ref={scrollViewRef}
        style={style}
        decelerationRate={0.75}
        overScrollMode="never"
        snapToOffsets={snapOffsets}
        horizontal
        onScrollBeginDrag={handleScrollBegin}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}>
        {items.map((item, i) => {
          const shouldRender = !lazyLoad || mountedItems.has(i);

          if (!shouldRender) return <View style={{ width }} key={i} />;
          return (
            <Animated.View
              className="items-center justify-center"
              style={{ width }}
              key={i}
              entering={FadeIn.duration(animationDuration).easing(Easing.out(Easing.cubic))}
              exiting={FadeOut.duration(animationDuration / 2).easing(Easing.in(Easing.cubic))}>
              {item}
            </Animated.View>
          );
        })}
      </ScrollView>
    );
  }
);
