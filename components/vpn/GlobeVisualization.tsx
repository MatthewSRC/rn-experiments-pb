import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  SharedValue,
  useSharedValue,
  withDelay,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import Rive, { RiveRef, Fit } from 'rive-react-native';

import { ConnectionButton } from './ConnectionButton';
import { ConnectionState } from './types';

export function GlobeVisualization({
  connectionState,
  updateState,
  height,
  width,
  scaleGlobe,
  translateGlobe,
  setGlobeRef,
  setConnectRef,
}: {
  connectionState: ConnectionState;
  updateState: () => void;
  height: number;
  width: number;
  scaleGlobe: SharedValue<number>;
  translateGlobe: SharedValue<number>;
  setGlobeRef: (node: RiveRef) => void;
  setConnectRef: (node: RiveRef) => void;
}) {
  const globeOpacity = useSharedValue(0);
  const globeScale = useSharedValue(0.6);

  useEffect(() => {
    globeOpacity.value = withDelay(
      600,
      withTiming(1, { duration: 1000, easing: Easing.out(Easing.cubic) })
    );
    globeScale.value = withDelay(
      600,
      withTiming(1, { duration: 1000, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  const globeAnimationsStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scaleGlobe.value * globeScale.value },
        { rotateX: 35 * translateGlobe.value + 'deg' },
      ],
    };
  });

  const viewAnimationsStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -40 }],
      opacity: globeOpacity.value,
    };
  });

  const connectAnimationStyle = useAnimatedStyle(() => {
    return {
      opacity: globeOpacity.value,
    };
  });

  return (
    <View style={{ height: height / 2 }} className="w-full">
      <Animated.View style={[viewAnimationsStyle]}>
        <Animated.View
          style={[globeAnimationsStyle, { transform: [{ perspective: 1000 }] }]}
          className="h-full w-full">
          <Rive
            ref={setGlobeRef}
            fit={Fit.Contain}
            autoplay
            stateMachineName="State Machine 1"
            source={require('assets/rive/globe.riv')}
          />
        </Animated.View>
      </Animated.View>

      <Animated.View
        style={[
          connectAnimationStyle,
          {
            top: height / 4 - 80 - 20,
            left: width / 2 - 80,
          },
        ]}
        className="absolute h-40 w-40">
        <Rive
          ref={setConnectRef}
          fit={Fit.Contain}
          autoplay
          stateMachineName="State Machine 1"
          source={require('assets/rive/connect.riv')}
        />
      </Animated.View>
      <ConnectionButton
        connectionState={connectionState}
        onPress={updateState}
        height={height}
        width={width}
      />
    </View>
  );
}
