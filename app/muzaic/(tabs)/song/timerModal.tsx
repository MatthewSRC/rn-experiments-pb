import AntDesign from '@expo/vector-icons/AntDesign';
import { Alarm } from 'components/muzaic/song/Alarm';
import { Timer } from 'components/muzaic/song/Timer';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, useWindowDimensions, View, StyleSheet, Switch } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export default function TimerModal() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const [clockType, setClockType] = useState<'timer' | 'alarm'>('timer');

  const ClockBody = {
    alarm: () => <AlarmBody />,
    timer: () => <TimerBody />,
  }[clockType];

  return (
    <View
      style={{ minHeight: (height * 85) / 100 }}
      className="absolute bottom-0 w-full bg-neutral-900 px-1 py-6">
      <Pressable className="ml-6 h-8 w-8" onPress={() => router.back()}>
        <AntDesign name="arrowleft" size={24} color="white" />
      </Pressable>
      <View className="h-4" />
      <ClockSelector current={clockType} onPress={(value) => setClockType(value)} />
      <ClockBody />
    </View>
  );
}

function TimerBody() {
  return (
    <View className="flex-1">
      <View className="flex-1">
        <View className="h-4" />
        <Text className="text-center text-lg text-white">
          Set the timer for Muzaic to stop playing in:
        </Text>
        <View className="h-10" />
        <Timer />
        <View className="h-1" />
        <AlarmSound />
      </View>
      <Pressable className="w-11/12 items-center justify-center self-center rounded-full bg-white py-5">
        <Text className="text-lg font-medium">Set timer</Text>
      </Pressable>
    </View>
  );
}

function AlarmBody() {
  return (
    <View className="flex-1">
      <View className="flex-1">
        <View className="h-4" />
        <Text className="text-center text-lg text-white">Set an alarm that will play at:</Text>
        <View className="h-10" />
        <Alarm />
        <View className="h-1" />
      </View>
      <Pressable className="w-11/12 items-center justify-center self-center rounded-full bg-white py-5">
        <Text className="text-lg font-medium">Set alarm</Text>
      </Pressable>
    </View>
  );
}

function AlarmSound() {
  return (
    <View className="w-full flex-row items-center justify-between rounded-full bg-neutral-800/50 p-6">
      <Text className="text-lg text-white">Alarm sound</Text>
      <Switch />
    </View>
  );
}

function ClockSelector({
  current,
  onPress,
}: {
  current: 'timer' | 'alarm';
  onPress: (value: 'timer' | 'alarm') => void;
}) {
  const { width } = useWindowDimensions();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value =
      current === 'alarm' ? withTiming(1, { duration: 250 }) : withTiming(0, { duration: 250 });
  }, [current]);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(progress.value, [0, 1], [0, width / 2]),
        },
      ],
    };
  });

  return (
    <View className="w-full rounded-full bg-neutral-800/50 py-4">
      <Animated.View
        style={[StyleSheet.absoluteFillObject, rStyle]}
        className="absolute w-1/2 rounded-full bg-neutral-700/50"
      />
      <View className="flex-row">
        <Pressable onPress={() => onPress('timer')} className="flex-1 items-center justify-center ">
          <Text className="text-lg text-white">Timer</Text>
        </Pressable>
        <Pressable onPress={() => onPress('alarm')} className="flex-1 items-center justify-center">
          <Text className="text-lg text-white">Alarm</Text>
        </Pressable>
      </View>
      <View />
    </View>
  );
}
