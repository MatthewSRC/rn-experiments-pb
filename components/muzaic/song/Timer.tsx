import { useCallback } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  interpolate,
  Extrapolation,
  useAnimatedScrollHandler,
  runOnJS,
  withTiming,
} from 'react-native-reanimated';

const minutes = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
const hours = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
];
const timeUnits = ['min', 'hour'];

export function Timer() {
  const { height } = useWindowDimensions();

  const VISIBLE_SLOTS = 3;
  const TIMER_HEIGHT = height / 4;
  const TIMER_SLOT_HEIGHT = TIMER_HEIGHT / VISIBLE_SLOTS;
  const PADDING_ITEMS = Math.floor(VISIBLE_SLOTS / 2);

  const currentMinuteIndex = useSharedValue(0);
  const currentHourIndex = useSharedValue(0);
  const currentTimeUnitIndex = useSharedValue(0);

  const minutesScrollOffset = useSharedValue(0);
  const hoursScrollOffset = useSharedValue(0);
  const timeUnitsScrollOffset = useSharedValue(0);

  const minutesScrollRef = useAnimatedRef<Animated.ScrollView>();
  const hoursScrollRef = useAnimatedRef<Animated.ScrollView>();
  const timeUnitsScrollRef = useAnimatedRef<Animated.ScrollView>();

  const updateMinute = useCallback(
    (index: number) => {
      if (index >= 0 && index < minutes.length) {
        currentMinuteIndex.value = index;
      }
    },
    [currentMinuteIndex]
  );

  const updateHour = useCallback(
    (index: number) => {
      if (index >= 0 && index < hours.length) {
        currentHourIndex.value = index;
      }
    },
    [currentHourIndex]
  );

  const updateTimeUnit = useCallback(
    (index: number) => {
      if (index >= 0 && index < timeUnits.length) {
        currentTimeUnitIndex.value = index;
      }
    },
    [currentTimeUnitIndex]
  );

  const minutesScrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      minutesScrollOffset.value = e.contentOffset.y;
    },
    onMomentumEnd: (e) => {
      const index = Math.round(e.contentOffset.y / TIMER_SLOT_HEIGHT);
      runOnJS(updateMinute)(index);
    },
  });

  const hoursScrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      hoursScrollOffset.value = e.contentOffset.y;
    },
    onMomentumEnd: (e) => {
      const index = Math.round(e.contentOffset.y / TIMER_SLOT_HEIGHT);
      runOnJS(updateHour)(index);
    },
  });

  const timeUnitsScrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      timeUnitsScrollOffset.value = e.contentOffset.y;
    },
    onMomentumEnd: (e) => {
      const index = Math.round(e.contentOffset.y / TIMER_SLOT_HEIGHT);
      runOnJS(updateTimeUnit)(index);
    },
  });

  const minuteScrollPosition = useDerivedValue(() => {
    return minutesScrollOffset.value / TIMER_SLOT_HEIGHT;
  });

  const hourScrollPosition = useDerivedValue(() => {
    return hoursScrollOffset.value / TIMER_SLOT_HEIGHT;
  });

  const timeUnitScrollPosition = useDerivedValue(() => {
    return timeUnitsScrollOffset.value / TIMER_SLOT_HEIGHT;
  });

  const currentUnit = useDerivedValue(() => {
    return timeUnits[Math.round(currentTimeUnitIndex.value)];
  });

  const minutesScrollVisibility = useDerivedValue(() => {
    return currentUnit.value === 'min';
  });

  const hoursScrollVisibility = useDerivedValue(() => {
    return currentUnit.value === 'hour';
  });

  return (
    <View
      style={{ height: TIMER_HEIGHT, borderRadius: TIMER_HEIGHT / 5 }}
      className="w-full flex-row items-center justify-center bg-neutral-800/50">
      <View
        style={{ height: TIMER_SLOT_HEIGHT }}
        className="absolute w-11/12 rounded-3xl bg-neutral-700/50"
      />
      <View className="h-full w-1/4" />
      <View className="h-full w-1/4 overflow-hidden">
        <AnimatedVisibilityView visible={minutesScrollVisibility} direction="left">
          <Animated.ScrollView
            ref={minutesScrollRef}
            onScroll={minutesScrollHandler}
            scrollEventThrottle={16}
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: PADDING_ITEMS * TIMER_SLOT_HEIGHT,
              paddingBottom: PADDING_ITEMS * TIMER_SLOT_HEIGHT,
            }}
            snapToOffsets={minutes.map((_, idx) => idx * TIMER_SLOT_HEIGHT)}>
            {minutes.map((e, index) => (
              <TimeSlot
                key={e}
                value={e.toString()}
                height={TIMER_SLOT_HEIGHT}
                index={index}
                currentIndex={minuteScrollPosition}
              />
            ))}
          </Animated.ScrollView>
        </AnimatedVisibilityView>

        <AnimatedVisibilityView visible={hoursScrollVisibility} direction="right">
          <Animated.ScrollView
            ref={hoursScrollRef}
            onScroll={hoursScrollHandler}
            scrollEventThrottle={16}
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: PADDING_ITEMS * TIMER_SLOT_HEIGHT,
              paddingBottom: PADDING_ITEMS * TIMER_SLOT_HEIGHT,
            }}
            snapToOffsets={hours.map((_, idx) => idx * TIMER_SLOT_HEIGHT)}>
            {hours.map((e, index) => (
              <TimeSlot
                key={e}
                value={e.toString()}
                height={TIMER_SLOT_HEIGHT}
                index={index}
                currentIndex={hourScrollPosition}
              />
            ))}
          </Animated.ScrollView>
        </AnimatedVisibilityView>
      </View>
      <View className="h-full w-1/4">
        <Animated.ScrollView
          ref={timeUnitsScrollRef}
          onScroll={timeUnitsScrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          snapToOffsets={timeUnits.map((_, idx) => idx * TIMER_SLOT_HEIGHT)}
          decelerationRate="fast"
          contentContainerStyle={{
            paddingTop: PADDING_ITEMS * TIMER_SLOT_HEIGHT,
            paddingBottom: PADDING_ITEMS * TIMER_SLOT_HEIGHT,
          }}>
          {timeUnits.map((e, index) => (
            <TimeSlot
              key={e}
              value={e}
              height={TIMER_SLOT_HEIGHT}
              index={index}
              currentIndex={timeUnitScrollPosition}
            />
          ))}
        </Animated.ScrollView>
      </View>
    </View>
  );
}

function AnimatedVisibilityView({
  children,
  visible,
  direction = 'right',
}: {
  children: React.ReactNode;
  visible: SharedValue<boolean>;
  direction?: 'left' | 'right';
}) {
  const animationProgress = useDerivedValue(() => {
    return withTiming(visible.value ? 1 : 0, {
      duration: 300,
    });
  });

  const animatedStyles = useAnimatedStyle(() => {
    const translateX = interpolate(
      animationProgress.value,
      [0, 1],
      direction === 'left' ? [-20, 0] : [20, 0],
      Extrapolation.CLAMP
    );

    const opacity = animationProgress.value;

    const pointerEvents = animationProgress.value === 0 ? 'none' : 'auto';

    return {
      opacity,
      transform: [{ translateX }],
      position: 'absolute',
      width: '100%',
      height: '100%',
      pointerEvents,
    };
  });

  return <Animated.View style={animatedStyles}>{children}</Animated.View>;
}

function TimeSlot({
  value,
  height,
  index,
  currentIndex,
}: {
  value: string;
  height: number;
  index: number;
  currentIndex: SharedValue<number>;
}) {
  const isNumber = !isNaN(parseInt(value, 10));

  const textStyle = useAnimatedStyle(() => {
    const diff = index - currentIndex.value;

    const rotateX = interpolate(
      diff,
      [-3, -2, -1, 0, 1, 2, 3],
      [120, 80, 30, 0, -30, -80, -120],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      Math.abs(diff),
      [0, 1, 2, 3],
      [1, 0.9, 0.8, 0.7],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      Math.abs(diff),
      [0, 1, 2, 3],
      [1, 0.6, 0.4, 0.2],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ perspective: 800 }, { rotateX: `${rotateX}deg` }, { scale }],
      opacity,
    };
  });

  return (
    <View
      style={{ height }}
      className={`w-full ${isNumber ? 'items-center' : 'items-start'} justify-center`}>
      <Animated.Text
        style={textStyle}
        className={`${isNumber ? 'text-3xl' : 'text-lg'} text-white`}>
        {value}
      </Animated.Text>
    </View>
  );
}
