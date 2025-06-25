import {
  Blur,
  Canvas,
  ColorMatrix,
  Group,
  LinearGradient,
  Paint,
  Rect,
  RoundedRect,
  vec,
} from '@shopify/react-native-skia';
import React, { useEffect, useMemo, ReactNode } from 'react';
import { useWindowDimensions, View } from 'react-native';
import {
  Easing,
  interpolateColor,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface Position {
  x: number;
  y: number;
}

interface AnimatedMetricsProps {
  position?: Position;
  topLeftComponent?: ReactNode;
  topRightComponent?: ReactNode;
  bottomLeftComponent?: ReactNode;
  bottomRightComponent?: ReactNode;
}

interface ComponentOverlayProps {
  position: Position;
  topLeftComponent?: ReactNode;
  topRightComponent?: ReactNode;
  bottomLeftComponent?: ReactNode;
  bottomRightComponent?: ReactNode;
}

export function AnimatedMetrics({
  position = { x: 0.5, y: 0.5 },
  topLeftComponent = null,
  topRightComponent = null,
  bottomLeftComponent = null,
  bottomRightComponent = null,
}: AnimatedMetricsProps) {
  return (
    <View className="flex-1 bg-black">
      <Tiles position={position} />

      <ComponentOverlay
        position={position}
        topLeftComponent={topLeftComponent}
        topRightComponent={topRightComponent}
        bottomLeftComponent={bottomLeftComponent}
        bottomRightComponent={bottomRightComponent}
      />
    </View>
  );
}

function ComponentOverlay({
  position,
  topLeftComponent,
  topRightComponent,
  bottomLeftComponent,
  bottomRightComponent,
}: ComponentOverlayProps) {
  const { width, height } = useWindowDimensions();

  const BORDER = 24;
  const SQUARE_SIDE = (width * 80) / 100 - BORDER;
  const DISTANCE = 24;
  const HALF_SIDE = SQUARE_SIDE / 2;
  const EXTRA_PADDING = BORDER * 4;

  const canvasSize = SQUARE_SIDE + BORDER * 2 + DISTANCE + EXTRA_PADDING;
  const canvasPositionX =
    typeof position.x === 'number' && position.x <= 1 ? position.x * width : position.x;
  const canvasPositionY =
    typeof position.y === 'number' && position.y <= 1 ? position.y * height : position.y;
  const canvasScreenLeft = canvasPositionX - canvasSize / 2;
  const canvasScreenTop = canvasPositionY - canvasSize / 2;
  const canvasCenterX = canvasSize / 2;
  const canvasCenterY = canvasSize / 2;
  const squareLeft = canvasCenterX - SQUARE_SIDE / 2;
  const squareTop = canvasCenterY - SQUARE_SIDE / 2;

  const topLeftTileScreenX = canvasScreenLeft + squareLeft - BORDER + HALF_SIDE / 2;
  const topLeftTileScreenY = canvasScreenTop + squareTop - BORDER + HALF_SIDE / 2;

  const topRightFixedX =
    canvasScreenLeft + canvasCenterX + DISTANCE / 2 - BORDER / 2 + (HALF_SIDE + BORDER / 2) / 2;
  const topRightFixedY =
    canvasScreenTop + squareTop - DISTANCE / 2 - BORDER / 2 + (HALF_SIDE + BORDER / 2) / 2;

  const bottomLeftFixedX =
    canvasScreenLeft + squareLeft - DISTANCE / 2 - BORDER / 2 + (HALF_SIDE + BORDER / 2) / 2;
  const bottomLeftFixedY =
    canvasScreenTop + canvasCenterY + DISTANCE / 2 - BORDER / 2 + (HALF_SIDE + BORDER / 2) / 2;

  const bottomRightTileScreenX = canvasScreenLeft + canvasCenterX + BORDER / 2 + HALF_SIDE / 2;
  const bottomRightTileScreenY = canvasScreenTop + canvasCenterY + BORDER / 2 + HALF_SIDE / 2;

  const topLeftContainerStyle = {
    position: 'absolute' as 'absolute',
    left: topLeftTileScreenX,
    top: topLeftTileScreenY,
    width: HALF_SIDE,
    height: HALF_SIDE,
    transform: [{ translateX: -HALF_SIDE / 2 }, { translateY: -HALF_SIDE / 2 }],
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  };

  const topRightContainerStyle = {
    position: 'absolute' as 'absolute',
    left: topRightFixedX,
    top: topRightFixedY,
    width: HALF_SIDE + BORDER / 2,
    height: HALF_SIDE + BORDER / 2,
    transform: [
      { translateX: -((HALF_SIDE + BORDER / 2) / 2) },
      { translateY: -((HALF_SIDE + BORDER / 2) / 2) },
    ],
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  };

  const bottomLeftContainerStyle = {
    position: 'absolute' as 'absolute',
    left: bottomLeftFixedX,
    top: bottomLeftFixedY,
    width: HALF_SIDE + BORDER / 2,
    height: HALF_SIDE + BORDER / 2,
    transform: [
      { translateX: -((HALF_SIDE + BORDER / 2) / 2) },
      { translateY: -((HALF_SIDE + BORDER / 2) / 2) },
    ],
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  };

  const bottomRightContainerStyle = {
    position: 'absolute' as 'absolute',
    left: bottomRightTileScreenX,
    top: bottomRightTileScreenY,
    width: HALF_SIDE,
    height: HALF_SIDE,
    transform: [{ translateX: -HALF_SIDE / 2 }, { translateY: -HALF_SIDE / 2 }],
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  };

  return (
    <View
      style={{
        position: 'absolute' as const,
        width,
        height,
        pointerEvents: 'box-none' as const,
      }}>
      {/* Top Left Component */}
      {topLeftComponent && <View style={topLeftContainerStyle}>{topLeftComponent}</View>}

      {/* Top Right Component */}
      {topRightComponent && <View style={topRightContainerStyle}>{topRightComponent}</View>}

      {/* Bottom Left Component */}
      {bottomLeftComponent && <View style={bottomLeftContainerStyle}>{bottomLeftComponent}</View>}

      {/* Bottom Right Component */}
      {bottomRightComponent && (
        <View style={bottomRightContainerStyle}>{bottomRightComponent}</View>
      )}
    </View>
  );
}

interface TilesProps {
  position: Position;
}

function Tiles({ position = { x: 0.5, y: 0.5 } }: TilesProps) {
  const { width, height } = useWindowDimensions();

  const expand = useSharedValue(0);
  const expandTop = useSharedValue(1);
  const gradientMove = useSharedValue(0);

  const BORDER = 24;
  const SQUARE_SIDE = (width * 80) / 100 - BORDER;
  const DISTANCE = 24;
  const ADJUSTMENT = 10;
  const RADIUS = 24;
  const HALF_SIDE = SQUARE_SIDE / 2;

  const EXTRA_PADDING = BORDER * 4;

  const ANIMATION_FACTOR = -6;

  const canvasSize = SQUARE_SIDE + BORDER * 2 + DISTANCE + EXTRA_PADDING;

  const canvasPositionX =
    typeof position.x === 'number' && position.x <= 1 ? position.x * width : position.x;

  const canvasPositionY =
    typeof position.y === 'number' && position.y <= 1 ? position.y * height : position.y;

  const canvasScreenLeft = canvasPositionX - canvasSize / 2;
  const canvasScreenTop = canvasPositionY - canvasSize / 2;

  const canvasCenterX = canvasSize / 2;
  const canvasCenterY = canvasSize / 2;

  useEffect(() => {
    expand.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
        withTiming(0, { duration: 4000, easing: Easing.bezier(0.4, 0, 0.2, 1) })
      ),
      -1,
      true
    );
    expandTop.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 4000, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
        withTiming(1, { duration: 2000, easing: Easing.bezier(0.4, 0, 0.2, 1) })
      ),
      -1,
      true
    );
    gradientMove.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 500, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
        withTiming(0, { duration: 2500, easing: Easing.bezier(0.4, 0, 0.2, 1) })
      ),
      -1,
      true
    );
  }, []);

  const expandingValue = useDerivedValue(
    () => [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 30, -13],
    []
  );

  const blurLayer = useMemo(
    () => (
      <Paint>
        <Blur blur={20} />
        <ColorMatrix matrix={expandingValue} />
      </Paint>
    ),
    [expandingValue]
  );

  const topRightGradient = useDerivedValue(() => {
    const topColor = interpolateColor(gradientMove.value, [0, 1], ['#0e7490', '#67e8f9']);
    const bottomColor = interpolateColor(gradientMove.value, [0, 1], ['#67e8f9', '#0e7490']);
    const baseColor = interpolateColor(gradientMove.value, [0, 1], ['white', '#cffafe']);
    return [baseColor, bottomColor, topColor];
  }, []);

  const bottomLeftGradient = useDerivedValue(() => {
    const topColor = interpolateColor(gradientMove.value, [0, 1], ['#0e7490', '#67e8f9']);
    const bottomColor = interpolateColor(gradientMove.value, [0, 1], ['#67e8f9', '#0e7490']);
    const baseColor = interpolateColor(gradientMove.value, [0, 1], ['white', '#cffafe']);
    return [baseColor, bottomColor, topColor];
  }, []);

  const squareLeft = canvasCenterX - SQUARE_SIDE / 2;
  const squareTop = canvasCenterY - SQUARE_SIDE / 2;

  const topRightX = useDerivedValue(() => {
    const change = expandTop.value * ANIMATION_FACTOR;
    return canvasCenterX - BORDER / 2 + ADJUSTMENT / 2 + change;
  }, []);

  const topRightY = useDerivedValue(() => {
    const change = expandTop.value * ANIMATION_FACTOR;
    return squareTop - BORDER - ADJUSTMENT / 2 + change;
  }, [squareTop]);

  const topRightDimensions = useDerivedValue(() => {
    const change = expandTop.value * ANIMATION_FACTOR;
    return HALF_SIDE + BORDER - change * 2;
  }, []);

  const bottomLeftX = useDerivedValue(() => {
    const change = expand.value * ANIMATION_FACTOR;
    return squareLeft - BORDER - ADJUSTMENT / 2 + change;
  }, [squareLeft]);

  const bottomLeftY = useDerivedValue(() => {
    const change = expand.value * ANIMATION_FACTOR;
    return canvasCenterY - BORDER / 2 + ADJUSTMENT / 2 + change;
  }, []);

  const bottomLeftDimensions = useDerivedValue(() => {
    const change = expand.value * ANIMATION_FACTOR;
    return HALF_SIDE + BORDER - change * 2;
  }, []);

  const topLeftRect = useMemo(
    () => (
      <RoundedRect
        x={squareLeft - BORDER}
        y={squareTop - BORDER}
        width={HALF_SIDE}
        height={HALF_SIDE}
        color="#1a1a1a"
        r={RADIUS}
      />
    ),
    [squareLeft, squareTop, HALF_SIDE, BORDER, RADIUS]
  );

  const bottomRightRect = useMemo(
    () => (
      <RoundedRect
        x={canvasCenterX + BORDER / 2}
        y={canvasCenterY + BORDER / 2}
        width={HALF_SIDE}
        height={HALF_SIDE}
        color="#1a1a1a"
        r={RADIUS}
      />
    ),
    [canvasCenterX, canvasCenterY, HALF_SIDE, BORDER, RADIUS]
  );

  const topRightRectBorder = useMemo(
    () => (
      <Rect
        x={topRightX}
        y={topRightY}
        width={topRightDimensions}
        height={topRightDimensions}
        color="#22d3ee">
        <LinearGradient
          start={vec(canvasCenterX + HALF_SIDE, squareTop)}
          end={vec(canvasCenterX, squareTop + HALF_SIDE)}
          colors={topRightGradient}
        />
      </Rect>
    ),
    [
      topRightX,
      topRightY,
      topRightDimensions,
      canvasCenterX,
      squareTop,
      HALF_SIDE,
      topRightGradient,
    ]
  );

  const bottomLeftRectBorder = useMemo(
    () => (
      <Rect
        x={bottomLeftX}
        y={bottomLeftY}
        width={bottomLeftDimensions}
        height={bottomLeftDimensions}
        color="#22d3ee">
        <LinearGradient
          start={vec(squareLeft, canvasCenterY + HALF_SIDE)}
          end={vec(squareLeft + HALF_SIDE, canvasCenterY)}
          colors={bottomLeftGradient}
        />
      </Rect>
    ),
    [
      bottomLeftX,
      bottomLeftY,
      bottomLeftDimensions,
      squareLeft,
      canvasCenterY,
      HALF_SIDE,
      bottomLeftGradient,
    ]
  );

  const topRightRect = useMemo(
    () => (
      <RoundedRect
        x={canvasCenterX + DISTANCE / 2 - BORDER / 2}
        y={squareTop - DISTANCE / 2 - BORDER / 2}
        width={HALF_SIDE + BORDER / 2}
        height={HALF_SIDE + BORDER / 2}
        r={RADIUS}>
        <LinearGradient
          start={vec(canvasCenterX + HALF_SIDE + BORDER * 2, squareTop - BORDER * 2)}
          end={vec(canvasCenterX, squareTop + HALF_SIDE)}
          colors={['white', '#67e8f9']}
        />
      </RoundedRect>
    ),
    [canvasCenterX, squareTop, HALF_SIDE, DISTANCE, BORDER, RADIUS]
  );

  const bottomLeftRect = useMemo(
    () => (
      <RoundedRect
        x={squareLeft - DISTANCE / 2 - BORDER / 2}
        y={canvasCenterY + DISTANCE / 2 - BORDER / 2}
        width={HALF_SIDE + BORDER / 2}
        height={HALF_SIDE + BORDER / 2}
        r={RADIUS}>
        <LinearGradient
          start={vec(squareLeft - BORDER * 2, canvasCenterY + HALF_SIDE + BORDER * 2)}
          end={vec(squareLeft + HALF_SIDE, canvasCenterY)}
          colors={['white', '#67e8f9']}
        />
      </RoundedRect>
    ),
    [squareLeft, canvasCenterY, HALF_SIDE, DISTANCE, BORDER, RADIUS]
  );

  return (
    <Canvas
      style={{
        position: 'absolute',
        left: canvasScreenLeft,
        top: canvasScreenTop,
        width: canvasSize,
        height: canvasSize,
      }}>
      <Rect x={squareLeft} y={squareTop} width={SQUARE_SIDE} height={SQUARE_SIDE} color="black" />
      {topLeftRect}
      {bottomRightRect}
      <Group layer={blurLayer}>
        {topRightRectBorder}
        {bottomLeftRectBorder}
      </Group>
      {topRightRect}
      {bottomLeftRect}
    </Canvas>
  );
}
