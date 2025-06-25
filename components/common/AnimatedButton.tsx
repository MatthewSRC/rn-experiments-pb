import { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export function AnimatedButton({ onPress }: { onPress: () => void }) {
  const [loading, setLoading] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (loading) {
      progress.value = withRepeat(withTiming(1, { duration: 1000, easing: Easing.linear }), -1);
    } else {
      progress.value = 0;
    }
  }, [loading]);

  function handlePress() {
    setLoading(true);
    setTransitioning(true);
    setTimeout(() => setTransitioning(false), 2500);
    setTimeout(() => setLoading(false), 3000);
    onPress();
  }

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 2 * Math.PI}rad` }],
  }));

  return (
    <Pressable onPress={handlePress}>
      <Animated.View
        style={[
          rStyle,
          {
            width: transitioning ? 100 : 200,
            height: transitioning ? 100 : 60,
            borderWidth: transitioning ? 10 : 32,
            borderRadius: transitioning ? 50 : 20,
            borderColor: 'white',
            transitionProperty: ['width', 'height', 'borderWidth', 'borderRadius'],
            transitionDuration: transitioning ? [500, 500, 500, 500] : [300, 100, 100, 300],
            transitionDelay: transitioning ? 0 : 300,
          },
          { justifyContent: 'center', alignItems: 'center' },
        ]}>
        <Animated.View
          style={[
            {
              width: 200,
              height: transitioning ? 50 : 0,
              backgroundColor: 'black',
              transitionProperty: ['height'],
              transitionDuration: transitioning ? [600] : [300],
              transitionDelay: transitioning ? 0 : 0,
            },
          ]}
        />
        <Animated.Text
          style={{
            color: 'black',
            fontWeight: 'bold',
            fontSize: 18,
            position: 'absolute',
            alignSelf: 'center',
            opacity: transitioning ? 0 : 1,
            transform: [{ scale: transitioning ? 0 : 1 }],
            transitionProperty: ['opacity', 'transform'],
            transitionDuration: transitioning ? 100 : 650,
          }}>
          Test
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}
