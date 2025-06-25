import { useEffect } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { EntryDirection, ExitDirection, useScrollKeyframe } from './ScrollKeyframe';

const NAVBAR_HEIGHT = 80;
const ANIMATION_DURATION = 800;
const STAGGER_DELAY = 150;
const CARD_DELAY = 400;

const animationUtils = {
  cubicOut: Easing.out(Easing.cubic),
  cubicIn: Easing.in(Easing.cubic),

  animateElement: ({
    positionValue,
    opacityValue,
    targetPosition,
    duration,
    delay,
    easing,
    onComplete,
  }: {
    positionValue: SharedValue<number>;
    opacityValue: SharedValue<number>;
    targetPosition: number;
    duration: number;
    delay: number;
    easing: any;
    onComplete?: () => void;
  }) => {
    'worklet';

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

type Card = {
  id: number;
  title: string;
  description: string;
  separatorPos: SharedValue<number>;
  separatorOpacity: SharedValue<number>;
  titlePos: SharedValue<number>;
  titleOpacity: SharedValue<number>;
  descriptionPos: SharedValue<number>;
  descriptionOpacity: SharedValue<number>;
};

const cards = [
  {
    id: 1,
    title: 'High-Speed\nQuantum Calculations',
    description:
      'Quantum computers perform calculations exponentially faster than traditional ones.',
  },
  {
    id: 2,
    title: 'Solving Optimization\nProblems',
    description:
      'Quantum algorithms solve portfolio optimization, risk analysis, and trade execution swiftly.',
  },
  {
    id: 3,
    title: 'Simultaneus\nMulti-Calculations',
    description: 'Quantum computers analyze vast dataset and enable real-time decisions.',
  },
  {
    id: 4,
    title: 'Enhancing AI\nAccuracy and Efficiency',
    description:
      'Quantum computing improves AI algorithms for precise predictions and better risk management.',
  },
];

function useAnimatedCards() {
  const { height } = useWindowDimensions();

  const separator1Pos = useSharedValue(height);
  const separator1Opacity = useSharedValue(0);
  const title1Pos = useSharedValue(height);
  const title1Opacity = useSharedValue(0);
  const description1Pos = useSharedValue(height);
  const description1Opacity = useSharedValue(0);

  const separator2Pos = useSharedValue(height);
  const separator2Opacity = useSharedValue(0);
  const title2Pos = useSharedValue(height);
  const title2Opacity = useSharedValue(0);
  const description2Pos = useSharedValue(height);
  const description2Opacity = useSharedValue(0);

  const separator3Pos = useSharedValue(height);
  const separator3Opacity = useSharedValue(0);
  const title3Pos = useSharedValue(height);
  const title3Opacity = useSharedValue(0);
  const description3Pos = useSharedValue(height);
  const description3Opacity = useSharedValue(0);

  const separator4Pos = useSharedValue(height);
  const separator4Opacity = useSharedValue(0);
  const title4Pos = useSharedValue(height);
  const title4Opacity = useSharedValue(0);
  const description4Pos = useSharedValue(height);
  const description4Opacity = useSharedValue(0);

  const animatedCards = [
    {
      ...cards[0],
      separatorPos: separator1Pos,
      separatorOpacity: separator1Opacity,
      titlePos: title1Pos,
      titleOpacity: title1Opacity,
      descriptionPos: description1Pos,
      descriptionOpacity: description1Opacity,
    },
    {
      ...cards[1],
      separatorPos: separator2Pos,
      separatorOpacity: separator2Opacity,
      titlePos: title2Pos,
      titleOpacity: title2Opacity,
      descriptionPos: description2Pos,
      descriptionOpacity: description2Opacity,
    },
    {
      ...cards[2],
      separatorPos: separator3Pos,
      separatorOpacity: separator3Opacity,
      titlePos: title3Pos,
      titleOpacity: title3Opacity,
      descriptionPos: description3Pos,
      descriptionOpacity: description3Opacity,
    },
    {
      ...cards[3],
      separatorPos: separator4Pos,
      separatorOpacity: separator4Opacity,
      titlePos: title4Pos,
      titleOpacity: title4Opacity,
      descriptionPos: description4Pos,
      descriptionOpacity: description4Opacity,
    },
  ];

  return animatedCards;
}

function CardView({ e, height }: { e: Card; height: number }) {
  const rSeparatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: e.separatorPos.value }],
    opacity: e.separatorOpacity.value,
  }));

  const rTitleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: e.titlePos.value }],
    opacity: e.titleOpacity.value,
  }));

  const rDescriptionStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: e.descriptionPos.value }],
    opacity: e.descriptionOpacity.value,
  }));

  return (
    <View style={{ height }} className="justify-center">
      <Animated.View style={rSeparatorStyle} className="flex-row items-center gap-3">
        <View className="h-[1px] w-[10%] bg-gray-300" />
        <Text>{e.id}</Text>
        <View className="h-[1px] flex-1 bg-gray-300" />
      </Animated.View>
      <Animated.Text style={rTitleStyle} className="text-2xl">
        {e.title}
      </Animated.Text>
      <Animated.Text style={rDescriptionStyle}>{e.description}</Animated.Text>
    </View>
  );
}

export function ThirdView() {
  const { height } = useWindowDimensions();
  const { registerDirectionalEntry, registerDirectionalExit } = useScrollKeyframe();
  const animatedCards = useAnimatedCards();
  const CARD_HEIGHT = (height - NAVBAR_HEIGHT - 60 * 2) / 4;

  useEffect(() => {
    const unregister = registerDirectionalEntry((direction, complete) => {
      if (direction === EntryDirection.BOTTOM) {
        const reversedCards = animatedCards.slice().reverse();

        reversedCards.forEach((card, reverseIndex) => {
          const i = animatedCards.length - 1 - reverseIndex;
          const cardStartDelay = CARD_DELAY * reverseIndex;
          const distanceToTop = CARD_HEIGHT * (i + 1) + NAVBAR_HEIGHT;

          card.titleOpacity.value = 0;
          card.separatorOpacity.value = 0;
          card.descriptionOpacity.value = 0;
          card.separatorPos.value = -distanceToTop;
          card.titlePos.value = -distanceToTop;
          card.descriptionPos.value = -distanceToTop;

          animationUtils.animateElement({
            positionValue: card.descriptionPos,
            opacityValue: card.descriptionOpacity,
            targetPosition: 0,
            duration: ANIMATION_DURATION,
            delay: cardStartDelay,
            easing: animationUtils.cubicOut,
          });

          animationUtils.animateElement({
            positionValue: card.titlePos,
            opacityValue: card.titleOpacity,
            targetPosition: 0,
            duration: ANIMATION_DURATION,
            delay: cardStartDelay + STAGGER_DELAY,
            easing: animationUtils.cubicOut,
          });

          const isLastCard = reverseIndex === animatedCards.length - 1;
          animationUtils.animateElement({
            positionValue: card.separatorPos,
            opacityValue: card.separatorOpacity,
            targetPosition: 0,
            duration: ANIMATION_DURATION,
            delay: cardStartDelay + STAGGER_DELAY * 2,
            easing: animationUtils.cubicOut,
            onComplete: isLastCard ? complete : undefined,
          });
        });
      } else {
        animatedCards.forEach((card, i) => {
          const cardStartDelay = CARD_DELAY * i;

          card.titleOpacity.value = 0;
          card.separatorOpacity.value = 0;
          card.descriptionOpacity.value = 0;
          card.separatorPos.value = height;
          card.titlePos.value = height;
          card.descriptionPos.value = height;

          animationUtils.animateElement({
            positionValue: card.separatorPos,
            opacityValue: card.separatorOpacity,
            targetPosition: 0,
            duration: ANIMATION_DURATION,
            delay: cardStartDelay,
            easing: animationUtils.cubicOut,
          });

          animationUtils.animateElement({
            positionValue: card.titlePos,
            opacityValue: card.titleOpacity,
            targetPosition: 0,
            duration: ANIMATION_DURATION,
            delay: cardStartDelay + STAGGER_DELAY,
            easing: animationUtils.cubicOut,
          });

          const isLastCard = i === animatedCards.length - 1;
          animationUtils.animateElement({
            positionValue: card.descriptionPos,
            opacityValue: card.descriptionOpacity,
            targetPosition: 0,
            duration: ANIMATION_DURATION,
            delay: cardStartDelay + STAGGER_DELAY * 2,
            easing: animationUtils.cubicOut,
            onComplete: isLastCard ? complete : undefined,
          });
        });
      }
    });

    return unregister;
  }, []);

  useEffect(() => {
    const unregister = registerDirectionalExit((direction, complete) => {
      if (direction === ExitDirection.TOP) {
        const reversedCards = animatedCards.slice().reverse();

        reversedCards.forEach((card, reverseIndex) => {
          const i = animatedCards.length - 1 - reverseIndex;
          const cardStartDelay = CARD_DELAY * reverseIndex;
          const distanceToBottom = height + CARD_HEIGHT * (i + 1);

          animationUtils.animateElement({
            positionValue: card.descriptionPos,
            opacityValue: card.descriptionOpacity,
            targetPosition: distanceToBottom,
            duration: ANIMATION_DURATION,
            delay: cardStartDelay,
            easing: animationUtils.cubicIn,
          });

          animationUtils.animateElement({
            positionValue: card.titlePos,
            opacityValue: card.titleOpacity,
            targetPosition: distanceToBottom,
            duration: ANIMATION_DURATION,
            delay: cardStartDelay + STAGGER_DELAY,
            easing: animationUtils.cubicIn,
          });

          const isLastCard = reverseIndex === animatedCards.length - 1;
          animationUtils.animateElement({
            positionValue: card.separatorPos,
            opacityValue: card.separatorOpacity,
            targetPosition: distanceToBottom,
            duration: ANIMATION_DURATION,
            delay: cardStartDelay + STAGGER_DELAY * 2,
            easing: animationUtils.cubicIn,
            onComplete: isLastCard ? complete : undefined,
          });
        });
      } else {
        animatedCards.forEach((card, i) => {
          const cardStartDelay = CARD_DELAY * i;
          const distanceToTop = CARD_HEIGHT * (i + 1) + NAVBAR_HEIGHT;

          animationUtils.animateElement({
            positionValue: card.separatorPos,
            opacityValue: card.separatorOpacity,
            targetPosition: -distanceToTop,
            duration: ANIMATION_DURATION,
            delay: cardStartDelay,
            easing: animationUtils.cubicIn,
          });

          animationUtils.animateElement({
            positionValue: card.titlePos,
            opacityValue: card.titleOpacity,
            targetPosition: -distanceToTop,
            duration: ANIMATION_DURATION,
            delay: cardStartDelay + STAGGER_DELAY,
            easing: animationUtils.cubicIn,
          });

          const isLastCard = i === animatedCards.length - 1;
          animationUtils.animateElement({
            positionValue: card.descriptionPos,
            opacityValue: card.descriptionOpacity,
            targetPosition: -distanceToTop,
            duration: ANIMATION_DURATION,
            delay: cardStartDelay + STAGGER_DELAY * 2,
            easing: animationUtils.cubicIn,
            onComplete: isLastCard ? complete : undefined,
          });
        });
      }
    });

    return unregister;
  }, []);

  return (
    <View className="flex-1 px-6">
      {animatedCards.map((card) => (
        <CardView key={card.id} e={card} height={CARD_HEIGHT} />
      ))}
    </View>
  );
}
