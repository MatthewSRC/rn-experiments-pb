import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function BottomTab({ state, navigation, descriptors }: BottomTabBarProps) {
  return (
    <View className="absolute bottom-0 h-20 w-full flex-row items-center justify-around bg-white/25 px-5">
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const icon = {
          0: <Feather name="home" size={24} color="white" />,
          1: <AntDesign name="search1" size={24} color="white" />,
          2: <MaterialCommunityIcons name="bookshelf" size={24} color="white" />,
        }[index];

        const { options } = descriptors[route.key];
        const label = options.tabBarLabel;

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
          <TabButton
            onPress={onPress}
            isFocused={isFocused}
            icon={icon}
            key={route.key}
            label={label as string}
          />
        );
      })}
    </View>
  );
}

function TabButton({ isFocused, onPress, label, icon }: TabButtonProps) {
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
  });

  return (
    <AnimatedPressable
      style={[
        {
          opacity: isFocused ? 1 : 0.5,
          transitionDuration: 500,
          transitionProperty: 'opacity',
        },
        rStyle,
      ]}
      onPress={onPress}
      className="items-center gap-1">
      {icon}
      <Text className="color-white">{label}</Text>
    </AnimatedPressable>
  );
}

interface TabButtonProps {
  isFocused: boolean;
  label: string | undefined;
  icon: JSX.Element | undefined;
  onPress: () => void;
}
