import { useEffect } from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
  SharedValue,
} from 'react-native-reanimated';

import { EntryDirection, ExitDirection, useScrollKeyframe } from './ScrollKeyframe';

const ENTRY_ANIMATION_DURATION = 800;
const EXIT_ANIMATION_DURATION = 600;
const NAV_ITEM_ENTRY_DURATION = 600;
const NAV_ITEM_EXIT_DURATION = 400;
const TEXT_SCROLL_DURATION = 8000;

interface AnimationParams {
  positionValue: SharedValue<number>;
  opacityValue: SharedValue<number>;
  targetPosition: number;
  duration: number;
  delay: number;
  easing: any;
  onComplete?: () => void;
}

const animationUtils = {
  cubicOut: Easing.out(Easing.cubic),
  cubicIn: Easing.in(Easing.cubic),
  linear: Easing.linear,

  animateElement: (params: AnimationParams) => {
    'worklet';
    const { positionValue, opacityValue, targetPosition, duration, delay, easing, onComplete } =
      params;

    opacityValue.value = withDelay(delay, withTiming(targetPosition === 0 ? 1 : 0, { duration }));

    if (onComplete) {
      positionValue.value = withDelay(
        delay,
        withTiming(
          targetPosition,
          {
            duration,
            easing,
          },
          (finished) => {
            if (finished) {
              runOnJS(onComplete)();
            }
          }
        )
      );
    } else {
      positionValue.value = withDelay(delay, withTiming(targetPosition, { duration, easing }));
    }
  },
};

interface NavItem {
  name: string;
  position: SharedValue<number>;
  opacity: SharedValue<number>;
}

function NavigationCard({ item }: { item: NavItem }) {
  const itemStyle = useAnimatedStyle(() => ({
    opacity: item.opacity.value,
    transform: [{ translateY: item.position.value }],
  }));

  return (
    <Animated.View style={itemStyle}>
      <Pressable className="self-center">
        <Text className="text-4xl">{item.name}</Text>
      </Pressable>
    </Animated.View>
  );
}

function useNavItemsAnimation() {
  const { height } = useWindowDimensions();

  const homePosition = useSharedValue(height);
  const servicePosition = useSharedValue(height);
  const aboutPosition = useSharedValue(height);
  const industriesPosition = useSharedValue(height);
  const contactPosition = useSharedValue(height);

  const homeOpacity = useSharedValue(0);
  const serviceOpacity = useSharedValue(0);
  const aboutOpacity = useSharedValue(0);
  const industriesOpacity = useSharedValue(0);
  const contactOpacity = useSharedValue(0);

  const navItems = [
    {
      name: 'Home',
      position: homePosition,
      opacity: homeOpacity,
    },
    {
      name: 'Service',
      position: servicePosition,
      opacity: serviceOpacity,
    },
    {
      name: 'About',
      position: aboutPosition,
      opacity: aboutOpacity,
    },
    {
      name: 'Industries Served',
      position: industriesPosition,
      opacity: industriesOpacity,
    },
    {
      name: 'Contact',
      position: contactPosition,
      opacity: contactOpacity,
    },
  ];

  const navItemsOpacity = [
    homeOpacity,
    serviceOpacity,
    aboutOpacity,
    industriesOpacity,
    contactOpacity,
  ];

  const navItemsPosition = [
    homePosition,
    servicePosition,
    aboutPosition,
    industriesPosition,
    contactPosition,
  ];

  return {
    navItems,
    navItemsOpacity,
    navItemsPosition,
  };
}

export function FourthView() {
  const { height } = useWindowDimensions();
  const { registerDirectionalEntry, registerDirectionalExit } = useScrollKeyframe();
  const { navItems, navItemsOpacity, navItemsPosition } = useNavItemsAnimation();
  const textWidth = 850;

  const translateX = useSharedValue(0);

  const backgroundText = {
    opacity: useSharedValue(0),
    position: useSharedValue(height),
  };

  const title = {
    opacity: useSharedValue(0),
    position: useSharedValue(height),
  };

  const button = {
    opacity: useSharedValue(0),
    position: useSharedValue(height),
  };

  useEffect(() => {
    setTimeout(() => {
      translateX.value = withRepeat(
        withTiming(-textWidth, {
          duration: TEXT_SCROLL_DURATION,
          easing: animationUtils.linear,
        }),
        -1,
        false
      );
    }, 1500);
  }, []);

  useEffect(() => {
    const unregister = registerDirectionalEntry((direction, complete) => {
      'worklet';

      if (direction === EntryDirection.BOTTOM) {
        title.position.value = -height;
        button.position.value = -height;
        navItems.forEach((_, index) => {
          navItemsPosition[index].value = -height;
        });
        backgroundText.position.value = -height;

        title.opacity.value = 0;
        button.opacity.value = 0;
        navItems.forEach((_, index) => {
          navItemsOpacity[index].value = 0;
        });
        backgroundText.opacity.value = 0;

        animationUtils.animateElement({
          positionValue: backgroundText.position,
          opacityValue: backgroundText.opacity,
          targetPosition: 0,
          duration: ENTRY_ANIMATION_DURATION,
          delay: 200,
          easing: animationUtils.cubicOut,
        });

        navItems
          .slice()
          .reverse()
          .forEach((_, reverseIndex) => {
            const index = navItems.length - 1 - reverseIndex;
            const delay = 500 + reverseIndex * 100;

            animationUtils.animateElement({
              positionValue: navItemsPosition[index],
              opacityValue: navItemsOpacity[index],
              targetPosition: 0,
              duration: NAV_ITEM_ENTRY_DURATION,
              delay,
              easing: animationUtils.cubicOut,
            });
          });

        animationUtils.animateElement({
          positionValue: button.position,
          opacityValue: button.opacity,
          targetPosition: 0,
          duration: ENTRY_ANIMATION_DURATION,
          delay: 1000,
          easing: animationUtils.cubicOut,
        });

        animationUtils.animateElement({
          positionValue: title.position,
          opacityValue: title.opacity,
          targetPosition: 0,
          duration: ENTRY_ANIMATION_DURATION,
          delay: 1300,
          easing: animationUtils.cubicOut,
          onComplete: complete,
        });
      } else {
        title.position.value = height;
        button.position.value = height;
        navItems.forEach((_, index) => {
          navItemsPosition[index].value = height;
        });
        backgroundText.position.value = height;

        title.opacity.value = 0;
        button.opacity.value = 0;
        navItems.forEach((_, index) => {
          navItemsOpacity[index].value = 0;
        });
        backgroundText.opacity.value = 0;

        animationUtils.animateElement({
          positionValue: title.position,
          opacityValue: title.opacity,
          targetPosition: 0,
          duration: ENTRY_ANIMATION_DURATION,
          delay: 200,
          easing: animationUtils.cubicOut,
        });

        animationUtils.animateElement({
          positionValue: button.position,
          opacityValue: button.opacity,
          targetPosition: 0,
          duration: ENTRY_ANIMATION_DURATION,
          delay: 500,
          easing: animationUtils.cubicOut,
        });

        navItems.forEach((item, index) => {
          const delay = 700 + index * 100;
          const isLastNavItem = index === navItems.length - 1;

          animationUtils.animateElement({
            positionValue: navItemsPosition[index],
            opacityValue: navItemsOpacity[index],
            targetPosition: 0,
            duration: NAV_ITEM_ENTRY_DURATION,
            delay,
            easing: animationUtils.cubicOut,
            onComplete: isLastNavItem ? complete : undefined,
          });
        });

        animationUtils.animateElement({
          positionValue: backgroundText.position,
          opacityValue: backgroundText.opacity,
          targetPosition: 0,
          duration: ENTRY_ANIMATION_DURATION,
          delay: 1000,
          easing: animationUtils.cubicOut,
        });
      }
    });

    return unregister;
  }, []);

  useEffect(() => {
    const unregister = registerDirectionalExit((direction, complete) => {
      'worklet';

      if (direction === ExitDirection.TOP) {
        animationUtils.animateElement({
          positionValue: backgroundText.position,
          opacityValue: backgroundText.opacity,
          targetPosition: height,
          duration: EXIT_ANIMATION_DURATION,
          delay: 0,
          easing: animationUtils.cubicIn,
        });

        navItems
          .slice()
          .reverse()
          .forEach((_, reverseIndex) => {
            const index = navItems.length - 1 - reverseIndex;
            const delay = 150 + reverseIndex * 50;

            animationUtils.animateElement({
              positionValue: navItemsPosition[index],
              opacityValue: navItemsOpacity[index],
              targetPosition: height,
              duration: NAV_ITEM_EXIT_DURATION,
              delay,
              easing: animationUtils.cubicIn,
            });
          });

        animationUtils.animateElement({
          positionValue: button.position,
          opacityValue: button.opacity,
          targetPosition: height,
          duration: EXIT_ANIMATION_DURATION,
          delay: 400,
          easing: animationUtils.cubicIn,
        });

        animationUtils.animateElement({
          positionValue: title.position,
          opacityValue: title.opacity,
          targetPosition: height,
          duration: EXIT_ANIMATION_DURATION,
          delay: 500,
          easing: animationUtils.cubicIn,
          onComplete: complete,
        });
      } else {
        animationUtils.animateElement({
          positionValue: title.position,
          opacityValue: title.opacity,
          targetPosition: -height,
          duration: EXIT_ANIMATION_DURATION,
          delay: 0,
          easing: animationUtils.cubicIn,
        });

        animationUtils.animateElement({
          positionValue: button.position,
          opacityValue: button.opacity,
          targetPosition: -height,
          duration: EXIT_ANIMATION_DURATION,
          delay: 100,
          easing: animationUtils.cubicIn,
        });

        navItems.forEach((_, index) => {
          const delay = 200 + index * 50;

          animationUtils.animateElement({
            positionValue: navItemsPosition[index],
            opacityValue: navItemsOpacity[index],
            targetPosition: -height,
            duration: NAV_ITEM_EXIT_DURATION,
            delay,
            easing: animationUtils.cubicIn,
          });
        });

        animationUtils.animateElement({
          positionValue: backgroundText.position,
          opacityValue: backgroundText.opacity,
          targetPosition: -height,
          duration: EXIT_ANIMATION_DURATION,
          delay: 450,
          easing: animationUtils.cubicIn,
          onComplete: complete,
        });
      }
    });

    return unregister;
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: title.opacity.value,
    transform: [{ translateY: title.position.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: button.opacity.value,
    transform: [{ translateY: button.position.value }],
  }));

  const backgroundTextStyle1 = useAnimatedStyle(() => ({
    transform: [{ translateY: backgroundText.position.value }, { translateX: translateX.value }],
    opacity: backgroundText.opacity.value,
  }));

  const backgroundTextStyle2 = useAnimatedStyle(() => ({
    transform: [
      { translateY: backgroundText.position.value },
      { translateX: translateX.value + textWidth },
    ],
    opacity: backgroundText.opacity.value,
  }));

  return (
    <View className="flex-1">
      <View className="h-10" />
      <Animated.Text style={titleStyle} className="text-center text-[44px] font-medium">
        Your Goals{'\n'}Are Ours Too
      </Animated.Text>
      <View className="h-4" />
      <Animated.View style={buttonStyle}>
        <Pressable className="self-center rounded-full bg-black px-12 py-4">
          <Text className="text-white">Let's start</Text>
        </Pressable>
      </Animated.View>
      <View className="h-20" />
      <View className="gap-1">
        {navItems.map((item) => (
          <NavigationCard key={item.name} item={item} />
        ))}
      </View>

      <View className="absolute bottom-0 w-full">
        <Animated.View style={[backgroundTextStyle1, { position: 'absolute', bottom: 0 }]}>
          <Text
            numberOfLines={1}
            className="text-[300px] font-black text-gray-200"
            style={{
              width: textWidth,
              textAlign: 'left',
            }}>
            EXITO
          </Text>
        </Animated.View>
        <Animated.View style={[backgroundTextStyle2, { position: 'absolute', bottom: 0 }]}>
          <Text
            numberOfLines={1}
            className="text-[300px] font-black text-gray-200"
            style={{
              width: textWidth,
              textAlign: 'left',
            }}>
            EXITO
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}
