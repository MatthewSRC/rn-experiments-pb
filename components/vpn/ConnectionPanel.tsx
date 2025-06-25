import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import PolandFlag from 'assets/images/vpn/pl.svg';
import USFlag from 'assets/images/vpn/us.svg';
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  useSharedValue,
  withDelay,
  withTiming,
  useAnimatedStyle,
  SharedValue,
  runOnJS,
} from 'react-native-reanimated';

import { ConnectionState } from './types';

interface ConnectionOption {
  id: string;
  icon: React.ReactNode;
  subtitle: string;
  title: string;
  delay: number;
}

const connectionOptions: ConnectionOption[] = [
  {
    id: 'random',
    icon: (
      <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
        <MaterialIcons name="restart-alt" size={24} color="#334155" />
      </View>
    ),
    subtitle: 'Random',
    title: 'Connect',
    delay: 1200,
  },
  {
    id: 'us',
    icon: (
      <View className="h-8 w-8 items-center justify-center overflow-hidden rounded-full">
        <USFlag width={40} height={40} />
      </View>
    ),
    subtitle: 'Last',
    title: 'U.S.',
    delay: 1350,
  },
  {
    id: 'poland',
    icon: (
      <View className="h-8 w-8 items-center justify-center overflow-hidden rounded-full">
        <PolandFlag width={40} height={40} />
      </View>
    ),
    subtitle: 'Recently',
    title: 'Poland',
    delay: 1500,
  },
];

interface AnimatedOptionProps {
  option: ConnectionOption;
}

function AnimatedOption({ option }: AnimatedOptionProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  useEffect(() => {
    opacity.value = withDelay(
      option.delay,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })
    );
    translateY.value = withDelay(
      option.delay,
      withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) })
    );
  }, [option.delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle} className="flex-1 gap-10 rounded-2xl bg-slate-950 p-4">
      {option.icon}
      <View>
        <Text className="text-white/50">{option.subtitle}</Text>
        <Text className="text-lg text-white">{option.title}</Text>
      </View>
    </Animated.View>
  );
}

function ConnectionOptions() {
  return (
    <View className="flex-row gap-4">
      {connectionOptions.map((option) => (
        <AnimatedOption key={option.id} option={option} />
      ))}
    </View>
  );
}

export function ConnectionPanel({
  connectionState,
  translateGlobe,
}: {
  connectionState: ConnectionState;
  translateGlobe: SharedValue<number>;
}) {
  const { height } = useWindowDimensions();
  const panelOpacity = useSharedValue(0);
  const panelTranslateY = useSharedValue(100);
  const searchOpacity = useSharedValue(0);
  const searchScale = useSharedValue(0.8);

  const cancelOpacity = useSharedValue(0);
  const cancelTranslateY = useSharedValue(30);
  const [showCancelButton, setShowCancelButton] = useState(false);

  useEffect(() => {
    panelOpacity.value = withDelay(
      1000,
      withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) })
    );
    panelTranslateY.value = withDelay(
      1000,
      withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) })
    );

    searchOpacity.value = withDelay(
      1650,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })
    );
    searchScale.value = withDelay(
      1650,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  useEffect(() => {
    if (connectionState === 'connecting') {
      setShowCancelButton(true);
      cancelOpacity.value = withTiming(1, {
        duration: 1000,
        easing: Easing.out(Easing.cubic),
      });
      cancelTranslateY.value = withTiming(0, {
        duration: 1000,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      cancelOpacity.value = withTiming(0, {
        duration: 300,
        easing: Easing.in(Easing.cubic),
      });
      cancelTranslateY.value = withTiming(
        30,
        {
          duration: 300,
          easing: Easing.in(Easing.cubic),
        },
        () => {
          runOnJS(() => setShowCancelButton(false));
        }
      );
    }
  }, [connectionState]);

  const infoAnimationsStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -(height * 0.12) * translateGlobe.value }],
    };
  });

  const searchAnimatedStyle = useAnimatedStyle(() => ({
    opacity: searchOpacity.value,
    transform: [{ scale: searchScale.value }],
  }));

  const cancelAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cancelOpacity.value,
    transform: [{ translateY: cancelTranslateY.value }],
  }));

  return (
    <Animated.View
      style={[infoAnimationsStyle, { backgroundColor: '#090e1a' }]}
      className="elevation-xl w-full gap-4 rounded-3xl p-4 shadow-xl shadow-black">
      {showCancelButton && (
        <Animated.View style={[cancelAnimatedStyle]} className="absolute -top-20 self-center">
          <Pressable className="flex-row items-center gap-3 self-center rounded-full bg-white/10 px-5 py-3">
            <AntDesign name="close" size={24} color="white" />
            <Text className="text-lg text-white">Cancel connection</Text>
          </Pressable>
        </Animated.View>
      )}
      <ConnectionOptions />
      <Animated.View
        style={searchAnimatedStyle}
        className="flex-row items-center gap-2 self-center rounded-full bg-slate-950 px-6 py-2">
        <AntDesign name="search1" size={16} color="white" />
        <Text className="text-white">Search</Text>
      </Animated.View>
    </Animated.View>
  );
}
