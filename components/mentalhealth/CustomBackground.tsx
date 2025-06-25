import { Canvas, Fill, LinearGradient, vec } from '@shopify/react-native-skia';
import { StyleSheet, useWindowDimensions } from 'react-native';

export function CustomBackground({ colors }: Props) {
  const { width, height } = useWindowDimensions();
  return (
    <Canvas style={StyleSheet.absoluteFill}>
      <Fill>
        <LinearGradient start={vec(0, 0)} end={vec(width, height)} colors={colors} />
      </Fill>
    </Canvas>
  );
}

interface Props {
  colors: string[];
}
