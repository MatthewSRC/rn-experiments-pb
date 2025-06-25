import { DynamicText } from 'components/common/DynamicText';
import { BackgroundTimer } from 'helpers/backgroundTimer';
import { useState, useEffect } from 'react';
import { Text } from 'react-native';
import Animated, {
  useSharedValue,
  withDelay,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';

import { ConnectionState } from './types';

export function ConnectionTimer({ connectionState }: { connectionState: ConnectionState }) {
  const [timer, setTimer] = useState<number>(0);
  const backgroundTimer = new BackgroundTimer(
    'connection',
    false,
    (value) => setTimer(value),
    () => {},
    () => {},
    () => setTimer(0)
  );

  const timerOpacity = useSharedValue(0);
  const timerScale = useSharedValue(0.8);
  const timerHeight = useSharedValue(0);

  useEffect(() => {
    if (connectionState === 'connected') {
      backgroundTimer.reset();
      backgroundTimer.start(timer, 1, 1000);
    } else {
      setTimeout(() => backgroundTimer.reset(), 500);
    }
    return () => backgroundTimer.reset();
  }, [connectionState]);

  useEffect(() => {
    if (connectionState === 'connected') {
      timerHeight.value = withDelay(
        0,
        withTiming(128, { duration: 600, easing: Easing.out(Easing.cubic) })
      );
      timerOpacity.value = withDelay(
        200,
        withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })
      );
      timerScale.value = withDelay(
        200,
        withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })
      );
    } else {
      timerOpacity.value = withTiming(0, { duration: 400, easing: Easing.in(Easing.cubic) });
      timerScale.value = withTiming(0.8, { duration: 400, easing: Easing.in(Easing.cubic) });
      timerHeight.value = withDelay(
        200,
        withTiming(0, { duration: 400, easing: Easing.in(Easing.cubic) })
      );
    }
  }, [connectionState]);

  const timerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: timerOpacity.value,
    height: timerHeight.value,
    transform: [{ scale: timerScale.value }],
  }));

  return (
    <Animated.View style={timerAnimatedStyle} className="items-center justify-center self-center">
      <Text className="text-white/50">Secure connection</Text>

      <DynamicText fixedWidth={160} style={{ color: 'white', fontSize: 60, fontWeight: 'bold' }}>
        {`${Math.floor(timer / 60)
          .toString()
          .padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`}
      </DynamicText>
    </Animated.View>
  );
}
