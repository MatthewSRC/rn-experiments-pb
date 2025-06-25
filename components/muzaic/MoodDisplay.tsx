import { Blur, Canvas, ColorMatrix, Group, Paint, RoundedRect } from '@shopify/react-native-skia';
import React, { useMemo, useEffect, ReactNode } from 'react';
import { useWindowDimensions, ViewStyle, View } from 'react-native';
import {
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  useDerivedValue,
  SharedValue,
} from 'react-native-reanimated';

type RGBColor = [number, number, number];
type Position = [number, number];
type Frequency = {
  fx: number;
  fy: number;
};
type ShapeProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
};

interface MoodDisplayProps {
  topLeftComponent?: ReactNode;
  topRightComponent?: ReactNode;
  middleLeftComponent?: ReactNode;
  centerComponent?: ReactNode;
  middleRightComponent?: ReactNode;
  bottomLeftComponent?: ReactNode;
  bottomMiddleComponent?: ReactNode;
  bottomRightComponent?: ReactNode;
  containerStyle?: ViewStyle;
}

function useMoodColors(
  positions: Position[],
  frequencies: Frequency[],
  width: number
): SharedValue<string>[] {
  const moodColors: string[] = [
    '#F79F1F',
    '#FFDE59',
    '#FF5E7D',
    '#FF8B3D',
    '#CF4DFF',
    '#8B78FF',
    '#40CAFF',
  ];

  const parsedColors: RGBColor[] = useMemo(() => {
    return moodColors.map((hex) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      return [r, g, b];
    });
  }, [moodColors]);

  const progress1 = useSharedValue<number>(0);
  const progress2 = useSharedValue<number>(0);

  useEffect(() => {
    progress1.value = 0;
    progress2.value = 0;

    progress1.value = withRepeat(
      withTiming(2 * Math.PI, {
        duration: 25000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    progress2.value = withRepeat(
      withTiming(2 * Math.PI, {
        duration: 18000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    return () => {
      progress1.value = 0;
      progress2.value = 0;
    };
  }, []);

  function getColorForShape(
    index: number,
    progress1Value: number,
    progress2Value: number,
    colors: RGBColor[]
  ): string {
    'worklet';

    const position = positions[index];
    const x = position[0] / width;
    const y = position[1] / width;

    const fx = frequencies[index].fx;
    const fy = frequencies[index].fy;

    const phase = x * fx + y * fy;

    const p1 = progress1Value + phase;
    const p2 = progress2Value + phase;

    const sinP1 = Math.sin(p1);
    const sinP2 = Math.sin(p2 + Math.PI / 3);
    const r = sinP1 * 0.5 + 0.5;
    const g = sinP2 * 0.5 + 0.5;
    const b = Math.sin(p1 + p2) * 0.5 + 0.5;

    const colorSelector = (r + g + b) / 3;

    const totalColors = colors.length;
    const colorPosition = colorSelector * totalColors;

    const colorIndex1 = Math.floor(colorPosition) % totalColors;
    const colorIndex2 = (colorIndex1 + 1) % totalColors;

    const blendFactor = colorPosition - Math.floor(colorPosition);

    const color1 = colors[colorIndex1];
    const color2 = colors[colorIndex2];

    const rFinal = color1[0] * (1 - blendFactor) + color2[0] * blendFactor;
    const gFinal = color1[1] * (1 - blendFactor) + color2[1] * blendFactor;
    const bFinal = color1[2] * (1 - blendFactor) + color2[2] * blendFactor;

    const rHex = Math.round(rFinal * 255)
      .toString(16)
      .padStart(2, '0');
    const gHex = Math.round(gFinal * 255)
      .toString(16)
      .padStart(2, '0');
    const bHex = Math.round(bFinal * 255)
      .toString(16)
      .padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`;
  }

  const color0 = useDerivedValue(() =>
    getColorForShape(0, progress1.value, progress2.value, parsedColors)
  );
  const color1 = useDerivedValue(() =>
    getColorForShape(1, progress1.value, progress2.value, parsedColors)
  );
  const color2 = useDerivedValue(() =>
    getColorForShape(2, progress1.value, progress2.value, parsedColors)
  );
  const color3 = useDerivedValue(() =>
    getColorForShape(3, progress1.value, progress2.value, parsedColors)
  );
  const color4 = useDerivedValue(() =>
    getColorForShape(4, progress1.value, progress2.value, parsedColors)
  );
  const color5 = useDerivedValue(() =>
    getColorForShape(5, progress1.value, progress2.value, parsedColors)
  );
  const color6 = useDerivedValue(() =>
    getColorForShape(6, progress1.value, progress2.value, parsedColors)
  );
  const color7 = useDerivedValue(() =>
    getColorForShape(7, progress1.value, progress2.value, parsedColors)
  );

  return [color0, color1, color2, color3, color4, color5, color6, color7];
}

const BORDER_PADDING = 16;
const GAP = 20;
const ADJUSTMENT = 0;

export function MoodDisplay({
  topLeftComponent,
  topRightComponent,
  middleLeftComponent,
  centerComponent,
  middleRightComponent,
  bottomLeftComponent,
  bottomMiddleComponent,
  bottomRightComponent,
  containerStyle,
}: MoodDisplayProps): JSX.Element {
  const { width } = useWindowDimensions();

  const SMALL_BALL = width / 4;
  const BIG_BALL = width / 3;
  const SMALL_BALL_RADIUS = SMALL_BALL / 2;
  const BIG_BALL_RADIUS = BIG_BALL / 2;
  const CANVAS_HEIGHT = GAP + SMALL_BALL + GAP + SMALL_BALL + GAP + SMALL_BALL + GAP + GAP / 2;

  const positions: Position[] = useMemo(
    () => [
      [BORDER_PADDING + SMALL_BALL / 2, SMALL_BALL / 2],
      [BIG_BALL / 2, SMALL_BALL + GAP + ADJUSTMENT + BIG_BALL / 2], // middle left
      [
        BORDER_PADDING + SMALL_BALL / 2,
        SMALL_BALL + GAP + BIG_BALL + GAP + ADJUSTMENT + SMALL_BALL / 2,
      ], // bottom left
      [
        BORDER_PADDING + SMALL_BALL + GAP + (BIG_BALL - SMALL_BALL) / 2 + SMALL_BALL / 2,
        SMALL_BALL + GAP + (BIG_BALL - SMALL_BALL) / 2 + ADJUSTMENT + SMALL_BALL / 2,
      ], // center
      [
        BORDER_PADDING + SMALL_BALL + GAP + BIG_BALL / 2,
        SMALL_BALL + GAP + BIG_BALL + ADJUSTMENT + BIG_BALL / 2,
      ], // bottom middle
      [
        BORDER_PADDING + SMALL_BALL + GAP + BIG_BALL + GAP + SMALL_BALL / 2,
        ADJUSTMENT + SMALL_BALL / 2,
      ], // top right
      [
        BIG_BALL + GAP + SMALL_BALL + GAP - 5 + BIG_BALL / 2,
        SMALL_BALL + GAP + ADJUSTMENT + BIG_BALL / 2,
      ], // middle right
      [
        BORDER_PADDING + SMALL_BALL + GAP + BIG_BALL + GAP + SMALL_BALL / 2,
        SMALL_BALL + GAP + BIG_BALL + GAP + ADJUSTMENT + SMALL_BALL / 2,
      ], // bottom right
    ],
    [BORDER_PADDING, SMALL_BALL, BIG_BALL, GAP, ADJUSTMENT]
  );

  const frequencies: Frequency[] = positions.map((_, index) => ({
    fx: 2.5 + (index % 3) * 0.3,
    fy: 2.0 + ((index + 1) % 3) * 0.3,
  }));

  const colors: SharedValue<string>[] = useMoodColors(positions, frequencies, width);

  const shapeProps: ShapeProps[] = useMemo(
    () => [
      {
        x: BORDER_PADDING,
        y: ADJUSTMENT,
        width: SMALL_BALL,
        height: SMALL_BALL,
        radius: SMALL_BALL_RADIUS,
      },
      {
        x: 0,
        y: SMALL_BALL + GAP + ADJUSTMENT,
        width: BIG_BALL,
        height: BIG_BALL,
        radius: BIG_BALL_RADIUS,
      },
      {
        x: BORDER_PADDING,
        y: SMALL_BALL + GAP + BIG_BALL + GAP + ADJUSTMENT,
        width: SMALL_BALL,
        height: SMALL_BALL,
        radius: SMALL_BALL_RADIUS,
      },
      {
        x: BORDER_PADDING + SMALL_BALL + GAP + (BIG_BALL - SMALL_BALL) / 2,
        y: SMALL_BALL + GAP + (BIG_BALL - SMALL_BALL) / 2 + ADJUSTMENT,
        width: SMALL_BALL,
        height: SMALL_BALL,
        radius: SMALL_BALL_RADIUS,
      },
      {
        x: BORDER_PADDING + SMALL_BALL + GAP,
        y: SMALL_BALL + GAP + BIG_BALL + ADJUSTMENT,
        width: BIG_BALL,
        height: BIG_BALL,
        radius: BIG_BALL_RADIUS,
      },
      {
        x: BORDER_PADDING + SMALL_BALL + GAP + BIG_BALL + GAP,
        y: ADJUSTMENT,
        width: SMALL_BALL,
        height: SMALL_BALL,
        radius: SMALL_BALL_RADIUS,
      },
      {
        x: BIG_BALL + GAP + SMALL_BALL + GAP - 5,
        y: SMALL_BALL + GAP + ADJUSTMENT,
        width: BIG_BALL,
        height: BIG_BALL,
        radius: BIG_BALL_RADIUS,
      },
      {
        x: BORDER_PADDING + SMALL_BALL + GAP + BIG_BALL + GAP,
        y: SMALL_BALL + GAP + BIG_BALL + GAP + ADJUSTMENT,
        width: SMALL_BALL,
        height: SMALL_BALL,
        radius: SMALL_BALL_RADIUS,
      },
    ],
    [BORDER_PADDING, SMALL_BALL, BIG_BALL, GAP, ADJUSTMENT, SMALL_BALL_RADIUS, BIG_BALL_RADIUS]
  );

  const componentMap: (ReactNode | undefined)[] = [
    topLeftComponent,
    middleLeftComponent,
    bottomLeftComponent,
    centerComponent,
    bottomMiddleComponent,
    topRightComponent,
    middleRightComponent,
    bottomRightComponent,
  ];

  const layer = useMemo(
    () => (
      <Paint>
        <Blur blur={22} />
        <ColorMatrix matrix={[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 140, -60]} />
      </Paint>
    ),
    []
  );

  function getOverlayStyle(props: ShapeProps): ViewStyle {
    return {
      position: 'absolute',
      left: props.x + props.width / 2,
      top: props.y + props.height / 2,
      width: props.width,
      height: props.height,
      transform: [{ translateX: -props.width / 2 }, { translateY: -props.height / 2 }],
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    };
  }

  const rootStyle: ViewStyle = {
    position: 'relative',
    width,
    height: CANVAS_HEIGHT,
    ...containerStyle,
  };

  const canvasStyle: ViewStyle = {
    width,
    height: CANVAS_HEIGHT,
  };

  return (
    <View style={rootStyle}>
      <Canvas style={canvasStyle}>
        <Group layer={layer}>
          {shapeProps.map((props, index) => (
            <RoundedRect
              key={index}
              x={props.x}
              y={props.y}
              width={props.width}
              height={props.height}
              r={props.radius}
              color={colors[index]}
            />
          ))}
        </Group>
      </Canvas>

      {shapeProps.map((props, index) => {
        const component = componentMap[index];
        if (!component) return null;

        return (
          <View key={`overlay-${index}`} style={getOverlayStyle(props)}>
            {component}
          </View>
        );
      })}
    </View>
  );
}
