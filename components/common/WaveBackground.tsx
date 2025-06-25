import { Canvas, LinearGradient, Rect, vec } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { useDerivedValue, useSharedValue, interpolateColor } from 'react-native-reanimated';

export function WaveBackground() {
  const { width, height } = useWindowDimensions();

  const colors = ['cyan', 'magenta'];
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    const animate = () => {
      progress.value = (progress.value + 0.01) % 2;
      requestAnimationFrame(animate);
    };
    const animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const topColor = useDerivedValue(() =>
    interpolateColor(Math.sin(progress.value * Math.PI), [-1, 1], [colors[0], colors[1]])
  );

  const middleColor = useDerivedValue(() =>
    interpolateColor(Math.sin((progress.value + 0.67) * Math.PI), [-1, 1], [colors[1], colors[0]])
  );

  const bottomColor = useDerivedValue(() =>
    interpolateColor(Math.sin((progress.value + 1.33) * Math.PI), [-1, 1], [colors[0], colors[1]])
  );

  const gradientColors = useDerivedValue(() => [
    topColor.value,
    middleColor.value,
    bottomColor.value,
  ]);

  return (
    <Canvas style={{ width, height }}>
      <Rect x={0} y={0} width={width} height={height}>
        <LinearGradient start={vec(0, 0)} end={vec(width, height)} colors={gradientColors} />
      </Rect>
    </Canvas>
  );
}
