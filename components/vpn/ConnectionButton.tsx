import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { ReactNode, useState, useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  SharedValue,
  withTiming,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';

import { ConnectionState } from './types';

interface StateConfig {
  icon: ReactNode;
  text: string;
  fontSize: number;
  gap: number;
}

const stateConfigs: Record<ConnectionState, StateConfig> = {
  disconnected: {
    icon: <Feather name="unlock" size={24} color="white" />,
    text: 'Connect',
    fontSize: 16,
    gap: 8,
  },
  connecting: {
    icon: <AntDesign name="up" size={32} color="white" />,
    text: 'Connecting',
    fontSize: 12,
    gap: 2,
  },
  connected: {
    icon: <Feather name="lock" size={24} color="white" />,
    text: 'Connected',
    fontSize: 16,
    gap: 8,
  },
  disconnecting: {
    icon: <AntDesign name="down" size={32} color="white" />,
    text: 'Disconnected',
    fontSize: 12,
    gap: 2,
  },
};

const ANIMATION_CONFIG = {
  exit: {
    duration: 250,
    easing: Easing.in(Easing.cubic),
  },
  enter: {
    duration: 350,
    easing: Easing.out(Easing.cubic),
  },
};

function ConnectionIcon({
  connectionState,
  iconOpacity,
  iconScale,
  iconTranslateY,
}: {
  connectionState: ConnectionState;
  iconOpacity: SharedValue<number>;
  iconScale: SharedValue<number>;
  iconTranslateY: SharedValue<number>;
}) {
  const [displayedState, setDisplayedState] = useState<ConnectionState>(connectionState);

  useEffect(() => {
    if (connectionState !== displayedState) {
      iconOpacity.value = withTiming(0, ANIMATION_CONFIG.exit);
      iconScale.value = withTiming(0.6, ANIMATION_CONFIG.exit);
      iconTranslateY.value = withTiming(-15, ANIMATION_CONFIG.exit, (finished) => {
        if (finished) {
          runOnJS(setDisplayedState)(connectionState);
          iconTranslateY.value = 15;

          iconOpacity.value = withTiming(1, ANIMATION_CONFIG.enter);
          iconScale.value = withTiming(1, ANIMATION_CONFIG.enter);
          iconTranslateY.value = withTiming(0, ANIMATION_CONFIG.enter);
        }
      });
    }
  }, [connectionState]);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }, { translateY: iconTranslateY.value }],
  }));

  return (
    <Animated.View style={iconAnimatedStyle}>{stateConfigs[displayedState].icon}</Animated.View>
  );
}

function ConnectionText({
  connectionState,
  textOpacity,
  textScale,
  textTranslateY,
}: {
  connectionState: ConnectionState;
  textOpacity: SharedValue<number>;
  textScale: SharedValue<number>;
  textTranslateY: SharedValue<number>;
}) {
  const [displayedState, setDisplayedState] = useState<ConnectionState>(connectionState);

  useEffect(() => {
    if (connectionState !== displayedState) {
      setTimeout(() => {
        textOpacity.value = withTiming(0, ANIMATION_CONFIG.exit);
        textScale.value = withTiming(0.8, ANIMATION_CONFIG.exit);
        textTranslateY.value = withTiming(-10, ANIMATION_CONFIG.exit, (finished) => {
          if (finished) {
            runOnJS(setDisplayedState)(connectionState);
            textTranslateY.value = 10;

            textOpacity.value = withTiming(1, ANIMATION_CONFIG.enter);
            textScale.value = withTiming(1, ANIMATION_CONFIG.enter);
            textTranslateY.value = withTiming(0, ANIMATION_CONFIG.enter);
          }
        });
      }, 50);
    }
  }, [connectionState]);

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ scale: textScale.value }, { translateY: textTranslateY.value }],
  }));

  return (
    <Animated.Text
      style={[
        textAnimatedStyle,
        {
          fontSize: stateConfigs[displayedState].fontSize,
          color: 'white',
        },
      ]}>
      {stateConfigs[displayedState].text}
    </Animated.Text>
  );
}

const AnimatePressable = Animated.createAnimatedComponent(Pressable);

export function ConnectionButton({
  connectionState,
  onPress,
  height,
  width,
}: {
  connectionState: ConnectionState;
  onPress: () => void;
  height: number;
  width: number;
}) {
  const buttonOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0.3);

  const iconOpacity = useSharedValue(1);
  const iconScale = useSharedValue(1);
  const iconTranslateY = useSharedValue(0);

  const textOpacity = useSharedValue(1);
  const textScale = useSharedValue(1);
  const textTranslateY = useSharedValue(0);

  const containerGap = useSharedValue(stateConfigs[connectionState].gap);

  useEffect(() => {
    buttonOpacity.value = withDelay(
      800,
      withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) })
    );
    buttonScale.value = withDelay(
      800,
      withTiming(1, { duration: 800, easing: Easing.elastic(1.2) })
    );
  }, []);

  useEffect(() => {
    containerGap.value = withTiming(stateConfigs[connectionState].gap, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
  }, [connectionState]);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ scale: buttonScale.value }],
    gap: containerGap.value,
  }));

  const handlePress = () => {
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 100, easing: Easing.inOut(Easing.cubic) }),
      withTiming(1, { duration: 200, easing: Easing.out(Easing.cubic) })
    );
    onPress();
  };

  return (
    <AnimatePressable
      onPress={handlePress}
      style={[
        buttonAnimatedStyle,
        {
          top: height / 4 - 80 - 20,
          left: width / 2 - 80,
        },
      ]}
      className="absolute h-40 w-40 items-center justify-center rounded-full">
      <ConnectionIcon
        connectionState={connectionState}
        iconOpacity={iconOpacity}
        iconScale={iconScale}
        iconTranslateY={iconTranslateY}
      />
      <ConnectionText
        connectionState={connectionState}
        textOpacity={textOpacity}
        textScale={textScale}
        textTranslateY={textTranslateY}
      />
    </AnimatePressable>
  );
}
