import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export function BottomTab({ state, navigation }: BottomTabBarProps) {
  return (
    <View className="absolute bottom-0 h-20 w-full">
      <View className="flex-1 flex-row items-center justify-around">
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const icon = {
            0: <Entypo name="home" size={24} color={isFocused ? '#0e7490' : '#9ca3af'} />,
            1: <FontAwesome6 name="receipt" size={24} color={isFocused ? '#0e7490' : '#9ca3af'} />,
            2: <Entypo name="wallet" size={24} color={isFocused ? '#0e7490' : '#9ca3af'} />,
            3: <FontAwesome5 name="user-tie" size={24} color={isFocused ? '#0e7490' : '#9ca3af'} />,
          }[index];

          function onPress() {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          }

          return (
            <View key={route.key} className="items-center justify-center">
              <TabButton onPress={onPress} isFocused={isFocused} icon={icon} />
            </View>
          );
        })}
      </View>
    </View>
  );
}

function TabButton({ isFocused, onPress, icon }: TabButtonProps) {
  const progressValue = useSharedValue(0);
  const rStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - progressValue.value }],
  }));

  useEffect(() => {
    if (isFocused)
      progressValue.value = withSequence(
        withTiming(0.1, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
  }, [isFocused]);

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        style={[
          {
            opacity: isFocused ? 1 : 0.5,
            transitionDuration: isFocused ? 750 : 0,
            transitionProperty: 'opacity',
          },
          rStyle,
        ]}
        className="items-center gap-1">
        {icon}
      </Animated.View>
    </Pressable>
  );
}

interface TabButtonProps {
  isFocused: boolean;
  icon: JSX.Element | undefined;
  onPress: () => void;
}
