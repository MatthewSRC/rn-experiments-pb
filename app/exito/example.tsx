import { ExitDirection, ScrollKeyframe, useScrollKeyframe } from 'components/exito/ScrollKeyframe';
import { ScrollTimeline } from 'components/exito/ScrollTimeline';
import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const SimpleExample = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollTimeline length={3000}>
        <ScrollKeyframe position={{ start: 100, end: 500 }}>
          <Card text="Test1" top={350} backgroundColor="red" />
        </ScrollKeyframe>
        <ScrollKeyframe position={{ start: 600, end: 1200 }}>
          <Card text="Test2" top={350} backgroundColor="green" />
        </ScrollKeyframe>
        <ScrollKeyframe position={{ start: 1300, end: 2000 }}>
          <Card text="Test3" top={350} backgroundColor="blue" />
        </ScrollKeyframe>
      </ScrollTimeline>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    width: 180,
    height: 100,
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    position: 'absolute',
  },
  cardTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  progressText: {
    color: 'white',
    fontSize: 12,
  },
  directionText: {
    color: 'white',
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default SimpleExample;

function Card({
  text,
  top,
  backgroundColor,
}: {
  text: string;
  top: number;
  backgroundColor: string;
}) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);
  const scale = useSharedValue(0.8);
  const rotation = useSharedValue(0);

  const { isActive, exitDirection, registerDirectionalExit, progress } = useScrollKeyframe();

  // Handle entrance animation
  useEffect(() => {
    if (isActive) {
      opacity.value = withTiming(1, { duration: 500 });
      translateY.value = withSpring(0);
      scale.value = withSpring(1);
      rotation.value = withTiming(0);
    }
  }, [isActive, opacity, translateY, scale, rotation]);

  // Register directional exit animation
  useEffect(() => {
    const unregister = registerDirectionalExit((direction, complete) => {
      const animateOut = () => {
        'worklet';

        // Different animations based on exit direction
        if (direction === ExitDirection.TOP) {
          // Exited from top (scrolled up)
          opacity.value = withTiming(0, { duration: 500 });
          translateY.value = withTiming(-100, { duration: 500 });
          scale.value = withTiming(0.5, { duration: 500 });
          rotation.value = withTiming(-15, { duration: 500 }, (finished) => {
            runOnJS(complete)();
          });
        } else {
          // Exited from bottom (scrolled down)
          opacity.value = withTiming(0, { duration: 500 });
          translateY.value = withTiming(100, { duration: 500 });
          scale.value = withTiming(0.5, { duration: 500 });
          rotation.value = withTiming(15, { duration: 500 }, (finished) => {
            runOnJS(complete)();
          });
        }
      };

      animateOut();
    });

    return unregister;
  }, [registerDirectionalExit, opacity, translateY, scale, rotation]);

  // Scroll-based animation styles
  const scrollAnimatedStyle = useAnimatedStyle(() => {
    // Only apply scroll animations when active
    if (!isActive) {
      return {};
    }

    // Create smooth scroll-responsive animations
    const dynamicScale = interpolate(progress, [0, 0.5, 1], [0.9, 1.1, 0.9], Extrapolation.CLAMP);

    const dynamicRotate = interpolate(progress, [0, 0.5, 1], [-5, 0, 5], Extrapolation.CLAMP);

    return {
      transform: [{ scale: dynamicScale }, { rotate: `${dynamicRotate}deg` }],
    };
  });

  // Combine base and scroll animations
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
        { rotate: `${rotation.value}deg` },
      ],
    };
  });

  return (
    <Animated.View
      style={[styles.card, { top, backgroundColor }, animatedStyle, scrollAnimatedStyle]}>
      <Text style={styles.cardTitle}>{text}</Text>
      <Text style={styles.progressText}>Progress: {Math.round(progress * 100)}%</Text>
      {!isActive && exitDirection !== ExitDirection.NONE && (
        <Text style={styles.directionText}>Exit: {exitDirection}</Text>
      )}
    </Animated.View>
  );
}
