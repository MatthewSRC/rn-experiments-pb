import { useEffect, useState } from 'react';
import { TextStyle, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export function DynamicText({ children, style, fixedWidth }: Props) {
  return (
    <View style={{ width: fixedWidth }} className="flex-row">
      {children.split('').map((e, index) => (
        <DynamicChar key={index} char={e} style={style} />
      ))}
    </View>
  );
}

function DynamicChar({ char, style }: CharProps) {
  const [displayChar, setDisplayChar] = useState<string>(char);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (displayChar !== char) {
      progress.value = withSequence(
        withTiming(
          0.5,
          {
            duration: 300,
            easing: Easing.inOut(Easing.cubic),
          },
          () => {
            runOnJS(setDisplayChar)(char);
          }
        ),

        withTiming(
          1,
          {
            duration: 300,
            easing: Easing.out(Easing.cubic),
          },
          () => {
            progress.value = 0;
          }
        )
      );
    }
  }, [char, displayChar, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    let rotateX = 0;
    if (progress.value <= 0.5) {
      rotateX = progress.value * 180;
    } else {
      rotateX = (1 - progress.value) * 180;
    }

    return {
      transform: [{ rotateX: `${rotateX}deg` }, { perspective: 1000 }],
      opacity: progress.value <= 0.5 ? 1 - progress.value * 2 : (progress.value - 0.5) * 2,
    };
  });

  return <Animated.Text style={[style, animatedStyle]}>{displayChar}</Animated.Text>;
}

interface CharProps {
  char: string;
  style?: TextStyle;
}

interface Props {
  children: string;
  style?: TextStyle;
  fixedWidth?: number;
}
