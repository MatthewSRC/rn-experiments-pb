import React, { useEffect } from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
  SharedValue,
} from 'react-native-reanimated';

import { NeuralNetworkAnimation } from './NeuralNetworkAnimation';
import { EntryDirection, ExitDirection, useScrollKeyframe } from './ScrollKeyframe';

const ANIMATION_DURATION = 800;
const EXIT_ANIMATION_DURATION = 600;

interface AnimationParams {
  opacityValue: SharedValue<number>;
  positionValue: SharedValue<number>;
  delay?: number;
  duration?: number;
  onComplete?: () => void;
}

const animationUtils = {
  cubicOut: Easing.out(Easing.cubic),
  cubicIn: Easing.in(Easing.cubic),

  animateElementEntry: (params: AnimationParams) => {
    'worklet';
    const {
      opacityValue,
      positionValue,
      delay = 0,
      duration = ANIMATION_DURATION,
      onComplete,
    } = params;

    opacityValue.value = withDelay(delay, withTiming(1, { duration }));

    if (onComplete) {
      positionValue.value = withDelay(
        delay,
        withTiming(
          0,
          {
            duration,
            easing: Easing.out(Easing.cubic),
          },
          (finished) => {
            if (finished) {
              runOnJS(onComplete)();
            }
          }
        )
      );
    } else {
      positionValue.value = withDelay(
        delay,
        withTiming(0, {
          duration,
          easing: Easing.out(Easing.cubic),
        })
      );
    }
  },
};

interface AnimatedElementState {
  opacity: SharedValue<number>;
  position: SharedValue<number>;
}

export function FirstView() {
  const { height } = useWindowDimensions();
  const { registerDirectionalEntry, registerDirectionalExit } = useScrollKeyframe();

  const network: AnimatedElementState = {
    opacity: useSharedValue(0),
    position: useSharedValue(height),
  };

  const title: AnimatedElementState = {
    opacity: useSharedValue(0),
    position: useSharedValue(height),
  };

  const description: AnimatedElementState = {
    opacity: useSharedValue(0),
    position: useSharedValue(height),
  };

  const button: AnimatedElementState = {
    opacity: useSharedValue(0),
    position: useSharedValue(height),
  };

  useEffect(() => {
    const unregister = registerDirectionalEntry((direction, complete) => {
      'worklet';

      if (direction === EntryDirection.BOTTOM) {
        network.position.value = -height;
        title.position.value = -height;
        description.position.value = -height;
        button.position.value = -height;

        network.opacity.value = 0;
        title.opacity.value = 0;
        description.opacity.value = 0;
        button.opacity.value = 0;

        animationUtils.animateElementEntry({
          opacityValue: button.opacity,
          positionValue: button.position,
          delay: 200,
        });

        animationUtils.animateElementEntry({
          opacityValue: description.opacity,
          positionValue: description.position,
          delay: 500,
        });

        animationUtils.animateElementEntry({
          opacityValue: title.opacity,
          positionValue: title.position,
          delay: 800,
        });

        animationUtils.animateElementEntry({
          opacityValue: network.opacity,
          positionValue: network.position,
          delay: 1100,
          onComplete: complete,
        });
      } else {
        network.position.value = height;
        title.position.value = height;
        description.position.value = height;
        button.position.value = height;

        network.opacity.value = 0;
        title.opacity.value = 0;
        description.opacity.value = 0;
        button.opacity.value = 0;

        animationUtils.animateElementEntry({
          opacityValue: network.opacity,
          positionValue: network.position,
          delay: 200,
        });

        animationUtils.animateElementEntry({
          opacityValue: title.opacity,
          positionValue: title.position,
          delay: 500,
        });

        animationUtils.animateElementEntry({
          opacityValue: description.opacity,
          positionValue: description.position,
          delay: 800,
        });

        animationUtils.animateElementEntry({
          opacityValue: button.opacity,
          positionValue: button.position,
          delay: 1100,
          onComplete: complete,
        });
      }
    });

    return unregister;
  }, []);

  useEffect(() => {
    const unregister = registerDirectionalExit((direction, complete) => {
      'worklet';

      if (direction === ExitDirection.TOP) {
        button.opacity.value = 1;
        description.opacity.value = 1;
        title.opacity.value = 1;
        network.opacity.value = 1;

        button.opacity.value = withDelay(0, withTiming(0, { duration: EXIT_ANIMATION_DURATION }));
        button.position.value = withDelay(
          0,
          withTiming(height, {
            duration: EXIT_ANIMATION_DURATION,
            easing: Easing.in(Easing.cubic),
          })
        );

        description.opacity.value = withDelay(
          150,
          withTiming(0, { duration: EXIT_ANIMATION_DURATION })
        );
        description.position.value = withDelay(
          150,
          withTiming(height, {
            duration: EXIT_ANIMATION_DURATION,
            easing: Easing.in(Easing.cubic),
          })
        );

        title.opacity.value = withDelay(300, withTiming(0, { duration: EXIT_ANIMATION_DURATION }));
        title.position.value = withDelay(
          300,
          withTiming(height, {
            duration: EXIT_ANIMATION_DURATION,
            easing: Easing.in(Easing.cubic),
          })
        );

        network.opacity.value = withDelay(
          450,
          withTiming(0, { duration: EXIT_ANIMATION_DURATION })
        );
        network.position.value = withDelay(
          450,
          withTiming(
            height,
            {
              duration: EXIT_ANIMATION_DURATION,
              easing: Easing.in(Easing.cubic),
            },
            () => {
              runOnJS(complete)();
            }
          )
        );
      } else {
        network.opacity.value = 1;
        title.opacity.value = 1;
        description.opacity.value = 1;
        button.opacity.value = 1;

        network.opacity.value = withDelay(0, withTiming(0, { duration: EXIT_ANIMATION_DURATION }));
        network.position.value = withDelay(
          0,
          withTiming(-height, {
            duration: EXIT_ANIMATION_DURATION,
            easing: Easing.in(Easing.cubic),
          })
        );

        title.opacity.value = withDelay(150, withTiming(0, { duration: EXIT_ANIMATION_DURATION }));
        title.position.value = withDelay(
          150,
          withTiming(-height, {
            duration: EXIT_ANIMATION_DURATION,
            easing: Easing.in(Easing.cubic),
          })
        );

        description.opacity.value = withDelay(
          300,
          withTiming(0, { duration: EXIT_ANIMATION_DURATION })
        );
        description.position.value = withDelay(
          300,
          withTiming(-height, {
            duration: EXIT_ANIMATION_DURATION,
            easing: Easing.in(Easing.cubic),
          })
        );

        button.opacity.value = withDelay(450, withTiming(0, { duration: EXIT_ANIMATION_DURATION }));
        button.position.value = withDelay(
          450,
          withTiming(
            -height,
            {
              duration: EXIT_ANIMATION_DURATION,
              easing: Easing.in(Easing.cubic),
            },
            () => {
              runOnJS(complete)();
            }
          )
        );
      }
    });

    return unregister;
  }, []);

  const networkStyle = useAnimatedStyle(() => ({
    opacity: network.opacity.value,
    transform: [{ translateY: network.position.value }],
    flex: 1,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: title.opacity.value,
    transform: [{ translateY: title.position.value }],
  }));

  const descriptionStyle = useAnimatedStyle(() => ({
    opacity: description.opacity.value,
    transform: [{ translateY: description.position.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: button.opacity.value,
    transform: [{ translateY: button.position.value }],
    alignSelf: 'center',
  }));

  return (
    <View className="flex-1 py-6">
      <Animated.View style={networkStyle}>
        <NeuralNetworkAnimation />
      </Animated.View>
      <View className="flex-1 px-10">
        <Animated.Text style={titleStyle} className="text-center text-[44px] font-medium">
          AI Technology
        </Animated.Text>
        <View className="h-4" />
        <Animated.Text style={descriptionStyle} className="text-center">
          Artificial Intelligence (AI) and FX trading with quantum computers represents cutting-edge
          technologies that are revolutionising the financial markets
        </Animated.Text>
        <View className="h-10" />
        <Animated.View style={buttonStyle}>
          <Pressable className="rounded-full bg-black px-10 py-4">
            <Text className="text-white">Get started</Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}
