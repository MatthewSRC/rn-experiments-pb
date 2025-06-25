import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { NavigationState, PartialState, Route } from '@react-navigation/native';
import { useEffect } from 'react';
import { View, Pressable, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.createAnimatedComponent(View);

export function BottomTab({ state, navigation }: BottomTabBarProps) {
  const { width } = useWindowDimensions();
  const indicatorPosition = useSharedValue(0);
  const { bottom } = useSafeAreaInsets();
  const PADDING = width / 6;

  const numTabs = state.routes.length;

  const tabWidth = width / numTabs;

  useEffect(() => {
    const newPosition = state.index * tabWidth - PADDING / 2;

    indicatorPosition.value = withTiming(newPosition, { duration: 300 });
  }, [state.index, tabWidth]);

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorPosition.value }],
    };
  }, [state.index]);

  const currentRoute = getCurrentRoute(state);
  const shouldHide =
    currentRoute && currentRoute.params && (currentRoute.params as { hideTab?: boolean }).hideTab;

  return (
    <Animated.View
      style={{
        height: bottom + 70,
        opacity: shouldHide ? 0 : 1,
        transitionDelay: shouldHide ? 0 : 250,
        transitionDuration: 350,
        transitionProperty: 'opacity',
      }}
      className="absolute bottom-0 w-full rounded-t-[40px] border-[1px] border-b-0 border-neutral-800 bg-neutral-900">
      <View className="flex-1 flex-row items-center justify-center py-5">
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const icon = {
            0: <FontAwesome5 name="compass" size={28} color={isFocused ? 'white' : '#404040'} />,
            1: (
              <Feather
                name="align-center"
                size={28}
                color={isFocused ? 'white' : '#404040'}
                style={{ transform: [{ rotate: '90deg' }] }}
              />
            ),
            2: <Ionicons name="person-outline" size={28} color={isFocused ? 'white' : '#404040'} />,
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
            <View key={route.key} style={{ width: tabWidth, height: '100%' }}>
              <TabButton onPress={onPress} isFocused={isFocused} icon={icon} />
            </View>
          );
        })}
      </View>

      <AnimatedView
        style={[
          indicatorStyle,
          { marginLeft: PADDING, width: width / numTabs - PADDING, bottom: bottom + 10 },
        ]}
        className="absolute h-[2px] rounded-full bg-white/80"
      />
    </Animated.View>
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
    <AnimatedPressable
      style={[
        {
          opacity: isFocused ? 1 : 0.5,
          transitionDuration: isFocused ? 750 : 0,
          transitionProperty: 'opacity',
        },
        rStyle,
      ]}
      onPress={onPress}
      className="items-center">
      {icon}
    </AnimatedPressable>
  );
}

type NavState = NavigationState | PartialState<NavigationState>;

function getCurrentRoute(state: NavState): Route<string> | undefined {
  if (typeof state.index !== 'number') return undefined;

  const route = state.routes[state.index];

  if (!route || !route.name || !route.key) return undefined;

  if ('state' in route && route.state) {
    return getCurrentRoute(route.state as NavState);
  }

  return route as Route<string>;
}

interface TabButtonProps {
  isFocused: boolean;
  icon: JSX.Element | undefined;
  onPress: () => void;
}
