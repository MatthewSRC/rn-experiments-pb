import React, { useState } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent, ScrollView, View } from 'react-native';

import { ScrollKeyframe, ScrollKeyframeProps } from './ScrollKeyframe';

/**
 * Props for the ScrollTimeline component
 */
export interface ScrollTimelineProps {
  children: React.ReactNode;
  length?: number;
}

/**
 * ScrollTimeline component that manages keyframes based on scroll position
 */
export function ScrollTimeline({ children, length = 2000 }: ScrollTimelineProps): JSX.Element {
  const [scrollY, setScrollY] = useState<number>(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const y = event.nativeEvent.contentOffset.y;
    setScrollY(y);
  };

  const enhancedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child;
    }

    if (child.type === ScrollKeyframe) {
      return React.cloneElement(child, { scrollY } as Partial<ScrollKeyframeProps>);
    }

    return child;
  });

  return (
    <View>
      <View className="absolute h-full w-full">{enhancedChildren}</View>
      <ScrollView decelerationRate="fast" onScroll={handleScroll} scrollEventThrottle={16}>
        <View style={{ height: length }} />
      </ScrollView>
    </View>
  );
}
