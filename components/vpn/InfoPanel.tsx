import ArgentinaFlag from 'assets/images/vpn/ar.svg';
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  SharedValue,
  useSharedValue,
  withDelay,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ConnectionTimer } from './ConnectionTimer';
import { ConnectionState } from './types';

export function InfoPanel({
  connectionState,
  translateGlobe,
}: {
  connectionState: ConnectionState;
  translateGlobe: SharedValue<number>;
}) {
  const { bottom } = useSafeAreaInsets();
  const countryOpacity = useSharedValue(0);
  const countryTranslateY = useSharedValue(30);

  useEffect(() => {
    countryOpacity.value = withDelay(
      400,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })
    );
    countryTranslateY.value = withDelay(
      400,
      withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  const timerAnimationsStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: 40 * translateGlobe.value }],
    };
  });

  const countryAnimatedStyle = useAnimatedStyle(() => ({
    opacity: countryOpacity.value,
    transform: [{ translateY: countryTranslateY.value }],
  }));

  return (
    <Animated.View
      style={[timerAnimationsStyle, { marginTop: -bottom }]}
      className="h-44 justify-center">
      <ConnectionTimer connectionState={connectionState} />
      <Animated.View
        style={countryAnimatedStyle}
        className="flex-row items-center gap-4 self-center">
        <View className="h-8 w-8 items-center justify-center overflow-hidden rounded-full">
          <ArgentinaFlag width={40} height={40} />
        </View>
        <Text className="text-xl font-semibold text-white">Argentina</Text>
      </Animated.View>
    </Animated.View>
  );
}
