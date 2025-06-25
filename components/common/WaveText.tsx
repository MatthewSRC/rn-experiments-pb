import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextStyle } from 'react-native';
import Animated from 'react-native-reanimated';

/**
 * Props for the WaveText component.
 */
interface WaveTextProps {
  /** The text to be displayed with a wave color animation. */
  children: string;
  /** Spacing between each letter. */
  textSpacing?: number;
  /** Custom styles for the text (e.g., font size, font weight). */
  style?: TextStyle;
  /** Colors to be used in the wave animation. */
  waveColors?: [string, string];
  /** How long a single wave lasts in milliseconds. */
  waveDuration?: number;
  /** Delay between each letter's transition in the wave. */
  waveDelay?: number;
  /** How long the text stays in the initial color before starting a new wave. */
  waveInterval?: number;
  /** Speed of the color transition in milliseconds. */
  waveSpeed?: number;
}

/**
 * A text component that creates an infinite wave color animation.
 *
 * @param {WaveTextProps} props - Component props.
 * @returns {JSX.Element} Animated text with wave effect.
 */
export const WaveText: React.FC<WaveTextProps> = ({
  children,
  textSpacing = 4,
  style = {},
  waveColors = ['#fa7f7c', '#87cce8'],
  waveDuration = 2000,
  waveDelay = 100,
  waveInterval = 1000,
  waveSpeed = 500,
}) => {
  return (
    <View style={[styles.container, { gap: textSpacing }]}>
      {children.split('').map((char, index) => (
        <WaveLetter
          key={index}
          index={index}
          char={char}
          style={style}
          waveColors={waveColors}
          waveDuration={waveDuration}
          waveDelay={waveDelay}
          waveInterval={waveInterval}
          waveSpeed={waveSpeed}
        />
      ))}
    </View>
  );
};

/**
 * A single animated character that cycles between two colors in a wave effect.
 *
 * @param {object} props - Component props.
 * @param {number} props.index - The index of the character in the text.
 * @param {string} props.char - The character to display.
 * @param {TextStyle} props.style - Custom styles for the text.
 * @param {[string, string]} props.waveColors - Colors for the wave animation.
 * @param {number} props.waveDuration - Duration of the wave animation.
 * @param {number} props.waveDelay - Delay between each letter's transition.
 * @param {number} props.waveInterval - Wait time between waves.
 * @param {number} props.waveSpeed - Speed of the color transition.
 * @returns {JSX.Element} Animated character.
 */
const WaveLetter: React.FC<{
  index: number;
  char: string;
  style: TextStyle;
  waveColors: [string, string];
  waveDuration: number;
  waveDelay: number;
  waveInterval: number;
  waveSpeed: number;
}> = ({ index, char, style, waveColors, waveDuration, waveDelay, waveInterval, waveSpeed }) => {
  const [isWaving, setWaving] = useState(false);

  useEffect(() => {
    const startWave = () => {
      setTimeout(() => setWaving(true), index * waveDelay);

      setTimeout(() => setWaving(false), waveDuration + index * waveDelay);
    };

    startWave();
    const interval = setInterval(startWave, waveDuration + waveInterval);

    return () => clearInterval(interval);
  }, [index, waveDuration, waveDelay, waveInterval]);

  return (
    <Animated.Text
      style={[
        style,
        {
          transitionProperty: 'color',
          color: isWaving ? waveColors[1] : waveColors[0],
          transitionDuration: `${waveSpeed}ms`,
        },
      ]}>
      {char}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default WaveText;
