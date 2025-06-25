import React, { useEffect } from 'react';
import { View, StyleSheet, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

/**
 * Props for the FadeText component.
 */
interface FadeTextProps {
  /** The text to be displayed with a fade-in or fade-out animation. */
  children: string;
  /** Fade animation duration in milliseconds. */
  fadeSpeed?: number;
  /** Next char's fade start delay in milliseconds */
  fadeDelay?: number;
  /** Spacing between each letter. */
  textSpacing?: number;
  /** If true, the text will fade out instead of fading in. */
  fadeOut?: boolean;
  /** Custom styles for the text (e.g., font size, color, font weight). */
  style?: TextStyle;
}

/**
 * A component that animates text characters with a fade-in or fade-out effect.
 *
 * @param {FadeTextProps} props - Component props.
 * @returns {JSX.Element} Animated text.
 */
export const FadeText: React.FC<FadeTextProps> = ({
  children,
  fadeSpeed = 500,
  fadeDelay = 100,
  textSpacing = 4,
  fadeOut = false,
  style = {},
}) => {
  return (
    <View style={[styles.container, { gap: textSpacing }]}>
      {children.split('').map((char, index) => (
        <FadedLetter
          key={index}
          index={index}
          char={char}
          fadeSpeed={fadeSpeed}
          fadeDelay={fadeDelay}
          fadeOut={fadeOut}
          style={style}
        />
      ))}
    </View>
  );
};

/**
 * A single animated character that fades in or out with a delay.
 *
 * @param {object} props - Component props.
 * @param {number} props.index - The index of the character in the text.
 * @param {string} props.char - The character to display.
 * @param {number} props.fadeSpeed - The duration of the fade effect.
 * @param {number} props.fadeDelay - The delay between char fade effect.
 * @param {boolean} props.fadeOut - If true, the text will fade out instead of fading in.
 * @param {TextStyle} props.style - Custom styles for the text.
 * @returns {JSX.Element} Animated character.
 */
const FadedLetter: React.FC<{
  index: number;
  char: string;
  fadeSpeed: number;
  fadeDelay: number;
  fadeOut: boolean;
  style: TextStyle;
}> = ({ index, char, fadeSpeed, fadeDelay, fadeOut, style }) => {
  const opacity = useSharedValue(fadeOut ? 1 : 0);

  useEffect(() => {
    opacity.value = withDelay(
      index * fadeDelay,
      withTiming(fadeOut ? 0 : 1, { duration: fadeSpeed })
    );
  }, [opacity, index, fadeSpeed, fadeDelay, fadeOut]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.Text style={[animatedStyle, style]}>{char}</Animated.Text>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default FadeText;
