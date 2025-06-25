import { EntryDirection, ExitDirection, useScrollKeyframe } from 'components/exito/ScrollKeyframe';
import { useEffect } from 'react';
import { useWindowDimensions, View, Text } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  Easing,
  SharedValue,
} from 'react-native-reanimated';

const NAVBAR_HEIGHT = 80;
const GAP = 24;
const STAGGER_DELAY = 250;
const ANIMATION_DURATION = 1000;

interface AnimatedCardProps {
  cardHeight: number;
  animatedPos: SharedValue<number>;
  animatedOpacity: SharedValue<number>;
  animatedIndicatorPos: SharedValue<number>;
  animatedTextsPos: SharedValue<number>;
  title: string;
  description: string;
  number: string;
}

function AnimatedCard({
  cardHeight,
  animatedPos,
  animatedOpacity,
  animatedIndicatorPos,
  animatedTextsPos,
  title,
  description,
  number,
}: AnimatedCardProps) {
  const rCardStyle = useAnimatedStyle(() => ({
    top: animatedPos.value,
    opacity: animatedOpacity.value,
    height: cardHeight,
  }));

  const rIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: animatedIndicatorPos.value }, { rotate: '-90deg' }],
  }));

  const rTextsStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: animatedTextsPos.value }],
  }));

  return (
    <Animated.View
      style={[rCardStyle]}
      className="w-full justify-between rounded-2xl bg-gray-200 px-10 py-12">
      <Animated.Text style={rTextsStyle} className="text-4xl font-semibold">
        {title}
      </Animated.Text>
      <View className="flex-row">
        <View className="justify-end pr-6">
          <Animated.View style={[rIndicatorStyle]} className="mb-6 flex-row items-center gap-6">
            <View className="h-[2px] w-6 rounded-full bg-black" />
            <Text className="text-2xl">{number}</Text>
          </Animated.View>
        </View>
        <View className="flex-1">
          <Animated.Text style={rTextsStyle} className="text-lg">
            {description}
          </Animated.Text>
        </View>
      </View>
    </Animated.View>
  );
}

interface AnimationParams {
  positionValue: SharedValue<number>;
  opacityValue: SharedValue<number>;
  textsValue?: SharedValue<number>;
  indicatorValue?: SharedValue<number>;
  targetPosition?: number;
  delay?: number;
  onComplete?: () => void;
}

const animationUtils = {
  cubicOut: Easing.out(Easing.cubic),
  cubicIn: Easing.in(Easing.cubic),

  animateCardFromTop: (params: AnimationParams) => {
    'worklet';
    const {
      positionValue,
      opacityValue,
      textsValue,
      indicatorValue,
      delay = 0,
      onComplete,
    } = params;

    opacityValue.value = withDelay(delay, withTiming(1, { duration: ANIMATION_DURATION }));

    positionValue.value = withDelay(
      delay,
      withTiming(0, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
      })
    );

    if (textsValue) {
      textsValue.value = withDelay(
        delay + STAGGER_DELAY,
        withTiming(0, {
          duration: ANIMATION_DURATION,
          easing: Easing.out(Easing.cubic),
        })
      );
    }

    if (indicatorValue) {
      if (onComplete) {
        indicatorValue.value = withDelay(
          delay + STAGGER_DELAY * 2,
          withTiming(
            0,
            {
              duration: ANIMATION_DURATION,
              easing: Easing.out(Easing.cubic),
            },
            (finished) => {
              if (finished && onComplete) {
                runOnJS(onComplete)();
              }
            }
          )
        );
      } else {
        indicatorValue.value = withDelay(
          delay + STAGGER_DELAY * 2,
          withTiming(0, {
            duration: ANIMATION_DURATION,
            easing: Easing.out(Easing.cubic),
          })
        );
      }
    }
  },

  animateCardFromBottom: (params: AnimationParams) => {
    'worklet';
    const {
      positionValue,
      opacityValue,
      textsValue,
      indicatorValue,
      delay = 0,
      onComplete,
    } = params;

    opacityValue.value = withDelay(delay, withTiming(1, { duration: ANIMATION_DURATION }));

    positionValue.value = withDelay(
      delay,
      withTiming(0, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
      })
    );

    if (textsValue) {
      textsValue.value = withDelay(
        delay + STAGGER_DELAY,
        withTiming(0, {
          duration: ANIMATION_DURATION,
          easing: Easing.out(Easing.cubic),
        })
      );
    }

    if (indicatorValue) {
      if (onComplete) {
        indicatorValue.value = withDelay(
          delay + STAGGER_DELAY * 2,
          withTiming(
            0,
            {
              duration: ANIMATION_DURATION,
              easing: Easing.out(Easing.cubic),
            },
            (finished) => {
              if (finished && onComplete) {
                runOnJS(onComplete)();
              }
            }
          )
        );
      } else {
        indicatorValue.value = withDelay(
          delay + STAGGER_DELAY * 2,
          withTiming(0, {
            duration: ANIMATION_DURATION,
            easing: Easing.out(Easing.cubic),
          })
        );
      }
    }
  },

  animateCardExit: (params: AnimationParams) => {
    'worklet';
    const { positionValue, opacityValue, targetPosition, delay = 0, onComplete } = params;

    if (!targetPosition) {
      console.warn('targetPosition is required for animateCardExit');
      return;
    }

    opacityValue.value = withDelay(delay, withTiming(0, { duration: ANIMATION_DURATION }));

    if (onComplete) {
      positionValue.value = withDelay(
        delay,
        withTiming(
          targetPosition,
          {
            duration: ANIMATION_DURATION,
            easing: Easing.in(Easing.cubic),
          },
          (finished) => {
            if (finished && onComplete) {
              runOnJS(onComplete)();
            }
          }
        )
      );
    } else {
      positionValue.value = withDelay(
        delay,
        withTiming(targetPosition, {
          duration: ANIMATION_DURATION,
          easing: Easing.in(Easing.cubic),
        })
      );
    }
  },
};

interface AnimatedCardState {
  pos: SharedValue<number>;
  opacity: SharedValue<number>;
  indicatorPos: SharedValue<number>;
  textsPos: SharedValue<number>;
}

export function SecondView() {
  const { height } = useWindowDimensions();
  const CARD_HEIGHT = (height - NAVBAR_HEIGHT - GAP * 6) / 2;
  const { registerDirectionalEntry, registerDirectionalExit } = useScrollKeyframe();

  const firstCard: AnimatedCardState = {
    pos: useSharedValue(height),
    opacity: useSharedValue(0),
    indicatorPos: useSharedValue(100),
    textsPos: useSharedValue(100),
  };

  const secondCard: AnimatedCardState = {
    pos: useSharedValue(height),
    opacity: useSharedValue(0),
    indicatorPos: useSharedValue(100),
    textsPos: useSharedValue(100),
  };

  useEffect(() => {
    const unregister = registerDirectionalEntry(
      (direction: EntryDirection, complete: () => void) => {
        const animateIn = () => {
          'worklet';

          if (direction === EntryDirection.BOTTOM) {
            firstCard.pos.value = -CARD_HEIGHT * 2 - GAP;
            secondCard.pos.value = -CARD_HEIGHT * 2 - GAP;
            firstCard.indicatorPos.value = -50;
            secondCard.indicatorPos.value = -50;
            firstCard.textsPos.value = -100;
            secondCard.textsPos.value = -100;

            animationUtils.animateCardFromBottom({
              positionValue: secondCard.pos,
              opacityValue: secondCard.opacity,
              textsValue: secondCard.textsPos,
              indicatorValue: secondCard.indicatorPos,
            });

            animationUtils.animateCardFromBottom({
              positionValue: firstCard.pos,
              opacityValue: firstCard.opacity,
              textsValue: firstCard.textsPos,
              indicatorValue: firstCard.indicatorPos,
              delay: STAGGER_DELAY,
              onComplete: complete,
            });
          } else if (direction === EntryDirection.TOP) {
            firstCard.pos.value = height;
            secondCard.pos.value = height;
            firstCard.indicatorPos.value = 50;
            secondCard.indicatorPos.value = 50;
            firstCard.textsPos.value = 100;
            secondCard.textsPos.value = 100;

            animationUtils.animateCardFromTop({
              positionValue: firstCard.pos,
              opacityValue: firstCard.opacity,
              textsValue: firstCard.textsPos,
              indicatorValue: firstCard.indicatorPos,
            });

            animationUtils.animateCardFromTop({
              positionValue: secondCard.pos,
              opacityValue: secondCard.opacity,
              textsValue: secondCard.textsPos,
              indicatorValue: secondCard.indicatorPos,
              delay: STAGGER_DELAY,
              onComplete: complete,
            });
          }
        };

        animateIn();
      }
    );

    return unregister;
  }, [
    registerDirectionalEntry,
    firstCard.pos,
    firstCard.opacity,
    firstCard.indicatorPos,
    firstCard.textsPos,
    secondCard.pos,
    secondCard.opacity,
    secondCard.indicatorPos,
    secondCard.textsPos,
    height,
    CARD_HEIGHT,
  ]);

  useEffect(() => {
    const unregister = registerDirectionalExit((direction: ExitDirection, complete: () => void) => {
      const animateOut = () => {
        'worklet';

        const targetPosition = direction === ExitDirection.BOTTOM ? -CARD_HEIGHT - GAP : height;

        if (direction === ExitDirection.BOTTOM) {
          animationUtils.animateCardExit({
            positionValue: firstCard.pos,
            opacityValue: firstCard.opacity,
            targetPosition,
          });

          animationUtils.animateCardExit({
            positionValue: secondCard.pos,
            opacityValue: secondCard.opacity,
            targetPosition,
            delay: STAGGER_DELAY,
            onComplete: complete,
          });
        } else {
          animationUtils.animateCardExit({
            positionValue: secondCard.pos,
            opacityValue: secondCard.opacity,
            targetPosition,
          });

          animationUtils.animateCardExit({
            positionValue: firstCard.pos,
            opacityValue: firstCard.opacity,
            targetPosition,
            delay: STAGGER_DELAY,
            onComplete: complete,
          });
        }
      };

      animateOut();
    });

    return unregister;
  }, [
    registerDirectionalExit,
    firstCard.pos,
    firstCard.opacity,
    secondCard.pos,
    secondCard.opacity,
    height,
    CARD_HEIGHT,
  ]);

  return (
    <View style={{ gap: GAP }} className="flex-1 p-6">
      <AnimatedCard
        cardHeight={CARD_HEIGHT}
        animatedPos={firstCard.pos}
        animatedOpacity={firstCard.opacity}
        animatedIndicatorPos={firstCard.indicatorPos}
        animatedTextsPos={firstCard.textsPos}
        title={'Optimized\nTrading Decisions'}
        description="AI algorithm analyze vast amounts of data. Identify patterns, and make predictions to optimize trading decisions."
        number="1"
      />
      <AnimatedCard
        cardHeight={CARD_HEIGHT}
        animatedPos={secondCard.pos}
        animatedOpacity={secondCard.opacity}
        animatedIndicatorPos={secondCard.indicatorPos}
        animatedTextsPos={secondCard.textsPos}
        title={'Adaptive\nPerformances'}
        description="Machine learning models adapt to changing market conditions and continuosly improve by learning from historical data."
        number="2"
      />
    </View>
  );
}
