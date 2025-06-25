import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useScreenView } from 'context/useScreenView';
import { View } from 'react-native';
import { Gesture, GestureDetector, PanGesture } from 'react-native-gesture-handler';

export function BottomTab({ state, navigation }: BottomTabBarProps) {
  const { navigate, active } = useScreenView();

  return (
    <View className="absolute bottom-4 h-20 w-5/6 flex-row items-center justify-around self-center rounded-[20px] border-[1px] border-white/80 bg-white/40 px-5">
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const icon = {
          0: isFocused ? (
            <MaterialCommunityIcons name="home-variant" size={28} color="black" />
          ) : (
            <MaterialCommunityIcons name="home-variant-outline" size={28} color="black" />
          ),
          1: isFocused ? (
            <MaterialCommunityIcons name="text-box" size={28} color="black" />
          ) : (
            <MaterialCommunityIcons name="text-box-outline" size={28} color="black" />
          ),
          2: isFocused ? (
            <MaterialCommunityIcons name="chat" size={28} color="black" />
          ) : (
            <MaterialCommunityIcons name="chat-outline" size={28} color="black" />
          ),
          3: isFocused ? (
            <FontAwesome name="user" size={28} color="black" />
          ) : (
            <FontAwesome name="user-o" size={28} color="black" />
          ),
        }[index];

        function executeNavigation() {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        }

        const pan = Gesture.Pan()
          .runOnJS(true)
          // eslint-disable-next-line node/handle-callback-err
          .onBegin((e) => {
            if (!active) navigate({ x: e.absoluteX, y: e.absoluteY }, executeNavigation);
          });

        return <TabButton gesture={pan} isFocused={isFocused} icon={icon} key={route.key} />;
      })}
    </View>
  );
}

function TabButton({ isFocused, gesture, icon }: TabButtonProps) {
  return (
    <GestureDetector gesture={gesture}>
      <View className="items-center gap-1">{icon}</View>
    </GestureDetector>
  );
}

interface TabButtonProps {
  isFocused: boolean;
  icon: JSX.Element | undefined;
  gesture: PanGesture;
}
